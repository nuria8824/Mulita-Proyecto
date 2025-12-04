"use client";

import { useEffect, useState } from "react";
import SkeletonDondeEstamos from "./skelentons/SkeletonDondeEstamos";
import dynamic from "next/dynamic";

const Mapa = dynamic(() => import("@/components/ui/sobre-nosotros/Mapa"), {
  ssr: false,
});

interface DondeEstamosData {
  id: number;
  titulo: string;
  contenido: string;
}

export function DondeEstamos() {
  const [dondeEstamos, setDondeEstamos] = useState<DondeEstamosData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDondeEstamos = async () => {
      try {
        const res = await fetch("/api/sobreNosotros/dondeEstamos");
        const data = await res.json();
        setDondeEstamos(data);
      } catch (err) {
        console.error("Error al obtener Donde Estamos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDondeEstamos();
  }, []);

  if (loading) return <SkeletonDondeEstamos />;
  if (!dondeEstamos)
    return <p className="text-center mt-10">No hay contenido disponible</p>;

  return (
    <section
      id="donde-estamos"
      className="w-full px-6 md:px-20 lg:px-40 py-16 bg-white"
    >
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h3 className="text-[#003c71] font-extrabold text-3xl md:text-4xl mb-3">
          {dondeEstamos.titulo}
        </h3>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Grid principal: Mapa izquierda, texto derecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* MAPA */}
        <div className="w-full">
          <Mapa />
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col justify-center">
          <p className="text-gray-700 leading-7 mb-6 whitespace-pre-line">
            {dondeEstamos.contenido}
          </p>
        </div>
      </div>
    </section>
  );
}
