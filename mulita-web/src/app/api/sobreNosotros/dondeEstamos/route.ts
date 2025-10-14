import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener los datos de Donde Estamos
export async function GET() {
  const { data, error } = await supabase
    .from("donde_estamos")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: actualizar Donde Estamos
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

  // Obtener id_seccion desde secciones_sobreNosotros
  const { data: seccion, error: seccionError } = await supabase
    .from("secciones_sobrenosotros")
    .select("id")
    .eq("nombre", "DondeEstamos")
    .single();

  if (seccionError || !seccion) {
    return NextResponse.json(
      { error: "No se pudo obtener id_seccion para 'DondeEstamos'" },
      { status: 500 }
    );
  }

  const id_seccion = seccion.id;
  console.log("id_seccion obtenido desde DB:", id_seccion);

  const formData = await req.formData();
  const id = Number(formData.get("id"));
  const titulo = formData.get("titulo")?.toString();
  const descripcion = formData.get("descripcion")?.toString();

  let imagen1_url = formData.get("imagen1");
  let imagen2_url = formData.get("imagen2");
  let imagen3_url = formData.get("imagen3");
  let imagen4_url = formData.get("imagen4");
  let imagen5_url = formData.get("imagen5");
  let imagen6_url = formData.get("imagen6");

  console.log("Datos para upsert:");
  console.log("titulo:", titulo);
  console.log("descripcion:", descripcion);
  console.log("id_usuario:", user.id);
  console.log("id_seccion:", id_seccion);
  console.log("fecha_modificacion:", new Date());

  // Obtener imagen actual
  const { data: dondeEstamosActual } = await supabase
    .from("donde_estamos")
    .select("imagen1, imagen2, imagen3, imagen4, imagen5, imagen6")
    .eq("id", 1)
    .single();

  if (imagen1_url instanceof File) {
    const file = imagen1_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/donde-estamos/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen1_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen1_url = dondeEstamosActual?.imagen1;
  }

  console.log("imagen1_url:", imagen1_url);

  if (imagen2_url instanceof File) {
    const file = imagen2_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/donde-estamos/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen2_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen2_url = dondeEstamosActual?.imagen2;
  }

  console.log("imagen2_url:", imagen2_url);

  if (imagen3_url instanceof File) {
    const file = imagen3_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/donde-estamos/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen3_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen3_url = dondeEstamosActual?.imagen3;
  }

  console.log("imagen3_url:", imagen3_url);
  
  if (imagen4_url instanceof File) {
    const file = imagen4_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/donde-estamos/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen4_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen4_url = dondeEstamosActual?.imagen4;
  }

  console.log("imagen4_url:", imagen4_url);

  if (imagen5_url instanceof File) {
    const file = imagen5_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/donde-estamos/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen5_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen5_url = dondeEstamosActual?.imagen5;
  }

  console.log("imagen5_url:", imagen5_url);

  if (imagen6_url instanceof File) {
    const file = imagen6_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/donde-estamos/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen6_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen6_url = dondeEstamosActual?.imagen6;
  }

  console.log("imagen6_url:", imagen6_url);

  const { data, error } = await supabase
    .from("donde_estamos")
    .upsert({
      id: 1,
      titulo,
      descripcion,
      imagen1: imagen1_url,
      imagen2: imagen2_url,
      imagen3: imagen3_url,
      imagen4: imagen4_url,
      imagen5: imagen5_url,
      imagen6: imagen6_url,
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
