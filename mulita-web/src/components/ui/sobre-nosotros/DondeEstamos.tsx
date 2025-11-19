"use client";

import { useEffect, useState } from "react";
import SkeletonDondeEstamos from "./skelentons/SkeletonDondeEstamos";

interface DondeEstamosData {
  id: number;
  titulo: string;
  descripcion: string;
  imagen1: string;
  imagen2: string;
  imagen3: string;
  imagen4: string;
  imagen5: string;
  imagen6: string;
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
    <section id="donde-estamos" className="w-full flex flex-col items-center px-6 md:px-20 lg:px-40 py-16 bg-white">
      {/* Encabezado */}
      <div className="text-center">
        <h3 className="text-[#003c71] font-extrabold text-3xl md:text-4xl mb-3">
          {dondeEstamos.titulo}
        </h3>
        <p className="max-w-lg mx-auto text-gray-600 text-base md:text-lg leading-7">
          {dondeEstamos.descripcion}
        </p>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Galería adaptable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-[1100px]">
        {/* Columna 1 */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[1/1] overflow-hidden rounded-lg">
            <img
              src={dondeEstamos.imagen1}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[1/1] overflow-hidden rounded-lg">
            <img
              src={dondeEstamos.imagen2}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[354/477] overflow-hidden rounded-lg">
            <img
              src={dondeEstamos.imagen3}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[354/231] overflow-hidden rounded-lg">
            <img
              src={dondeEstamos.imagen4}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Columna 3 */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[354/231] overflow-hidden rounded-lg">
            <img
              src={dondeEstamos.imagen5}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[354/469] overflow-hidden rounded-lg">
            <img
              src={dondeEstamos.imagen6}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
