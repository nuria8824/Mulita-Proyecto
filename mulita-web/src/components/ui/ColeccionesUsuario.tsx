"use client";

import { useEffect, useState } from "react";
import MenuAccionesColecciones from "./MenuAccionesColecciones";

type Coleccion = {
  id: string;
  nombre: string;
  created_at: string;
};

export default function ColeccionesGrid() {
  const [colecciones, setColecciones] = useState<Coleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColecciones = async () => {
      try {
        const res = await fetch("/api/colecciones");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al obtener colecciones");
        setColecciones(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchColecciones();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Cargando colecciones...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (colecciones.length === 0)
    return <p className="text-center text-gray-400">No tenés colecciones todavía.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
      {colecciones.map((col) => (
        <div
          key={col.id}
          className="relative flex flex-col items-start justify-between p-6 rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
        >
          {/* Línea superior */}
          <div className="flex justify-between items-center w-full text-sm font-semibold text-gray-500 mb-2">
            <span>
              {new Date(col.created_at).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>

            {/* Botón de acciones */}
            <MenuAccionesColecciones coleccionId={col.id} />
          </div>

          {/* Nombre */}
          <h3 className="text-2xl font-semibold text-[#003c71] mt-2 mb-4 text-left">
            {col.nombre}
          </h3>
        </div>
      ))}
    </div>
  );
}
