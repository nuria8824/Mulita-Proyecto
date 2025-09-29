import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: obtener una noticia
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("noticia")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT: editar noticia
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data: usuario } = await supabase.from("usuario").select("rol").eq("id", user.id).single();
  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "super_admin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { titulo, autor, introduccion, imagen_principal, descripcion, archivo } = body;

  const { data, error } = await supabase
    .from("noticia")
    .update({ titulo, autor, introduccion, imagen_principal, descripcion, archivo })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE: borrar noticia
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(access_token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { data: usuario } = await supabase.from("usuario").select("rol").eq("id", user.id).single();
  if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "super_admin")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { error } = await supabase.from("noticia").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Noticia eliminada" });
}

