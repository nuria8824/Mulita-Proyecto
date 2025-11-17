import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: listar todos los productos paginados
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 1) Traer productos paginados
  const { data, error } = await supabase
    .from("producto")
    .select(`
      *,
      producto_archivos (archivo_url)
      `, { count: "exact" })
    .eq("eliminado", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    productos: data,
    page,
    limit,
    total: error ? 0 : data?.length,
  });
}


// Función para limpiar nombres de archivo
function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD") // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
    .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // reemplaza cualquier caracter no válido
}

// POST: crear producto
export async function POST(req: NextRequest) {
  try {
    // Validar autenticación desde cookie
    const token = req.cookies.get("sb-access-token")?.value;
    console.log("Token:", token);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    console.log("userData", userData, "userError", userError);

    if (userError || !userData.user) {
      return NextResponse.json({ error: "Usuario inválido" }, { status: 401 });
    }

    // Buscar rol del usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuario")
      .select("rol")
      .eq("id", userData.user.id)
      .single();

    console.log("usuario:", usuario, "usuarioError", usuarioError);

    if (usuarioError || !usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 403 });
    }

    if (usuario.rol !== "admin" && usuario.rol !== "superAdmin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Procesar el formData
    const formData = await req.formData();
    const nombre = formData.get("nombre") as string;
    const descripcion = formData.get("descripcion") as string;
    const precio = formData.get("precio") as string;
    const imagenes = formData.getAll("imagenes") as File[];

    console.log({ nombre, descripcion, precio, imagenes });

    if (!nombre || !descripcion || !precio || !imagenes || imagenes.length === 0) {
      return NextResponse.json({ error: "Campos faltantes" }, { status: 400 });
    }

    // Insertar el producto en la DB
    const { data: producto, error: productoError } = await supabase
      .from("producto")
      .insert({
        nombre,
        descripcion,
        precio: parseFloat(precio),
      })
      .select()
      .single();

    if (productoError) {
      console.log("Error insertando producto:", productoError);
      return NextResponse.json({ error: productoError.message }, { status: 400 });
    }

    // Subir archivos al bucket
    const uploadedFiles: { url: string; name: string; type: string }[] = [];
  
    for (const imagen of imagenes) {
      const sanitizedFileName = sanitizeFileName(imagen.name);
      const filePath = `productos/${producto.id}/${Date.now()}_${sanitizedFileName}`;
  
      const { error: uploadError } = await supabase.storage
        .from("mulita-files")
        .upload(filePath, imagen, {
          contentType: imagen.type,
          upsert: false,
        });
  
      if (uploadError) {
        console.error(`Error subiendo ${imagen.name}:`, uploadError.message);
        continue;
      }
  
      const {
        data: { publicUrl },
      } = supabase.storage.from("mulita-files").getPublicUrl(filePath);
  
      uploadedFiles.push({
        url: publicUrl,
        name: imagen.name,
        type: imagen.type,
      });
    }
  
    // Guardar las URLs, nombres y tipos en producto_archivos
    if (uploadedFiles.length) {
      const { error: insertArchivosError } = await supabase
        .from("producto_archivos")
        .insert(
          uploadedFiles.map((file) => ({
            producto_id: producto.id,
            archivo_url: file.url,
          }))
        );
  
      if (insertArchivosError)
        console.error("Error guardando archivos:", insertArchivosError.message);
    }

    console.log("Producto creado:", producto);
    return NextResponse.json({ success: true, producto });
  } catch (err: any) {
    console.error("Error creando producto:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}