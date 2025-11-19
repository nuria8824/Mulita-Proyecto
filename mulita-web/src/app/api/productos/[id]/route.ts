import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener un producto
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Usuario autenticado
  const { data: { user }, error: userError } =
    await supabase.auth.getUser(access_token);

  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Obtener producto con archivos
  const { data: producto, error: productoError } = await supabase
    .from("producto")
    .select(`
      *,
      producto_archivos (archivo_url, nombre)
    `)
    .eq("id", id)
    .eq("eliminado", false)
    .single();

  if (productoError || !producto)
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  return NextResponse.json(producto);
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

// PATCH: actualizar producto
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(access_token);

  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

   // Verificar rol
  const { data: usuario } = await supabase.from("usuario").select("rol").eq("id", user.id).single();
  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "superAdmin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Obtener producto
  const { data: producto, error: productoError } = await supabase
    .from("producto")
    .select("id")
    .eq("id", id)
    .single();

  if (productoError || !producto)
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  // Procesar FormData
  const formData = await req.formData();
  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const precio = Number(formData.get("precio"));

  const archivosNuevos = formData.getAll("archivos") as File[];
  const archivosExistentes = JSON.parse(
    (formData.get("archivosExistentes") as string) || "[]"
  ) as string[];

  // Actualizar producto
  const { data, error: updateError } = await supabase
    .from("producto")
    .update({ nombre, descripcion, precio })
    .eq("id", id)
    .select()
    .single();

  if (updateError)
    return NextResponse.json(
      { error: updateError.message },
      { status: 400 }
    );

  // Obtener archivos actuales
  const { data: archivosActuales } = await supabase
    .from("producto_archivos")
    .select("archivo_url")
    .eq("producto_id", id);

  const actualesUrls = archivosActuales?.map((a) => a.archivo_url) || [];

  // Detectar archivos a eliminar
  const archivosAEliminar = actualesUrls.filter(
    (url) => !archivosExistentes.includes(url)
  );

  if (archivosAEliminar.length > 0) {
    await supabase
      .from("producto_archivos")
      .delete()
      .in("archivo_url", archivosAEliminar);
  }

  // Subir archivos nuevos
  const uploadedFiles: { url: string; type: string; name: string }[] = [];

  for (const archivo of archivosNuevos) {
    const sanitized = sanitizeFileName(archivo.name);
    const filePath = `productos/${id}/${Date.now()}_${sanitized}`;

    const { error: uploadError } = await supabase.storage
      .from("mulita-files")
      .upload(filePath, archivo, {
        contentType: archivo.type,
        upsert: false,
      });

    if (uploadError) continue;

    const { data: { publicUrl } } =
      supabase.storage.from("mulita-files").getPublicUrl(filePath);

    uploadedFiles.push({
      url: publicUrl,
      name: archivo.name,
      type: archivo.type,
    });
  }

  if (uploadedFiles.length > 0) {
    await supabase.from("producto_archivos").insert(
      uploadedFiles.map((f) => ({
        producto_id: id,
        archivo_url: f.url,
        nombre: f.name,
      }))
    );
  }

  return NextResponse.json({ message: "Producto actualizado", data });
}

// DELETE: soft delete (no elimina físicamente el producto)
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user }, error: userError } =
    await supabase.auth.getUser(access_token);

  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data: usuario } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (!usuario)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  // Obtener producto
  const { data: producto, error: productoError } = await supabase
    .from("producto")
    .select("*")
    .eq("id", id)
    .single();

  if (productoError || !producto)
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  // Permisos: admin / superAdmin
  if (usuario.rol !== "admin" && usuario.rol !== "superAdmin")
    return NextResponse.json(
      { error: "No tienes permisos para eliminar este producto" },
      { status: 403 }
    );

  const { error } = await supabase
    .from("producto")
    .update({ eliminado: true })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Producto eliminado correctamente" });
}
