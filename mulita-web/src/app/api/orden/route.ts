import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuario_id, datos_fiscales_id, items, ubicacion, lat, lon } = body;

    if (!usuario_id || !datos_fiscales_id || !items?.length) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    if (!ubicacion) {
      return NextResponse.json(
        { error: "La ubicación es obligatoria." },
        { status: 400 }
      );
    }

    let finalLat = lat;
    let finalLon = lon;

    // Si NO me mandaste coordenadas, las busco en Nominatim
    if (!finalLat || !finalLon) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        ubicacion
      )}`;

      const resp = await fetch(url, {
        headers: {
          "User-Agent": "tu-app/1.0 (tu-email@example.com)",
        },
      });

      const data = await resp.json();

      if (!data?.length) {
        return NextResponse.json(
          { error: "No se pudo obtener ubicación válida." },
          { status: 400 }
        );
      }

      finalLat = data[0].lat;
      finalLon = data[0].lon;
    }

    // Verificar usuario
    const { data: user } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", usuario_id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "El usuario no existe." },
        { status: 404 }
      );
    }

    // Verificar datos fiscales
    const { data: fiscal } = await supabase
      .from("datos_fiscales")
      .select("*")
      .eq("id", datos_fiscales_id)
      .single();

    if (!fiscal) {
      return NextResponse.json(
        { error: "Datos fiscales no encontrados." },
        { status: 404 }
      );
    }

    // Calcular total
    const total = items.reduce(
      (acc: number, item: any) =>
        acc + item.cantidad * item.precio_unitario,
      0
    );

    // Crear orden
    const { data: orden, error: ordenError } = await supabase
      .from("orden_compra")
      .insert({
        usuario_id,
        datos_fiscales_id,
        total,
        direccion: ubicacion,
        latitud: finalLat,
        longitud: finalLon,
      })
      .select()
      .single();

    if (ordenError || !orden) {
      return NextResponse.json(
        { error: "Error al crear la orden." },
        { status: 500 }
      );
    }

    // Items
    const itemsPayload = items.map((item: any) => ({
      orden_id: orden.id,
      producto_id: item.producto_id,
      nombre: item.nombre,
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

    console.log("ordenBack", orden);
    console.log("itemsBack", itemsPayload);

    return NextResponse.json(
      {
        message: "Orden creada con éxito",
        orden,
        items: itemsPayload,
      },
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
