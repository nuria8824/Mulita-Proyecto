import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const actividadId = params.id;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Obtener colección Favoritos del usuario
  const { data: favoritos, error: favError } = await supabase
    .from("coleccion")
    .select("id")
    .eq("usuario_id", user.id)
    .eq("tipo", "favoritos")
    .single();

  if (favError || !favoritos)
    return NextResponse.json({ error: "No se pudo obtener la colección Favoritos" }, { status: 500 });

  // Insertar relación actividad - colección (upsert evita duplicados)
  const { data, error } = await supabase
    .from("coleccion_actividad")
    .upsert(
      { coleccion_id: favoritos.id, actividad_id: actividadId },
      { onConflict: "coleccion_id,actividad_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Actividad agregada a Favoritos" });
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const actividadId = params.id;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Obtener colección Favoritos del usuario
  const { data: favoritos, error: favError } = await supabase
    .from("coleccion")
    .select("id")
    .eq("usuario_id", user.id)
    .eq("tipo", "favoritos")
    .single();

  if (favError || !favoritos)
    return NextResponse.json({ error: "No se encontró la colección Favoritos" }, { status: 404 });

  // Eliminar relación actividad - colección
  const { error } = await supabase
    .from("coleccion_actividad")
    .delete()
    .eq("coleccion_id", favoritos.id)
    .eq("actividad_id", actividadId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Like removido" });
}
