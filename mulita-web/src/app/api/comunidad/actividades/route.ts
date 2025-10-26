import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const fecha = formData.get("fecha") as string;
  const categorias = JSON.parse(formData.get("categorias") as string) as string[];
  const archivos = formData.getAll("archivos") as File[];

  // Verificá si el usuario está logueado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
  }

  // Crear la actividad
  const { data: actividad, error: actividadError } = await supabase
    .from("actividades")
    .insert({
      titulo,
      descripcion,
      fecha,
      usuario_id: user.id,
    })
    .select()
    .single();

  if (actividadError) {
    return NextResponse.json({ error: actividadError.message }, { status: 400 });
  }

  // Subir archivos (si hay)
  const uploadedUrls: string[] = [];

  for (const archivo of archivos) {
    const filePath = `${actividad.id}/${archivo.name}`;
    const { data, error } = await supabase.storage
      .from("actividades")
      .upload(filePath, archivo, { upsert: true });

    if (error) continue;

    const { data: publicUrl } = supabase.storage
      .from("actividades")
      .getPublicUrl(filePath);

    uploadedUrls.push(publicUrl.publicUrl);
  }

  if (uploadedUrls.length) {
    await supabase.from("actividad_archivos").insert(
      uploadedUrls.map((url) => ({
        actividad_id: actividad.id,
        archivo_url: url,
      }))
    );
  }

  // Asociar categorías
  if (categorias.length) {
    // Asegura que existan o créalas
    for (const nombre of categorias) {
      const { data: cat } = await supabase
        .from("categorias")
        .upsert({ nombre })
        .select()
        .single();

      await supabase.from("actividad_categorias").insert({
        actividad_id: actividad.id,
        categoria_id: cat.id,
      });
    }
  }

  return NextResponse.json({ message: "Actividad creada", actividad });
}
