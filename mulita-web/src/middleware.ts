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
