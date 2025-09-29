import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // Obtener tokens de las cookies
    let access_token = req.cookies.get("sb-access-token")?.value;
    const refresh_token = req.cookies.get("sb-refresh-token")?.value;

    // Intentar refrescar si no hay access_token
    if (!access_token && refresh_token) {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token });

      if (error || !data.session || !data.user) {
        return NextResponse.json({ user: null });
      }

      access_token = data.session.access_token;

      // Buscar al usuario en la tabla "usuario"
      const { data: usuario, error: usuarioError } = await supabase
        .from("usuario")
        .select("rol, nombre, apellido")
        .eq("id", data.user.id)
        .single();

      if (usuarioError) return NextResponse.json({ user: null });

      // Actualizar cookie con el nuevo access_token
      const res = NextResponse.json({
        user: {
          id: data.user.id,
          email: data.user.email,
          rol: usuario.rol,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
        },
      });

      res.cookies.set("sb-access-token", access_token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
      });

      return res;
    }

    // Si no hay access_token ni refresh_token → no hay sesión
    if (!access_token) return NextResponse.json({ user: null });

    // Obtener usuario desde Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) return NextResponse.json({ user: null });

    // Buscar rol y datos extra en tu tabla "usuario"
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuario")
      .select("rol, nombre, apellido")
      .eq("id", user.id)
      .single();

    if (usuarioError) return NextResponse.json({ user: null });

    // Devolver usuario con datos de la DB
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      },
    });
  } catch (err) {
    console.error("Error en /auth/me:", err);
    return NextResponse.json({ user: null });
  }
}
