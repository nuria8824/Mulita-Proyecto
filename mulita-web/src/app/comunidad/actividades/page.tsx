"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  archivo?: string | null;
  categoria: { id: number; nombre: string } | null;
  usuario: { id: string; nombre: string; apellido: string };
}

export default function Actividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await fetch("/api/comunidad/actividades", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setActividades(data.actividades);
        }
      } catch (err) {
        console.error("Error cargando actividades:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Cargando actividades...</p>;
  }

  if (!actividades.length) {
    return <p className="text-center py-8">No hay actividades todavía</p>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-4xl flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-semibold text-black text-center">
          Actividades de la Comunidad
        </h1>
        <p className="text-base text-[#003c71] text-center mb-6">
          Explora las actividades compartidas por todos los usuarios
        </p>

        {actividades.map((actividad) => (
          <div
            key={actividad.id}
            className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md flex flex-col overflow-hidden"
          >
            {/* Imagen / placeholder */}
            <div className="relative h-56 bg-gray-100 flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                <Image
                  src="/placeholder.png"
                  alt="icon"
                  width={66}
                  height={66}
                  className="object-cover"
                />
              </div>

              {/* Badge categoría */}
              {actividad.categoria && (
                <div className="absolute top-3 right-4 bg-white border border-gray-200 rounded px-2 py-1 shadow text-sm font-semibold">
                  {actividad.categoria.nombre}
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="p-6 flex flex-col gap-4">
              {/* Autor y fecha */}
              <div className="flex justify-between items-center text-xs text-gray-700">
                <span>
                  {actividad.usuario.nombre} {actividad.usuario.apellido}
                </span>
                <span>{new Date(actividad.fecha).toLocaleDateString()}</span>
              </div>

              <Link href={`/comunidad/actividades/${actividad.id}`}>
                <h2 className="text-xl font-semibold text-[#003c71] cursor-pointer">
                  {actividad.titulo}
                </h2>
              </Link>

              <p className="text-gray-500">{actividad.descripcion}</p>

              {/* Archivo adjunto */}
              {actividad.archivo && (
                <a
                  href={`/uploads/${actividad.archivo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ver archivo adjunto
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
