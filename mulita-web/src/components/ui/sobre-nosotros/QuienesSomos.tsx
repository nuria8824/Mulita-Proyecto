"use client";

import { useEffect, useState } from "react";

interface QuienesSomosData {
  id: number;
  titulo1: string;
  titulo2: string;
  titulo3: string;
  descripcion1: string;
  descripcion2: string;
  descripcion3: string;
  imagen1: string;
  imagen2: string;
}

export function QuienesSomos() {
  const [quienesSomos, setQuienesSomos] = useState<QuienesSomosData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuienesSomos = async () => {
      try {
        const res = await fetch("/api/sobreNosotros/quienesSomos");
        const data = await res.json();
        setQuienesSomos(data);
      } catch (err) {
        console.error("Error al obtener QuienesSomos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuienesSomos();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando contenido...</p>;
  if (!quienesSomos) return <p className="text-center mt-10">No hay contenido disponible</p>;

  return (
    <section id="quienes-somos" className="w-full flex flex-col items-center px-6 md:px-20 lg:px-40 py-16 bg-white">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-[#003c71] font-extrabold text-3xl md:text-4xl">{quienesSomos.titulo1}</h3>
        <p className="max-w-md text-base md:text-lg leading-6 mt-6 text-gray-600">
          {quienesSomos.descripcion1}
        </p>
      </div>

      <div className="w-20 border-t-4 border-yellow-400 rotate-[-0.7deg] my-12"></div>

      <div key={quienesSomos.id} className="flex flex-col md:flex-row gap-8 flex-wrap justify-center w-full">
        {/* Bloque 1 */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full sm:w-[90%] md:w-[45%] max-w-[541px]">
          <img
            className="w-full h-[250px] md:h-[350px] object-cover"
            src={quienesSomos.imagen1}
            alt={quienesSomos.titulo2}
          />
          <div className="flex flex-col p-4 gap-3">
            <h4 className="text-[#003c71] font-extrabold text-lg">{quienesSomos.titulo2}</h4>
            <p className="text-sm md:text-base leading-5 text-gray-700">{quienesSomos.descripcion2}</p>
          </div>
        </div>

        {/* Bloque 2 */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full sm:w-[90%] md:w-[45%] max-w-[541px]">
          <img
            className="w-full h-[250px] md:h-[350px] object-cover"
            src={quienesSomos.imagen2}
            alt={quienesSomos.titulo3}
          />
          <div className="flex flex-col p-4 gap-3">
            <h4 className="text-[#003c71] font-extrabold text-lg">{quienesSomos.titulo3}</h4>
            <p className="text-sm md:text-base leading-5 text-gray-700">{quienesSomos.descripcion3}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
