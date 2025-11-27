import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/subirArchivos";

// GET: listar todas las noticias
export async function GET() {
  const { data, error } = await supabase
    .from("noticia")
    .select("*")
    .eq("eliminado", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: crear noticia
export async function POST(req: NextRequest) {
  try {
    // Validar autenticación desde cookie
    const token = req.cookies.get("sb-access-token")?.value;
    console.log("Token:", token);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    console.log("userData", userData, "userError", userError);

    if (userError || !userData.user) {
      return NextResponse.json({ error: "Usuario inválido" }, { status: 401 });
    }

    // Buscar rol del usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuario")
      .select("rol")
      .eq("id", userData.user.id)
      .single();

    console.log("usuario:", usuario, "usuarioError", usuarioError);

    if (usuarioError || !usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 403 });
    }

    if (usuario.rol !== "admin" && usuario.rol !== "superAdmin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

   // Leer datos JSON
    const body = await req.json();
    const { titulo, autor, introduccion, descripcion, imagen_principal } = body;

    console.log({ titulo, autor, introduccion, descripcion, imagen_principal });

    if (!titulo || !autor || !introduccion || !descripcion || !imagen_principal) {
      return NextResponse.json({ error: "Campos faltantes" }, { status: 400 });
    }

    // Insertar noticia en la DB
    const { data: noticia, error } = await supabase
      .from("noticia")
      .insert({
        titulo,
        autor,
        introduccion,
        descripcion,
        imagen_principal: imagen_principal.url,
      })
      .select()
      .single();

    if (error) {
      console.log("Error insertando noticia:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("Noticia creada:", noticia);
    return NextResponse.json({ success: true, noticia });
  } catch (err: any) {
    console.error("Error creando noticia:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}