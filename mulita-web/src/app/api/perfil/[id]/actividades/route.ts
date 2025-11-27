import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Verificar usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabaseServer.auth.getUser(access_token);

  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Obtener parámetros de paginación desde la URL
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "5");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Consultar las actividades con paginación
  const { data: actividades, error: actividadError } = await supabaseServer
    .from("actividad")
    .select(`
      *,
      actividad_archivos (archivo_url, tipo, nombre),
      actividad_categoria (categoria (id, nombre))
    `)
    .eq("usuario_id", id)
    .eq("eliminado", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (actividadError)
    return NextResponse.json({ error: actividadError.message }, { status: 500 });

  // Obtener usuario y perfil
  const { data: usuario, error: usuarioError } = await supabaseServer
    .from("usuario")
    .select("id, nombre, apellido")
    .eq("id", id)
    .single();

  const { data: perfil, error: perfilError } = await supabaseServer
    .from("perfil")
    .select("id, imagen")
    .eq("id", id)
    .single();

  if (usuarioError || perfilError)
    return NextResponse.json(
      { error: "Error obteniendo usuarios o perfiles" },
      { status: 500 }
    );

  // Agregar usuario y perfil a cada actividad
  const actividadesConUsuario = actividades.map((act) => ({
    ...act,
    usuario: { ...usuario, perfil },
  }));

  return NextResponse.json(actividadesConUsuario);
}
