import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
  } = await supabase.auth.getUser(access_token);

  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Obtener parámetros de paginación desde la URL
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "5");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Consultar las actividades con paginación
  const { data, error } = await supabase
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

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
