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

  const body = await req.json();
  const { titulo, descripcion, imagen } = body;

  let imagen_url;

 // Obtener imagen actual
  const { data: heroActual } = await supabase
    .from("hero")
    .select("imagen")
    .eq("id", 1)
    .single();

  // Subir imagen_principal si es un File
  if (imagen === null) {
    imagen_url = heroActual?.imagen;
  } else {
    imagen_url = imagen
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
