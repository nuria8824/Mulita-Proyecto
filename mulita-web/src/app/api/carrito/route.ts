import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Obtener el carrito actual del usuario
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("sb-access-token")?.value;

    if (!access_token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Crear cliente de Supabase con el token del usuario
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      }
    );

    // Obtener usuario de Supabase usando el token
    const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = user.id;

    // Obtener o crear carrito
    let { data: carrito, error: carritoError } = await supabaseWithAuth
      .from("carritos")
      .select("*")
      .eq("usuario_id", userId)
      .single();

    if (carritoError && carritoError.code !== "PGRST116") {
      throw carritoError;
    }

    if (!carrito) {
      return NextResponse.json({ carrito: null, items: [] }, { status: 200 });
    }

    // Obtener items del carrito con datos del producto
    const { data: items, error: itemsError } = await supabaseWithAuth
      .from("carrito_items")
      .select("*")
      .eq("carrito_id", carrito.id);

    if (itemsError) throw itemsError;

    // Obtener datos de productos para cada item
    let itemsConProducto = [];
    if (items && items.length > 0) {
      const productoIds = items.map(item => item.producto_id);
      console.log("Buscando productos con IDs:", productoIds);
      
      const { data: productos, error: productosError } = await supabaseWithAuth
        .from("producto")
        .select("*")
        .in("id", productoIds);

      console.log("Productos encontrados:", productos);
      console.log("Error de productos:", productosError);

      itemsConProducto = items.map(item => {
        const producto = productos?.find(p => p.id === item.producto_id);
        return {
          ...item,
          producto: producto ? {
            id: producto.id,
            nombre: producto.nombre || producto.titulo || `Producto ${producto.id?.slice(0, 8)}`,
            descripcion: producto.descripcion,
            imagen: producto.imagen || producto.archivo_url,
            precio: producto.precio
          } : null
        };
      });
    }

    return NextResponse.json({
      carrito,
      items: itemsConProducto,
    });
  } catch (error) {
    console.error("Error en GET /api/carrito:", error);
    return NextResponse.json(
      { error: "Error al obtener carrito" },
      { status: 500 }
    );
  }
}

// Agregar item al carrito
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("sb-access-token")?.value;

    if (!access_token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Crear cliente de Supabase con el token del usuario
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      }
    );

    // Obtener usuario de Supabase usando el token
    const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = user.id;

    const { producto_id, cantidad, precio } = await req.json();

    if (!producto_id || !cantidad || !precio) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Obtener o crear carrito
    let { data: carrito, error: carritoError } = await supabaseWithAuth
      .from("carritos")
      .select("*")
      .eq("usuario_id", userId)
      .single();

    if (carritoError && carritoError.code !== "PGRST116") {
      throw carritoError;
    }

    console.log("POST - Carrito encontrado:", carrito?.id);

    if (!carrito) {
      console.log("POST - Creando carrito para usuario:", userId);
      const { data: nuevoCarrito, error: crearError } = await supabaseWithAuth
        .from("carritos")
        .upsert(
          [{ usuario_id: userId, total: 0, cantidad_items: 0 }],
          { onConflict: "usuario_id" }
        )
        .select()
        .single();

      if (crearError) {
        console.log("POST - Error al crear carrito:", crearError);
        throw crearError;
      }
      console.log("POST - Carrito creado:", nuevoCarrito?.id);
      carrito = nuevoCarrito;
    }

    // Verificar si el item ya existe en el carrito
    const { data: existingItem } = await supabaseWithAuth
      .from("carrito_items")
      .select("*")
      .eq("carrito_id", carrito.id)
      .eq("producto_id", producto_id)
      .single();

    if (existingItem) {
      // Actualizar cantidad
      const { error: updateError } = await supabaseWithAuth
        .from("carrito_items")
        .update({ cantidad: existingItem.cantidad + cantidad })
        .eq("id", existingItem.id);

      if (updateError) throw updateError;
    } else {
      // Insertar nuevo item
      const { error: insertError } = await supabaseWithAuth
        .from("carrito_items")
        .insert([
          {
            carrito_id: carrito.id,
            producto_id,
            cantidad,
            precio,
          },
        ]);

      if (insertError) throw insertError;
    }

    // Actualizar total y cantidad de items del carrito
    const { data: items } = await supabaseWithAuth
      .from("carrito_items")
      .select("*")
      .eq("carrito_id", carrito.id);

    const newTotal =
      items?.reduce((sum, item) => sum + item.precio * item.cantidad, 0) || 0;
    const newCantidad = items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;

    await supabaseWithAuth
      .from("carritos")
      .update({
        total: newTotal,
        cantidad_items: newCantidad,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", carrito.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en POST /api/carrito:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error al agregar item al carrito: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Vaciar carrito
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("sb-access-token")?.value;

    if (!access_token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Crear cliente de Supabase con el token del usuario
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      }
    );

    // Obtener usuario de Supabase usando el token
    const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = user.id;

    const { data: carrito } = await supabaseWithAuth
      .from("carritos")
      .select("*")
      .eq("usuario_id", userId)
      .single();

    if (!carrito) {
      return NextResponse.json(
        { error: "Carrito no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar todos los items
    await supabaseWithAuth
      .from("carrito_items")
      .delete()
      .eq("carrito_id", carrito.id);

    // Actualizar carrito
    await supabaseWithAuth
      .from("carritos")
      .update({
        total: 0,
        cantidad_items: 0,
        actualizado_en: new Date().toISOString(),
      })
      .eq("id", carrito.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE /api/carrito:", error);
    return NextResponse.json(
      { error: "Error al vaciar carrito" },
      { status: 500 }
    );
  }
}
