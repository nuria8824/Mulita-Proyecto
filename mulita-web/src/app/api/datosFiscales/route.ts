import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  const { data, error } = await supabase
    .from("datos_fiscales")
    .select("*")
    .eq("usuario_id", userId)
    .single();

  return Response.json({ datosFiscales: data ?? null });
}

export async function POST(req: Request) {
  const body = await req.json();

  const { razon_social, cuit_cuil, usuario_id } = body;

  const { data, error } = await supabase
    .from("datos_fiscales")
    .insert([{ razon_social, cuit_cuil, usuario_id }])
    .select()
    .single();

  return Response.json({ datosFiscales: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, razon_social, cuit_cuil } = body;

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
