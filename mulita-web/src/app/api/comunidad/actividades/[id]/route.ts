import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Obtener actividad con usuario, archivos y categorías
  const { data: actividad, error: actividadError } = await supabase
    .from("actividad")
    .select(`
      *,
      actividad_archivos (archivo_url, tipo, nombre),
      actividad_categoria (categoria_id, categoria(nombre))
    `)
    .eq("id", params.id)
    .eq("eliminado", false)
    .single();

    console.log("ID solicitado:", params.id);
    console.log("Actividad de Supabase:", actividad);
    console.log("Error de Supabase:", actividadError);

  if (actividadError || !actividad)
    return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });

  // Extraer los IDs de categorías
  const categorias_ids = actividad.actividad_categoria?.map(
    (ac: any) => ac.categoria_id
  ) || [];

  console.log("IDs de categorías:", categorias_ids);

  // Transformar la respuesta para el frontend
  const respuesta = {
    ...actividad,
    categorias_ids,
  };

  return NextResponse.json(respuesta);
}

// Función para limpiar nombres de archivo
function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  // --- Autenticación ---
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(access_token);

  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // --- Obtener la actividad ---
  const { data: actividad, error: actError } = await supabase
    .from("actividad")
    .select("usuario_id")
    .eq("id", id)
    .single();

  if (actError || !actividad)
    return NextResponse.json(
      { error: "Actividad no encontrada" },
      { status: 404 }
    );

  // --- Verificar permisos ---
  if (actividad.usuario_id !== user.id)
    return NextResponse.json(
      { error: "No tienes permisos para editar esta actividad" },
      { status: 403 }
    );

  // --- Procesar FormData ---
  const formData = await req.formData();
  const titulo = formData.get("titulo") as string;
  const descripcion = formData.get("descripcion") as string;
  const categorias = JSON.parse(formData.get("categorias") as string) as string[];

  // Archivos nuevos subidos
  const archivosNuevos = formData.getAll("archivos") as File[];

  // Archivos que el usuario decidió mantener (URLs)
  const archivosExistentes = JSON.parse(
    (formData.get("archivosExistentes") as string) || "[]"
  ) as string[];

  // --- Actualizar actividad ---
  const { data, error: actividadError } = await supabase
    .from("actividad")
    .update({ titulo, descripcion })
    .eq("id", id)
    .select()
    .single();

  if (actividadError)
    return NextResponse.json(
      { error: actividadError.message },
      { status: 400 }
    );

  // --- Actualizar archivos ---
  // 1️⃣ Obtener los archivos actuales de la actividad
  const { data: archivosActuales } = await supabase
    .from("actividad_archivos")
    .select("archivo_url")
    .eq("actividad_id", id);

  const actualesUrls = archivosActuales?.map((a) => a.archivo_url) || [];

  // 2️⃣ Determinar cuáles eliminar
  const archivosAEliminar = actualesUrls.filter(
    (url) => !archivosExistentes.includes(url)
  );

  if (archivosAEliminar.length > 0) {
    await supabase
      .from("actividad_archivos")
      .delete()
      .in("archivo_url", archivosAEliminar);
  }

  // 3️⃣ Subir y registrar los nuevos archivos
  const uploadedFiles: { url: string; name: string; type: string }[] = [];
  for (const archivo of archivosNuevos) {
    const sanitizedFileName = sanitizeFileName(archivo.name);
    const filePath = `comunidad/actividades/${id}/${Date.now()}_${sanitizedFileName}`;
    const { error: uploadError } = await supabase.storage
      .from("mulita-files")
      .upload(filePath, archivo, {
        contentType: archivo.type,
        upsert: false,
      });

    if (uploadError) continue;

    const {
      data: { publicUrl },
    } = supabase.storage.from("mulita-files").getPublicUrl(filePath);

    uploadedFiles.push({
      url: publicUrl,
      name: archivo.name,
      type: archivo.type,
    });
  }

  if (uploadedFiles.length) {
    await supabase.from("actividad_archivos").insert(
      uploadedFiles.map((f) => ({
        actividad_id: id,
        archivo_url: f.url,
        nombre: f.name,
        tipo: f.type,
      }))
    );
  }

  // --- Actualizar categorías ---
  if (categorias.length) {
    await supabase.from("actividad_categoria").delete().eq("actividad_id", id);
    await supabase.from("actividad_categoria").insert(
      categorias.map((categoriaId) => ({
        actividad_id: id,
        categoria_id: categoriaId,
      }))
    );
  }

  return NextResponse.json({ message: "Actividad actualizada", data });
}


export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data: usuario } = await supabase.from("usuario").select("rol").eq("id", user.id).single();
  if (!usuario) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Obtener la actividad
  const { data: actividad, error: actError } = await supabase
    .from("actividad")
    .select("*")
    .eq("id", id)
    .single();

  if (actError || !actividad) return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });

  // Comprobar permisos: autor, admin o superAdmin
  if (actividad.usuario_id !== user.id && usuario.rol !== "admin" && usuario.rol !== "superAdmin")
    return NextResponse.json({ error: "No tienes permisos para editar esta actividad" }, { status: 403 });

  // Soft delete
  const { error } = await supabase
    .from("actividad")
    .update({ eliminado: true })
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Actividad eliminada correctamente" });
}
