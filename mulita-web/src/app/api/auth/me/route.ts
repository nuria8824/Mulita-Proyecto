import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    let access_token = req.cookies.get("sb-access-token")?.value;
    const refresh_token = req.cookies.get("sb-refresh-token")?.value;

    if (!access_token && refresh_token) {
      const { data, error } = await supabaseServer.auth.refreshSession({ refresh_token });
      if (error || !data.session || !data.user) return NextResponse.json({ user: null });
      access_token = data.session.access_token;
    }

    if (!access_token) return NextResponse.json({ user: null });

    const { data: { user }, error } = await supabaseServer.auth.getUser(access_token);
    if (error || !user) return NextResponse.json({ user: null });

    // Traer datos de usuario
    const { data: usuario, error: usuarioError } = await supabaseServer
      .from("usuario")
      .select("rol, nombre, apellido, telefono, acceso_comunidad")
      .eq("id", user.id)
      .single();

    if (usuarioError) return NextResponse.json({ user: null });

    // Traer imagen desde tabla perfil
    const { data: perfil, error: perfilError } = await supabaseServer
      .from("perfil")
      .select("imagen")
      .eq("id", user.id)
      .single();

    if (perfilError) console.warn("Error cargando imagen de perfil:", perfilError.message);

    // Si es docente, buscar sus datos también
    let docente = null;
    if (usuario.rol === "docente") {
      const { data: docenteData, error: docenteError } = await supabaseServer
        .from("docente")
        .select("*")
        .eq("id_usuario", user.id)
        .single();

      if (docenteError && docenteError.code !== "PGRST116") {
        console.warn("Error cargando datos del docente:", docenteError.message);
      }
      docente = docenteData;
    }

    // Devolver usuario completo
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        acceso_comunidad: usuario.acceso_comunidad,
        imagen: perfil?.imagen || null,
        docente,
      },
    });
  } catch (err) {
    console.error("Error en /auth/me:", err);
    return NextResponse.json({ user: null });
  }
}
