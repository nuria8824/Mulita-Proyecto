import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  contrasena: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);

    // 1. Intentar login con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.contrasena,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const user = authData.user;
    const session = authData.session;
    if (!user || !session) {
      throw new Error("No se pudo obtener usuario o sesión");
    }

    // 2. Buscar datos adicionales en tabla usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", user.id)
      .single();

    if (usuarioError) {
      throw new Error(usuarioError.message);
    }

    // 3. Si es docente, buscar sus datos también
    let docente = null;
    if (usuario.rol === "docente") {
      const { data: docenteData, error: docenteError } = await supabase
        .from("docente")
        .select("*")
        .eq("id_usuario", user.id)
        .single();

      if (docenteError && docenteError.code !== "PGRST116") {
        throw new Error(docenteError.message);
      }
      docente = docenteData;
    }

    // 4. Guardar tokens en cookies HTTP-only para persistencia de sesión
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        docente,
      },
    });

    res.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    res.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    return res;

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
