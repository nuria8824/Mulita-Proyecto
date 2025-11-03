import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(access_token);

  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const search = searchParams.get("search")?.trim() || "";
  const categoria = searchParams.get("categoria")?.trim() || "";
  const fechaFiltro = searchParams.get("fecha")?.trim() || ""; // nuevo parámetro

  // --- Construir filtro por categoría ---
  let actividadIdsFiltradas: string[] | null = null;
  if (categoria) {
    const { data: catData, error: catError } = await supabase
      .from("categoria")
      .select("id")
      .eq("nombre", categoria)
      .single();

    if (!catError && catData) {
      const { data: actividadCatIds, error: acError } = await supabase
        .from("actividad_categoria")
        .select("actividad_id")
        .eq("categoria_id", catData.id);

      if (acError) return NextResponse.json({ error: acError.message }, { status: 500 });

      actividadIdsFiltradas = actividadCatIds.map((ac) => ac.actividad_id);
      if (actividadIdsFiltradas.length === 0) return NextResponse.json([], { status: 200 });
    } else {
      return NextResponse.json([], { status: 200 });
    }
  }

  // Construir query principal
  let query = supabase
    .from("actividad")
    .select(`
      *,
      actividad_archivos (archivo_url, tipo, nombre),
      actividad_categoria (categoria(id, nombre))
    `)
    .eq("eliminado", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Filtro por búsqueda
  if (search) {
    query = query.or(`titulo.ilike.%${search}%,descripcion.ilike.%${search}%`);
  }

  // Filtro por categoría
  if (actividadIdsFiltradas) {
    query = query.in("id", actividadIdsFiltradas);
  }

  //Filtro por fecha
  if (fechaFiltro) {
    const ahora = new Date();
    let startDate: Date;

    switch (fechaFiltro) {
      case "hoy":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case "semana":
        const dia = ahora.getDay(); // 0 = domingo
        startDate = new Date();
        startDate.setDate(ahora.getDate() - dia);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "mes":
        startDate = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        break;
      default:
        startDate = new Date(0); // sin filtro si valor no reconocido
    }

    query = query.gte("created_at", startDate.toISOString());
  }

  // Ejecutar query
  const { data: actividades, error: actividadError } = await query;
  if (actividadError)
    return NextResponse.json({ error: actividadError.message }, { status: 500 });

  if (!actividades || actividades.length === 0) return NextResponse.json([], { status: 200 });

  // Obtener usuarios y perfiles
  const usuarioIds = [...new Set(actividades.map((a: any) => a.usuario_id))];

  const { data: usuarios, error: usuarioError } = await supabase
    .from("usuario")
    .select("id, nombre, apellido")
    .in("id", usuarioIds);

  const { data: perfiles, error: perfilError } = await supabase
    .from("perfil")
    .select("id, imagen")
    .in("id", usuarioIds);

  if (usuarioError || perfilError)
    return NextResponse.json(
      { error: "Error obteniendo usuarios o perfiles" },
      { status: 500 }
    );

  // Combinar usuarios y perfiles
  const actividadesConUsuario = actividades.map((act: any) => {
    const usuario = usuarios.find((u) => u.id === act.usuario_id) || {};
    const perfil = perfiles.find((p) => p.id === act.usuario_id) || {};
    return { ...act, usuario: { ...usuario, perfil } };
  });

  return NextResponse.json(actividadesConUsuario);
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
