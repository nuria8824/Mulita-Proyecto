import { NextRequest, NextResponse } from "next/server";
import { fetchNoticiaById, actualizarNoticia, eliminarNoticia } from "@/lib/apiNoticias";
import { useUser } from "@/context/UserContext";

// GET: traer una noticia por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const noticia = await fetchNoticiaById(id);
    return NextResponse.json({ noticia });
  } catch (err: any) {
    console.error("API proxy GET /api/noticias/[id]:", err);
    return NextResponse.json({ error: err.message || "Error fetching noticia" }, { status: 500 });
  }
}

// PUT /api/noticias/:id
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const token = req.cookies.get("supabase_token")?.value;
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const id = parseInt(context.params.id);
    const formData = await req.formData();
    const noticia = await actualizarNoticia(id, formData, token);

    return NextResponse.json({ noticia });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/noticias/:id
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const token = req.cookies.get("supabase_token")?.value;
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const id = parseInt(context.params.id);
    await eliminarNoticia(id, token);

    return NextResponse.json({ deleted: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}