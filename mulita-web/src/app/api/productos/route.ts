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
      producto_archivos (archivo_url, nombre)
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
    const { nombre, descripcion, precio, imagenes } = body;

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