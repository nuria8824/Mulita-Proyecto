// /api/perfil/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    const { data: usuario, error } = await supabase
      .from("usuario")
      .select("id, nombre, apellido, email, created_at")
      .eq("id", id)
      .single();

    if (error || !usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ usuario });
  } catch (err) {
    console.error("Error en /perfil/[id]:", err);
    return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 });
  }
}
