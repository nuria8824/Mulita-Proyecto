import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// PATCH: actualizar producto para mostrarlo en el inicio
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
  const { data: usuario } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "superAdmin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Obtener valor actual
  const { data: productoActual, error: fetchError } = await supabase
    .from("producto")
    .select("mostrar_en_inicio")
    .eq("id", params.id)
    .single();

  if (fetchError || !productoActual) {
    return NextResponse.json({ error: "No se encontró el producto" }, { status: 404 });
  }

  // Invertir valor actual
  const nuevoValor = !productoActual.mostrar_en_inicio;

  // Actualizar el producto
  const { data, error } = await supabase
    .from("producto")
    .update({ mostrar_en_inicio: nuevoValor })
    .eq("id", params.id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  console.log(`Producto ${params.id} actualizado -> mostrar_en_inicio: ${nuevoValor}`);
  console.log("data: ", data);

  return NextResponse.json(data);
}
