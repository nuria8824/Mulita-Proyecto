import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Devuelve una colección en particular (si no está eliminada).
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data, error } = await supabase
    .from("coleccion")
    .select("*")
    .eq("id", params.id)
    .eq("usuario_id", user?.id)
    .eq("eliminado", false)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// POST: agrega una actividad a una colección (tabla intermedia)
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { actividadIds } = await req.json(); // puede ser un array o un solo ID

  if (!actividadIds || actividadIds.length === 0)
    return NextResponse.json({ error: "Debe incluir al menos una actividad" }, { status: 400 });

  // Aceptar tanto un número único como un array
  const ids = Array.isArray(actividadIds) ? actividadIds : [actividadIds];

  const insertData = ids.map((actividadId: string) => ({
    coleccion_id: params.id,
    actividad_id: actividadId,
  }));

  const { error } = await supabase
    .from("coleccion_actividad")
    .upsert(insertData, { onConflict: "coleccion_id, actividad_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

// PATCH: Edita el nombre de una colección.
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { nombre } = await req.json();
  if (!nombre)
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });

  const { data, error } = await supabase
    .from("colecciones")
    .update({ nombre })
    .eq("id", params.id)
    .eq("usuario_id", user?.id)
    .eq("eliminado", false)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE: Soft delete: marca la colección como eliminada
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { error } = await supabase
    .from("colecciones")
    .update({ eliminado: true })
    .eq("id", params.id)
    .eq("usuario_id", user?.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Colección eliminada correctamente" });
}
