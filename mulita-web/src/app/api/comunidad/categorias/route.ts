import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: traer todas las categorías
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json({ categorias });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

// POST: crear nueva categoría
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre } = body;

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre de la categoría es obligatorio" },
        { status: 400 }
      );
    }

    // Evitar duplicados
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { nombre },
    });

    if (categoriaExistente) {
      return NextResponse.json(
        { error: "La categoría ya existe" },
        { status: 400 }
      );
    }

    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre },
    });

    return NextResponse.json({ categoria: nuevaCategoria }, { status: 201 });
  } catch (error) {
    console.error("Error creando categoría:", error);
    return NextResponse.json(
      { error: "Error al crear categoría" },
      { status: 500 }
    );
  }
}
