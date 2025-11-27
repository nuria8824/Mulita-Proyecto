import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { cookies } from "next/headers";

// Actualizar cantidad o eliminar item del carrito
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("sb-access-token")?.value;

    if (!access_token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener usuario de Supabase usando el token
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(access_token);
    
    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = user.id;

    const { cantidad } = await req.json();
    const resolvedParams = await params;
    const itemId = resolvedParams.id;

    if (!cantidad || cantidad < 1) {
      return NextResponse.json(
        { error: "Cantidad inválida" },
        { status: 400 }
      );
    }

    // Verificar que el item pertenezca al usuario
    const { data: item } = await supabaseServer
      .from("carrito_items")
      .select(
        `
        *,
        carrito:carritos(usuario_id)
      `
      )
      .eq("id", itemId)
      .single();

    if (!item || item.carrito.usuario_id !== userId) {
      return NextResponse.json(
        { error: "Item no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar cantidad
    const { error: updateError } = await supabaseServer
      .from("carrito_items")
      .update({ cantidad })
      .eq("id", itemId);

    if (updateError) throw updateError;

    // Recalcular total del carrito
    const { data: items } = await supabaseServer
      .from("carrito_items")
      .select("*")
      .eq("carrito_id", item.carrito_id);

    const newTotal =
      items?.reduce((sum, i) => sum + i.precio * i.cantidad, 0) || 0;
    const newCantidad = items?.reduce((sum, i) => sum + i.cantidad, 0) || 0;

    await supabaseServer
      .from("carritos")
      .update({
        total: newTotal,
        cantidad_items: newCantidad,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", item.carrito_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en PUT /api/carrito/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar item" },
      { status: 500 }
    );
  }
}

// Eliminar item del carrito
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("sb-access-token")?.value;

    if (!access_token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener usuario de Supabase usando el token
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(access_token);
    
    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = user.id;

    const resolvedParams = await params;
    const itemId = resolvedParams.id;

    // Verificar que el item pertenezca al usuario
    const { data: item } = await supabaseServer
      .from("carrito_items")
      .select(
        `
        *,
        carrito:carritos(usuario_id)
      `
      )
      .eq("id", itemId)
      .single();

    if (!item || item.carrito.usuario_id !== userId) {
      return NextResponse.json(
        { error: "Item no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar item
    const { error: deleteError } = await supabaseServer
      .from("carrito_items")
      .delete()
      .eq("id", itemId);

    if (deleteError) throw deleteError;

    // Recalcular total del carrito
    const { data: items } = await supabaseServer
      .from("carrito_items")
      .select("*")
      .eq("carrito_id", item.carrito_id);

    const newTotal =
      items?.reduce((sum, i) => sum + i.precio * i.cantidad, 0) || 0;
    const newCantidad = items?.reduce((sum, i) => sum + i.cantidad, 0) || 0;

    await supabaseServer
      .from("carritos")
      .update({
        total: newTotal,
        cantidad_items: newCantidad,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", item.carrito_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE /api/carrito/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar item" },
      { status: 500 }
    );
  }
}
