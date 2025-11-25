import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Definimos rutas especiales
const comunidadPaths = ["/comunidad"];
const adminOnlyPaths = ["/dashboard", "/dashboard/gestionUsuarios"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const access_token = req.cookies.get("sb-access-token")?.value;

  // Si no hay token → redirigir al inicio con mensaje
  if (!access_token) {
    url.pathname = "/";
    url.searchParams.set("mensaje", "Sesión cerrada o no iniciada");
    return NextResponse.redirect(url);
  }

  // Intentar obtener el usuario desde Supabase
  const { data: { user }, error } = await supabase.auth.getUser(access_token);
  if (error || !user) {
    url.pathname = "/";
    url.searchParams.set("mensaje", "Sesión cerrada o inválida");
    return NextResponse.redirect(url);
  }

  // Buscar información extra en la tabla usuario
  const { data: usuario, error: usuarioError } = await supabase
    .from("usuario")
    .select("rol, acceso_comunidad, eliminado")
    .eq("id", user.id)
    .single();

  // Si hay error o usuario no encontrado
  if (usuarioError || !usuario) {
    url.pathname = "/";
    url.searchParams.set("mensaje", "Acceso restringido");
    return NextResponse.redirect(url);
  }

  // Bloquear si el usuario está eliminado (soft delete)
  if (usuario.eliminado) {
    url.pathname = "/";
    url.searchParams.set("mensaje", "Tu cuenta está deshabilitada");
    return NextResponse.redirect(url);
  }

  // REGLAS DE ACCESO
  // Comunidad: solo si acceso_comunidad = true
  if (comunidadPaths.some((p) => url.pathname.startsWith(p))) {
    if (!usuario.acceso_comunidad) {
      url.pathname = "/";
      url.searchParams.set("mensaje", "Acceso restringido a la comunidad");
      return NextResponse.redirect(url);
    }
  }

  // Dashboard: solo admins y superAdmins
  if (adminOnlyPaths.some((p) => url.pathname.startsWith(p))) {
    if (usuario.rol !== "admin" && usuario.rol !== "superAdmin") {
      url.pathname = "/";
      url.searchParams.set("mensaje", "No tenés permisos para acceder al panel");
      return NextResponse.redirect(url);
    }
  }

  // Si todo está bien, permite continuar
  return NextResponse.next();
}

// Define en qué rutas aplica el middleware
export const config = {
  matcher: [
    "/comunidad/:path*",
    "/dashboard/:path*",
  ],
};

//MODIFICAR PARA USAR COOKIES HTTPONLY CON SUPABASE
/*
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Importación clave para manejar cookies HttpOnly en el entorno Next.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'; 

// Definimos rutas especiales
const comunidadPaths = ["/comunidad"];
const adminOnlyPaths = ["/dashboard", "/dashboard/gestionUsuarios"];

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    
    // 1. Prepara la respuesta para que el cliente de Supabase pueda manejar las cookies
    const res = NextResponse.next();
    
    // 2. Crea el cliente de Supabase Server/Edge que puede leer y escribir cookies HttpOnly
    const supabase = createMiddlewareClient({ req, res });

    // 3. Intenta obtener la sesión. Esto lee las cookies de autenticación automáticamente.
    // Si hay tokens válidos (incluyendo HttpOnly), retorna la sesión.
    const { 
        data: { session }, 
    } = await supabase.auth.getSession();
    
    // --- LÓGICA DE REDIRECCIÓN SI NO HAY SESIÓN ---
    
    // Si no hay sesión (no hay tokens válidos o el token HttpOnly no pudo ser leído por el helper)
    if (!session) {
        url.pathname = "/";
        url.searchParams.set("mensaje", "Sesión cerrada o no iniciada");
        
        // Redirige al inicio con el mensaje
        return NextResponse.redirect(url);
    }
    
    // --- LÓGICA DE PERMISOS SI HAY SESIÓN ---

    const user_id = session.user.id; 
    
    // Buscar información extra en la tabla 'usuario' usando el cliente de Supabase creado
    const { data: usuario, error: usuarioError } = await supabase
        .from("usuario")
        .select("rol, acceso_comunidad, eliminado")
        .eq("id", user_id)
        .single();

    // Si hay error o usuario no encontrado
    if (usuarioError || !usuario) {
        url.pathname = "/";
        url.searchParams.set("mensaje", "Acceso restringido: usuario no registrado");
        return NextResponse.redirect(url);
    }

    // Bloquear si el usuario está eliminado (soft delete)
    if (usuario.eliminado) {
        url.pathname = "/";
        url.searchParams.set("mensaje", "Tu cuenta está deshabilitada");
        return NextResponse.redirect(url);
    }

    // REGLAS DE ACCESO
    // Comunidad: solo si acceso_comunidad = true
    if (comunidadPaths.some((p) => url.pathname.startsWith(p))) {
        if (!usuario.acceso_comunidad) {
            url.pathname = "/";
            url.searchParams.set("mensaje", "Acceso restringido a la comunidad");
            return NextResponse.redirect(url);
        }
    }

    // Dashboard: solo admins y superAdmins
    if (adminOnlyPaths.some((p) => url.pathname.startsWith(p))) {
        if (usuario.rol !== "admin" && usuario.rol !== "superAdmin") {
            url.pathname = "/";
            url.searchParams.set("mensaje", "No tenés permisos para acceder al panel");
            return NextResponse.redirect(url);
        }
    }

    // Si todo está bien, permite continuar
    // Es fundamental retornar 'res' ya que puede contener cookies de sesión actualizadas (refresco de token)
    return res;
}

// Define en qué rutas aplica el middleware
export const config = {
    matcher: [
        "/comunidad/:path*",
        "/dashboard/:path*",
        // Puedes añadir rutas API aquí si las proteges con el middleware
    ],
};
*/