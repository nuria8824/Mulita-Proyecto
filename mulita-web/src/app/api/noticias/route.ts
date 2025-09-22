import { NextRequest, NextResponse } from "next/server";
import { fetchNoticias, crearNoticia } from "@/lib/apiNoticias";
import { useUser } from "@/context/UserContext";

// Obtener todas las noticias
export async function GET() {
  try {
    const noticias = await fetchNoticias();
    return NextResponse.json({ noticias });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Crear nueva noticia
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("supabase_token")?.value;
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const formData = await req.formData();
    const noticia = await crearNoticia(formData, token);

    return NextResponse.json({ noticia }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}