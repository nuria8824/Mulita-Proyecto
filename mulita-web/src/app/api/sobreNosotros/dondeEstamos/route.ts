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
  const titulo = formData.get("titulo")?.toString();
  const contenido = formData.get("contenido")?.toString();

  const { data, error } = await supabase
    .from("donde_estamos")
    .upsert({
      id: 1,
      titulo,
      contenido,
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
