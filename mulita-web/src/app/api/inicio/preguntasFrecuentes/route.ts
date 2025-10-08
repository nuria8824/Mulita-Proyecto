import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener todas las preguntas frecuentes
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("preguntas_frecuentes")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Error al obtener preguntas frecuentes:", error);
    return NextResponse.json(
      { error: "Error al obtener preguntas frecuentes" },
      { status: 500 }
    );
  }
}

// PATCH: actualizar pregunta existente
export async function PATCH(req: NextRequest) {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Verificar rol
  const { data: usuario } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "superAdmin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id, pregunta, respuesta } = await req.json();
  if (!id) return NextResponse.json({ error: "ID de pregunta requerido" }, { status: 400 });

  const { data, error } = await supabase
    .from("preguntas_frecuentes")
    .update({
      pregunta,
      respuesta,
      id_usuario: user.id,
      fecha_modificacion: new Date(),
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
