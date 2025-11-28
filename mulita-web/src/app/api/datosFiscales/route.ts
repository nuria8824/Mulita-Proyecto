import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  const { data, error } = await supabase
    .from("datos_fiscales")
    .select("*")
    .eq("usuario_id", userId)
    .single();

  if (!data || error) {
    return NextResponse.json(
      { error: "Datos fiscales no encontrados." },
      { status: 404 }
    );
  }

  return Response.json({ datosFiscales: data ?? null });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { razon_social, cuit_cuil, usuario_id } = body;
  console.log("razon social", razon_social);

  const { data, error } = await supabase
    .from("datos_fiscales")
    .insert([{ razon_social, cuit_cuil, usuario_id }])
    .select()
    .single();

  if (!data || error) console.log("error creando datos fiscales", error)

  return Response.json({ datosFiscales: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, razon_social, cuit_cuil } = body;
  console.log("razon_social editar", razon_social)

  const { data } = await supabase
    .from("datos_fiscales")
    .update({
      razon_social,
      cuit_cuil,
      updated_at: new Date()
    })
    .eq("id", id)
    .select()
    .single();

  return Response.json({ datosFiscales: data });
}
