import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: listar todos los productos paginados
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const tipo_producto = searchParams.get("tipo_producto");
  const busqueda = searchParams.get("busqueda");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 1) Traer productos paginados
  let query = supabase
    .from("producto")
    .select(`
      *,
      producto_archivos (archivo_url, nombre)
      `, { count: "exact" })
    .eq("eliminado", false);

  // Filtrar por tipo de producto si se proporciona
  if (tipo_producto) {
    query = query.eq("tipo_producto", tipo_producto);
  }

  // Filtrar por búsqueda en nombre o descripción
  if (busqueda && busqueda.trim()) {
    query = query.or(`nombre.ilike.%${busqueda.trim()}%,descripcion.ilike.%${busqueda.trim()}%`);
  }

  const { data, error } = await query
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


// POST: crear producto
export async function POST(req: NextRequest) {
  try {
    // Validar autenticación desde cookie
    const access_token = req.cookies.get("sb-access-token")?.value;
    console.log("Token:", access_token);

    if (!access_token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(access_token);
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

    // Leer datos JSON
    const body = await req.json();
    const { nombre, descripcion, precio, imagenes, tipo_producto } = body;

    console.log({ nombre, descripcion, precio, imagenes, tipo_producto });

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
        tipo_producto: tipo_producto || null,
      })
      .select()
      .single();

    if (productoError) {
      console.error("Error insertando producto:", productoError);
      return NextResponse.json({ 
        error: productoError.message,
        details: productoError
      }, { status: 400 });
    }
  
    // Guardar las URLs, nombres y tipos en producto_archivos
    if (imagenes && imagenes.length > 0) {
      const { error: insertArchivosError } = await supabase
        .from("producto_archivos")
        .insert(
          imagenes.map((file: any) => ({
            producto_id: producto.id,
            archivo_url: file.url,
            nombre: file.name,
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