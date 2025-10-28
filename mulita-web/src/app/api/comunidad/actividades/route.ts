import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data, error } = await supabase
    .from("actividad")
    .select(`
      id,
      titulo,
      descripcion,
      fecha,
      eliminado,
      usuario_id,
      actividad_archivos(id, archivo_url, nombre, tipo),
      actividad_categoria(categoria_id, categoria(nombre))
    `)
    .eq("eliminado", false)
    .order("fecha", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// Función para limpiar nombres de archivo
function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD") // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
    .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // reemplaza cualquier caracter no válido
}

export async function POST(req: NextRequest) {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Leer formData
  const formData = await req.formData();
  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const categorias = JSON.parse(formData.get("categorias") as string) as string[];
  const archivos = formData.getAll("archivos") as File[];

  // Crear la actividad
  const { data: actividad, error: actividadError } = await supabase
    .from("actividad")
    .insert({
      titulo,
      descripcion,
      fecha: new Date().toISOString(),
      usuario_id: user.id,
    })
    .select()
    .single();

  if (actividadError) {
    console.error("Error creando actividad:", actividadError.message);
    return NextResponse.json({ error: actividadError.message }, { status: 400 });
  }

  // Subir archivos al bucket
  const uploadedFiles: { url: string; name: string; type: string }[] = [];

  for (const archivo of archivos) {
    const sanitizedFileName = sanitizeFileName(archivo.name);
    const filePath = `comunidad/actividades/${actividad.id}/${Date.now()}_${sanitizedFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("mulita-files")
      .upload(filePath, archivo, {
        contentType: archivo.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(`Error subiendo ${archivo.name}:`, uploadError.message);
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("mulita-files").getPublicUrl(filePath);

    uploadedFiles.push({
      url: publicUrl,
      name: archivo.name,
      type: archivo.type,
    });
  }

  // Guardar las URLs, nombres y tipos en actividad_archivos
  if (uploadedFiles.length) {
    const { error: insertArchivosError } = await supabase
      .from("actividad_archivos")
      .insert(
        uploadedFiles.map((file) => ({
          actividad_id: actividad.id,
          archivo_url: file.url,
          nombre: file.name,
          tipo: file.type,
        }))
      );

    if (insertArchivosError)
      console.error("Error guardando archivos:", insertArchivosError.message);
  }

  // Asociar categorías existentes
  if (categorias.length) {
    const { data: categoriasExistentes, error: catError } = await supabase
      .from("categoria")
      .select("id, nombre")
      .in("id", categorias);

    if (catError) console.error("Error obteniendo categorías:", catError.message);

    if (categoriasExistentes?.length) {
      const { error: insertCategoriasError } = await supabase
        .from("actividad_categoria")
        .insert(
          categoriasExistentes.map((c) => ({
            actividad_id: actividad.id,
            categoria_id: c.id,
          }))
        );

      if (insertCategoriasError)
        console.error("Error asociando categorías:", insertCategoriasError.message);
    }
  }

  return NextResponse.json({
    message: "Actividad creada con éxito",
    actividad,
  });
}
