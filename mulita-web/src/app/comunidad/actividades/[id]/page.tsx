// app/comunidad/actividades/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";

interface ActividadPageProps {
  params: { id: string };
}

export default async function ActividadPage({ params }: ActividadPageProps) {
  const actividad = await prisma.actividad.findUnique({
    where: { id: Number(params.id) },
    include: {
      usuario: { select: { nombre: true, apellido: true } },
      categoria: true,
    },
  });

  if (!actividad) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Actividad no encontrada</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-lg shadow-md flex flex-col items-center text-center text-sm text-gray-600 font-inter overflow-hidden">
        {/* Contenedor de texto */}
        <div className="flex flex-col items-start px-6 py-6 w-full">
          {/* Header: autor y fecha */}
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                <Image
                  src="/placeholder.png"
                  alt="avatar"
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>

              {/* Nombre + fecha */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-semibold text-gray-800">
                  {actividad.usuario.nombre} {actividad.usuario.apellido}
                </span>
                <span className="mx-1">&ndash;</span>
                <span className="text-xs font-medium text-gray-600">
                  {new Date(actividad.fecha).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-xl font-bold text-[#003c71] text-left w-full mb-4">
            {actividad.titulo}
          </h1>

          {/* Descripción completa */}
          <p className="text-base text-left text-gray-700 mb-6">
            {actividad.descripcion}
          </p>

          {/* Archivo adjunto */}
          {actividad.archivo && (
            <a
              href={`/uploads/${actividad.archivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Ver archivo adjunto
            </a>
          )}
        </div>

        {/* Imagen grande */}
        <div className="w-full flex justify-center mb-6">
          <Image
            src="/placeholder.png"
            alt="imagen de actividad"
            width={400}
            height={228}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Badge categoría */}
        {actividad.categoria && (
          <div className="absolute top-3 right-3 shadow-sm border border-gray-200 bg-white rounded px-3 py-1 text-sm font-semibold text-gray-700">
            {actividad.categoria.nombre}
          </div>
        )}
      </div>
    </div>
  );
}
