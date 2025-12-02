import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// GET: obtener cualquier perfil (visible para todos los autenticados)
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Obtener usuario autenticado
  const {
    data: { user },
    error: userError,
  } = await supabaseServer.auth.getUser(access_token);
  if (userError || !user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data, error } = await supabaseServer
    .from("perfil")
    .select("*, usuario(id,nombre,apellido,email,rol)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ perfil: data });
}

// PATCH: actualizar el perfil (solo el propietario)
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  console.log("PATCH /api/perfil/[id] called");
  const params = await props.params;
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user } } = await supabaseServer.auth.getUser(access_token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Chequear que el usuario solo edite su propio perfil
  if (user.id !== params.id) {
    console.log("user.id:", user.id, "params.id:", params.id);
    return NextResponse.json({ error: "No podés modificar el perfil de otro usuario" }, { status: 403 });
  }

  // Leer datos JSON
  const body = await req.json();
  const { biografia, nombre, apellido, passwordActual, passwordNueva, imagen } = body;

  let imagen_url;

  console.log("Datos recibidos para actualizar:", { biografia, nombre, apellido });
  console.log("imagen url", imagen);

  // Validar que nombre y apellido no estén vacíos
  if (!nombre.trim() || !apellido.trim()) {
    return NextResponse.json({ error: "Nombre y apellido son requeridos" }, { status: 400 });
  }

  // Si intenta cambiar la contraseña
  if (passwordNueva) {
    if (!passwordActual) {
      return NextResponse.json({ error: "Debes ingresar tu contraseña actual" }, { status: 400 });
    }

    // Intentar autenticar con la contraseña actual
    const { error: signInError } = await supabaseServer.auth.signInWithPassword({
      email: user.email || "",
      password: passwordActual,
    });

    if (signInError) {
      return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
    }

    // Actualizar la contraseña
    const { error: updateError } = await supabaseServer.auth.updateUser(
      { password: passwordNueva }
    );

    if (updateError) {
      return NextResponse.json({ error: "Error al cambiar la contraseña: " + updateError.message }, { status: 500 });
    }
  }

  // Obtener imagen actual
  const { data: perfilActual } = await supabaseServer
    .from("perfil")
    .select("imagen")
    .eq("id", params.id)
    .single();

  // Subir imagen_principal si es un File
  if (imagen === null) {
    imagen_url = perfilActual?.imagen;
  } else {
    imagen_url = imagen
  }

  // Actualizar perfil
  const { data: perfil, error } = await supabaseServer
    .from("perfil")
    .update({
      biografia,
      imagen: imagen_url,
      updated_at: new Date(),
    })
    .eq("id", user.id)
    .select()
    .single();

  console.log("Perfil actualizado:", perfil);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Actualizar usuario (nombre y apellido) en la tabla usuario
  const { error: userUpdateError } = await supabaseServer
    .from("usuario")
    .update({
      nombre,
      apellido,
    })
    .eq("id", user.id);

  if (userUpdateError) {
    console.error("Error al actualizar usuario:", userUpdateError);
    return NextResponse.json({ error: "Error al actualizar datos del usuario: " + userUpdateError.message }, { status: 500 });
  }

  return NextResponse.json(perfil);
}
