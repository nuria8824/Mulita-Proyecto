import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener una noticia
export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data, error } = await supabase
    .from("noticia")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PATCH: actualizar noticia
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const access_token = req.cookies.get("sb-access-token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Obtener usuario
  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Verificar rol
  const { data: usuario } = await supabase.from("usuario").select("rol").eq("id", user.id).single();
  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "super_admin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Leer FormData
  const formData = await req.formData();
  const titulo = formData.get("titulo")?.toString();
  const autor = formData.get("autor")?.toString();
  const introduccion = formData.get("introduccion")?.toString();
  const descripcion = formData.get("descripcion")?.toString();

  let imagen_principal_url = formData.get("imagen_principal");
  let archivo_url = formData.get("archivo");

  // Subir imagen_principal si es un File
  if (imagen_principal_url instanceof File) {
    const file = imagen_principal_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`noticias/imagenes/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    imagen_principal_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  }

  // Subir archivo extra si es un File
  if (archivo_url instanceof File) {
    const file = archivo_url;
    const { data, error } = await supabase.storage
      .from("mulita-files")
      .upload(`noticias/archivos/${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    archivo_url = supabase.storage.from("mulita-files").getPublicUrl(data.path).data.publicUrl;
  }

  // Actualizar noticia
  const { data: noticia, error } = await supabase
    .from("noticia")
    .update({
      titulo,
      autor,
      introduccion,
      descripcion,
      imagen_principal: typeof imagen_principal_url === "string" ? imagen_principal_url : null,
      archivo: typeof archivo_url === "string" ? archivo_url : null,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(noticia);
}


// DELETE: borrar noticia
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data: usuario } = await supabase.from("usuario").select("rol").eq("id", user.id).single();
  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "super_admin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { error } = await supabase.from("noticia").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Noticia eliminada" });
}

