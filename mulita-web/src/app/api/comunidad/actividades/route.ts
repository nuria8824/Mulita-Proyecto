// import { NextResponse, NextRequest } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getUserFromRequest } from "@/lib/auth";

// // GET: traer todas las actividades
// export async function GET() {
//   try {
//     const actividades = await prisma.actividad.findMany({
//       include: {
//         categoria: true, // ahora es solo una categoría
//         usuario: {
//           select: { id: true, nombre: true, apellido: true },
//         },
//       },
//       orderBy: {
//         fecha: "desc",
//       },
//     });

//     return NextResponse.json({ actividades });
//   } catch (error) {
//     console.error("Error al obtener actividades:", error);
//     return NextResponse.json(
//       { error: "Error al obtener actividades" },
//       { status: 500 }
//     );
//   }
// }

// // POST: crear nueva actividad
// export async function POST(req: NextRequest) {
//   try {
//     const user = getUserFromRequest(req);

//     if (!user) {
//       return NextResponse.json(
//         { error: "Usuario no autenticado" },
//         { status: 401 }
//       );
//     }

//     const formData = await req.formData();
//     const titulo = formData.get("titulo")?.toString() || "";
//     const descripcion = formData.get("descripcion")?.toString() || "";
//     const archivoFile = formData.get("archivo") as File | null;
//     const categoriaId = Number(formData.get("categoriaId"));

//     if (!titulo || !descripcion) {
//       return NextResponse.json(
//         { error: "Faltan campos obligatorios" },
//         { status: 400 }
//       );
//     }

//     if (!categoriaId) {
//       return NextResponse.json(
//         { error: "Debe seleccionar una categoría" },
//         { status: 400 }
//       );
//     }

//     const archivo = archivoFile?.name || null;

//     const actividad = await prisma.actividad.create({
//       data: {
//         titulo,
//         descripcion,
//         archivo,
//         usuario: { connect: { id: user.id } },
//         categoria: { connect: { id: categoriaId } },
//       },
//       include: {
//         usuario: true,
//         categoria: true,
//       },
//     });

//     return NextResponse.json({ actividad }, { status: 201 });
//   } catch (error) {
//     console.error("Error creando actividad:", error);
//     return NextResponse.json(
//       { error: "Error al crear actividad" },
//       { status: 500 }
//     );
//   }
// }
