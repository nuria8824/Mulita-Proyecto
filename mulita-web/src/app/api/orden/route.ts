import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuario_id, datos_fiscales_id, items } = body;

    if (!usuario_id || !datos_fiscales_id || !items?.length) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // Verificar que el usuario exista
    const { data: user, error: userError } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", usuario_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "El usuario no existe." },
        { status: 404 }
      );
    }

    // Verificar que los datos fiscales existan
    const { data: fiscal, error: fiscalError } = await supabase
      .from("datos_fiscales")
      .select("*")
      .eq("id", datos_fiscales_id)
      .single();

    if (fiscalError || !fiscal) {
      return NextResponse.json(
        { error: "Datos fiscales no encontrados." },
        { status: 404 }
      );
    }

    // Crear la orden
    const total = items.reduce(
      (acc: number, item: any) => acc + item.cantidad * item.precio_unitario,
      0
    );

    const { data: orden, error: ordenError } = await supabase
      .from("orden_compra")
      .insert({
        usuario_id,
        datos_fiscales_id,
        total,
      })
      .select()
      .single();

    if (ordenError || !orden) {
      return NextResponse.json(
        { error: "Error al crear la orden." },
        { status: 500 }
      );
    }

    // Crear los items de la orden
    const itemsPayload = items.map((item: any) => ({
      orden_id: orden.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
    }));

    const { error: itemsError } = await supabase
      .from("orden_items")
      .insert(itemsPayload);

    if (itemsError) {
      return NextResponse.json(
        { error: "Orden creada, pero error al guardar los items." },
        { status: 500 }
      );
    }

    // Respuesta final
    return NextResponse.json(
      { message: "Orden creada con éxito", orden, items: itemsPayload },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERROR /api/orden:", error);
    return NextResponse.json(
      { error: "Error interno." },
      { status: 500 }
    );
  }
}
