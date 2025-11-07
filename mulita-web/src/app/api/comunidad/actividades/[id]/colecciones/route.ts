import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const actividadId = params.id;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Obtener colecciones a las que pertenece la actividad
  const { data, error } = await supabase
    .from("coleccion_actividad")
    .select("coleccion_id")
    .eq("actividad_id", actividadId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Devolver solo los IDs de colecciones
  const coleccionIds = data.map((item) => item.coleccion_id);
  return NextResponse.json(coleccionIds);
}

// DELETE: elimina una actividad de una colección
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const actividadId = params.id;

  const { coleccion_id } = await req.json();

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Verificar que la colección pertenezca al usuario
  const { data: coleccion, error: coleccionError } = await supabase
    .from("coleccion")
    .select("id, usuario_id")
    .eq("id", coleccion_id)
    .single();

  if (coleccionError || !coleccion)
    return NextResponse.json({ error: "Colección no encontrada" }, { status: 404 });

  if (coleccion.usuario_id !== user.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  // Eliminar la relación de la tabla intermedia
  const { error } = await supabase
    .from("coleccion_actividad")
    .delete()
    .eq("coleccion_id", coleccion_id)
    .eq("actividad_id", actividadId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Actividad eliminada de la colección correctamente" });
}
