import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, contrasena } = await req.json();

    // Login con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: contrasena,
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    // Chequear si el correo está confirmado
    if (!data.user.confirmed_at) {
      return NextResponse.json({ success: false, message: "Por favor confirma tu email antes de iniciar sesión" }, { status: 403 });
    }

    // Guardamos la sesión en cookies (HTTP-only)
    const session = data.session;
    const response = NextResponse.json({ success: true, user: data.user });
    if (session?.access_token) {
      response.cookies.set("sb-access-token", session.access_token, { httpOnly: true, path: "/" });
      response.cookies.set("sb-refresh-token", session.refresh_token, { httpOnly: true, path: "/" });
    }

    return response;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Error del servidor" }, { status: 500 });
  }
}
