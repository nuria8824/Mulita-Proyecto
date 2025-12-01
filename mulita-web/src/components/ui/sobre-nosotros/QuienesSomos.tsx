"use client";

import { useEffect, useState } from "react";
import SkeletonQuienesSomos from "./skelentons/SkeletonQuienesSomos";

interface MiembroEquipo {
  nombre: string;
  rol: string;
  imagen: string;
}

interface QuienesSomosData {
  titulo: string;
  descripcion: string;
  equipo: MiembroEquipo[];
}

export function QuienesSomos() {
  const [quienesSomos, setQuienesSomos] = useState<QuienesSomosData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuienesSomos = async () => {
      try {
        const res = await fetch("/api/sobreNosotros/quienesSomos");
        if (!res.ok) throw new Error("Error al obtener Quienes Somos");
        const data = await res.json();
        setQuienesSomos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuienesSomos();
  }, []);

  if (loading) return <SkeletonQuienesSomos />;
  if (!quienesSomos) return <p className="text-center mt-10">No hay contenido disponible</p>;

  return (
    <section id="quienes-somos" className="w-full flex flex-col items-center px-6 md:px-20 lg:px-40 py-16 bg-white">
      {/* Título y descripción principal */}
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-[#003c71] font-extrabold text-3xl md:text-4xl">{quienesSomos.titulo}</h2>
        <p className="max-w-2xl text-base md:text-lg leading-6 mt-4 text-gray-600">
          {quienesSomos.descripcion}
        </p>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Equipo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {quienesSomos.equipo.map((miembro, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="w-full h-48 overflow-hidden">
              <img
                src={miembro.imagen}
                alt={miembro.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center p-4 gap-1">
              <h4 className="text-[#003c71] font-semibold text-lg">{miembro.nombre}</h4>
              <p className="text-sm text-gray-700">{miembro.rol}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
