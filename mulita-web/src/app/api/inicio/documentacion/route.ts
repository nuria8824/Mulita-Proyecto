import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Obtener la documentación principal
  const { data: docu, error } = await supabase
    .from("documentacion")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Obtener documentos asociados
  const { data: items, error: itemsError } = await supabase
    .from("documentos")
    .select("*")
    .eq("id_documentacion", docu.id)
    .order("id", { ascending: true });

  if (itemsError)
    return NextResponse.json({ error: itemsError.message }, { status: 500 });

  return NextResponse.json({ ...docu, documentos: items });
}

export async function PATCH(req: NextRequest) {
  // AUTENTICACIÓN
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const {
    data: { user },
  } = await supabase.auth.getUser(access_token);

  if (!user)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  // Validar rol
  const { data: usuario } = await supabase
    .from("usuario")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "superAdmin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // BODY
  const body = await req.json();
  const { titulo, descripcion, documentos } = body;

  console.log("documentos", documentos);

  if (!titulo || !descripcion || !Array.isArray(documentos)) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // UPSERT DOCUMENTACION
  const { data: docuData, error: docuError } = await supabase
    .from("documentacion")
    .upsert({
      id: 1,
      titulo,
      descripcion,
      id_usuario: user.id,
      fecha_modificacion: new Date(),
      id_seccion: 4,
    })
    .select()
    .single();

  if (docuError || !docuData)
    return NextResponse.json(
      { error: docuError?.message || "Error al guardar" },
      { status: 500 }
    );

  const id_documentacion = docuData.id;

  // LIMPIAR DOCUMENTOS ANTERIORES
  await supabase.from("documentos").delete().eq("id_documentacion", id_documentacion);

  // INSERTAR DOCUMENTOS NUEVOS
  const docsInsert = documentos.map((doc: any) => ({
    id_documentacion,
    tipo: doc.tipo,
    url: doc.url || "",
    descripcion: doc.descripcion ?? "",
    nombre: doc.nombre ?? "",
  }));

  const { error: insertError } = await supabase
    .from("documentos")
    .insert(docsInsert);

  if (insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ ...docuData, documentos: docsInsert });
}
