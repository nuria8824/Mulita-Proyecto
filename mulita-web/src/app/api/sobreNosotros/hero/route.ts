import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener el heroSobreNosotros actual
export async function GET() {
  const { data, error } = await supabase
    .from("hero_sobre_nosotros")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: actualizar heroSobreNosotros
export async function PATCH(req: NextRequest) {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

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
    .eq("nombre", "HeroSobreNosotros")
    .single();

  if (seccionError || !seccion) {
    return NextResponse.json(
      { error: "No se pudo obtener id_seccion para 'Hero'" },
      { status: 500 }
    );
  }

  const id_seccion = seccion.id;

  const formData = await req.formData();
  const titulo = formData.get("titulo")?.toString();
  const descripcion = formData.get("descripcion")?.toString();
  let imagen_url = formData.get("imagen");

  // Obtener imagen actual
  const { data: heroActual } = await supabase
    .from("hero_sobre_nosotros")
    .select("imagen")
    .eq("id", 1)
    .single();

  if (imagen_url instanceof File) {
    const file = imagen_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`sobreNosotros/hero/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen_url = heroActual?.imagen;
  }

  const { data, error } = await supabase
    .from("hero_sobre_nosotros")
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
