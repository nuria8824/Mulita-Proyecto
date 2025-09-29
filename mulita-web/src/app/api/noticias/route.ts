import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadFile } from "@/lib/subirArchivos";

// GET: listar todas las noticias
export async function GET() {
  const { data, error } = await supabase
    .from("noticia")
    .select("*")
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

    if (usuario.rol !== "admin" && usuario.rol !== "super_admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Procesar el formData
    const formData = await req.formData();
    const titulo = formData.get("titulo") as string;
    const autor = formData.get("autor") as string;
    const introduccion = formData.get("introduccion") as string;
    const descripcion = formData.get("descripcion") as string;
    const imagen_principal = formData.get("imagen_principal") as File;
    const archivo = formData.get("archivo") as File | null;

    console.log({ titulo, autor, introduccion, descripcion, imagen_principal, archivo });

    if (!titulo || !autor || !introduccion || !descripcion || !imagen_principal) {
      return NextResponse.json({ error: "Campos faltantes" }, { status: 400 });
    }

    console.log("Intentando subir imagen...")
    // Subir imagen principal
    const imagenUrl = await uploadFile(imagen_principal, "noticias/imagenes");
    console.log("Imagen subida:", imagenUrl);

    // Subir archivo extra si existe
    let archivoUrl = null;
    if (archivo) {
      archivoUrl = await uploadFile(archivo, "noticias/archivos");
      console.log("Archivo subido:", archivoUrl);
    }

    // Insertar noticia en la DB
    const { data: noticia, error } = await supabase
      .from("noticia")
      .insert({
        titulo,
        autor,
        introduccion,
        descripcion,
        imagen_principal: imagenUrl,
        archivo: archivoUrl,
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