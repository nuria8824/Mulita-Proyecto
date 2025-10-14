"use client";

import { useEffect, useState } from "react";

interface MisionVisionData {
  id: number;
  titulo1: string;
  titulo2: string;
  descripcion1: string;
  descripcion2: string;
  imagen1: string;
  imagen2: string;
}

export function MisionVision() {
  const [misionVision, setMisionVision] = useState<MisionVisionData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisionVision = async () => {
      try {
        const res = await fetch("/api/sobreNosotros/misionVision");
        const data = await res.json();
        setMisionVision(data);
      } catch (err) {
        console.error("Error al obtener QuienesSomos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMisionVision();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando contenido...</p>;
  if (!misionVision) return <p className="text-center mt-10">No hay contenido disponible</p>;

  return (
    <section id="mision-vision" className="flex flex-col items-center w-full px-6 md:px-20 lg:px-40 py-16 gap-12 bg-white">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Misión */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full lg:w-1/2">
          <h4 className="text-[#003c71] font-extrabold text-xl">{misionVision.titulo1}</h4>
          <p className="text-gray-600 mt-4 text-base md:text-lg leading-7">
            {misionVision.descripcion1}
          </p>
          <div className="w-full h-[250px] rounded-lg mt-4 relative overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={misionVision.imagen1}
              alt={misionVision.titulo1}
            />
          </div>
        </div>

        {/* Visión */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full lg:w-1/2">
          <div className="w-full rounded-lg mt-2 relative overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src={misionVision.imagen2}
              alt={misionVision.titulo2}
            />
          </div>
          <h4 className="text-[#003c71] font-extrabold text-xl mt-5">{misionVision.titulo2}</h4>
          <p className="text-gray-600 mt-4 text-base md:text-lg leading-7">
            {misionVision.descripcion2}
          </p>
        </div>
      </div>
    </section>
  );
}
