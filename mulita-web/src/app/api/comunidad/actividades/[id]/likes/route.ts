import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const actividadId = params.id;

  try {
    // Contar usuarios únicos que tienen esta actividad en alguna colección (favoritos)
    // Esto se hace buscando en coleccion_actividad donde actividad_id = actividadId
    const { data: likes, error } = await supabase
      .from("coleccion_actividad")
      .select("coleccion_id", { count: "exact" })
      .eq("actividad_id", actividadId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // El count exact nos da el número total de registros
    const likeCount = likes?.length || 0;

    return NextResponse.json({ count: likeCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
