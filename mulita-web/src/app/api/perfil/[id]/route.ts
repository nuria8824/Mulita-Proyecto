import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener cualquier perfil (visible para todos los autenticados)
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

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

  const { data, error } = await supabase
    .from("perfil")
    .select("*, usuario(id,nombre,apellido,email,rol)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ perfil: data });
}

// PATCH: actualizar el perfil (solo el propietario)
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  console.log("PATCH /api/perfil/[id] called");
  const params = await props.params;
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Chequear que el usuario solo edite su propio perfil
  if (user.id !== params.id) {
    console.log("user.id:", user.id, "params.id:", params.id);
    return NextResponse.json({ error: "No podés modificar el perfil de otro usuario" }, { status: 403 });
  }

  const formData = await req.formData();
  const biografia = formData.get("biografia")?.toString() || "";
  let imagen_url = formData.get("imagen");

  console.log("Datos recibidos para actualizar perfil:", { biografia, imagen_url });

  // Obtener imagen actual
  const { data: perfilActual } = await supabase
    .from("perfil")
    .select("imagen")
    .eq("id", user.id)
    .single();

  if (imagen_url instanceof File) {
    const file = imagen_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`perfiles/${user.id}/${Date.now()}_${file.name}`, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    imagen_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  } else {
    imagen_url = perfilActual?.imagen;
  }

  console.log("imagen_url final para actualizar:", imagen_url);

  const { data: perfil, error } = await supabase
    .from("perfil")
    .update({
      biografia,
      imagen: imagen_url,
      updated_at: new Date(),
    })
    .eq("id", user.id)
    .select()
    .single();

  console.log("Perfil actualizado:", perfil);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(perfil);
}
