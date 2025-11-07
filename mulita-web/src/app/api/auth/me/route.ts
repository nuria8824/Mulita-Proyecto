import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    let access_token = req.cookies.get("sb-access-token")?.value;
    const refresh_token = req.cookies.get("sb-refresh-token")?.value;

    if (!access_token && refresh_token) {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token });
      if (error || !data.session || !data.user) return NextResponse.json({ user: null });
      access_token = data.session.access_token;
    }

    if (!access_token) return NextResponse.json({ user: null });

    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) return NextResponse.json({ user: null });

    // Traer datos de usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuario")
      .select("rol, nombre, apellido")
      .eq("id", user.id)
      .single();

    if (usuarioError) return NextResponse.json({ user: null });

    // Traer imagen desde tabla perfil
    const { data: perfil, error: perfilError } = await supabase
      .from("perfil")
      .select("imagen")
      .eq("id", user.id)
      .single();

    if (perfilError) console.warn("Error cargando imagen de perfil:", perfilError.message);

    // Devolver usuario completo
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        imagen: perfil?.imagen || null,
      },
    });
  } catch (err) {
    console.error("Error en /auth/me:", err);
    return NextResponse.json({ user: null });
  }
}
