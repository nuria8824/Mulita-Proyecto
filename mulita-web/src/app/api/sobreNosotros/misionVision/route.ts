import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener los datos de Mision y Vision
export async function GET() {
  const { data, error } = await supabase
    .from("mision_vision")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: actualizar Mision y Vision
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
    .eq("nombre", "MisionVision")
    .single();

  if (seccionError || !seccion) {
    return NextResponse.json(
      { error: "No se pudo obtener id_seccion para 'MisionVision'" },
      { status: 500 }
    );
  }

  const id_seccion = seccion.id;
  console.log("id_seccion obtenido desde DB:", id_seccion);

  const formData = await req.formData();
  const id = Number(formData.get("id"));
  const titulo1 = formData.get("titulo1")?.toString();
  const titulo2 = formData.get("titulo2")?.toString();
  const descripcion1 = formData.get("descripcion1")?.toString();
  const descripcion2 = formData.get("descripcion2")?.toString();

  let imagen1_url = formData.get("imagen1");
  let imagen2_url = formData.get("imagen2");

  console.log("Datos para upsert:");
  console.log("titulo:", titulo1);
  console.log("titulo:", titulo2);
  console.log("descripcion:", descripcion1);
  console.log("descripcion:", descripcion2);
  console.log("id_usuario:", user.id);
  console.log("id_seccion:", id_seccion);
  console.log("fecha_modificacion:", new Date());

  // Obtener imagen actual
  const { data: misionVisionActual } = await supabase
    .from("mision_vision")
    .select("imagen1, imagen2")
    .eq("id", 1)
    .single();

  if (imagen1_url instanceof File) {
    const file = imagen1_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/mision-vision/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen1_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen1_url = misionVisionActual?.imagen1;
  }

  console.log("imagen1_url:", imagen1_url);

  if (imagen2_url instanceof File) {
    const file = imagen2_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/mision-vision/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen2_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen2_url = misionVisionActual?.imagen2;
  }

  console.log("imagen2_url:", imagen2_url);

  const { data, error } = await supabase
    .from("mision_vision")
    .upsert({
      id: 1,
      titulo1,
      titulo2,
      descripcion1,
      descripcion2,
      imagen1: imagen1_url,
      imagen2: imagen2_url,
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
