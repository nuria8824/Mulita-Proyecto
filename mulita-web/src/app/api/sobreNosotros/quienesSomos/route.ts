import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Traer Quiénes Somos y equipo
  const { data: qs, error: qsError } = await supabase
    .from("quienes_somos")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .single();

  if (qsError) return NextResponse.json({ error: qsError.message }, { status: 500 });

  const { data: equipo, error: equipoError } = await supabase
    .from("equipo_quienes_somos")
    .select("*")
    .eq("id_donde_estamos", qs.id)
    .order("orden", { ascending: true });

  if (equipoError) return NextResponse.json({ error: equipoError.message }, { status: 500 });

  return NextResponse.json({ ...qs, equipo });
}

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

  const body = await req.json();
  const { titulo, descripcion, equipo } = body;

  if (!titulo || !descripcion || !Array.isArray(equipo)) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Upsert Quiénes Somos
  const { data: qsData, error: qsError } = await supabase
    .from("quienes_somos")
    .upsert({
      id: 1,
      titulo,
      descripcion,
      id_usuario: user.id,
      fecha_modificacion: new Date(),
      id_seccion: 2
    })
    .select()
    .single();

  if (qsError || !qsData) return NextResponse.json({ error: qsError?.message || "Error al guardar" }, { status: 500 });

  const id_quienes_somos = qsData.id;

  // Limpiar miembros existentes
  await supabase
    .from("equipo_quienes_somos")
    .delete()
    .eq("id_donde_estamos", id_quienes_somos);

  // Insertar nuevos miembros
  const miembrosInsert = equipo.map((miembro: any, index: number) => ({
    id_donde_estamos: id_quienes_somos,
    nombre: miembro.nombre,
    rol: miembro.rol,
    imagen: miembro.imagen, // URL del frontend
    orden: index
  }));

  const { error: equipoError } = await supabase
    .from("equipo_quienes_somos")
    .insert(miembrosInsert);

  if (equipoError) return NextResponse.json({ error: equipoError.message }, { status: 500 });

  return NextResponse.json({ ...qsData, equipo: miembrosInsert });
}
