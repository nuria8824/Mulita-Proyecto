import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const { data, error } = await supabase
    .from("perfil")
    .select("*, usuario:usuario_id(id,nombre,apellido,email,rol)")
    .eq("usuario_id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ perfil: data });
}
