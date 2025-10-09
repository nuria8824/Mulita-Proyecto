import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener el hero actual
export async function GET() {
  const { data, error } = await supabase
    .from("hero")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: actualizar
export async function PATCH(req: NextRequest) {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data: usuario } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "superAdmin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

   // Obtener id_seccion desde la tabla seccion
  const { data: seccion, error: seccionError } = await supabase
    .from("secciones_inicio")
    .select("id")
    .eq("nombre", "Hero")
    .single();

  if (seccionError || !seccion) {
    console.error("Error obteniendo id_seccion:", seccionError?.message);
    return NextResponse.json(
      { error: "No se pudo obtener id_seccion para 'hero'" },
      { status: 500 }
    );
  }

  const id_seccion = seccion.id;
  console.log("id_seccion obtenido desde DB:", id_seccion);

  const formData = await req.formData();
  const titulo = formData.get("titulo")?.toString();
  const descripcion = formData.get("descripcion")?.toString();

  let imagen_url = formData.get("imagen");

  console.log("Datos para upsert:");
  console.log("titulo:", titulo);
  console.log("descripcion:", descripcion);
  console.log("id_usuario:", user.id);
  console.log("id_seccion:", id_seccion);
  console.log("fecha_modificacion:", new Date());

 // Obtener imagen actual
  const { data: heroActual } = await supabase
    .from("hero")
    .select("imagen")
    .eq("id", 1)
    .single();

  if (imagen_url instanceof File) {
    const file = imagen_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`inicio/hero/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen_url = heroActual?.imagen;
  }
  
  console.log("imagen_url:", imagen_url);
  

  const { data, error } = await supabase
    .from("hero")
    .upsert({
      id: 1,
      titulo,
      descripcion,
      imagen: imagen_url,
      id_usuario: user.id,
      id_seccion,
      fecha_modificacion: new Date(),
    })
    .select()
    .single();

  console.log("data:", data);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
