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
  descripcion: string;
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

        {/* TEXTO + LISTA */}
        <div className="flex flex-col justify-center">
          <h4 className="text-xl font-bold text-[#003c71] mb-4">
            Nuestra oficina central
          </h4>

          <p className="text-gray-700 leading-7 mb-6">
            Se encuentra en{" "}
            <span className="font-semibold">
              Universidad Adventista del Plata, Libertador San Martín,
              Entre Ríos, Argentina.
            </span>
            <br />
            <br />
            Pero también puedes encontrar a la Mulita en:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>
              <strong>Chile:</strong> Universidad Adventista de Chile
            </li>
            <li>
              <strong>Perú:</strong> Universidad Peruana Unión
            </li>
            <li>
              <strong>Bolivia:</strong> Universidad Adventista de Bolivia
            </li>
            <li>
              <strong>Colombia:</strong> Corporación Universitaria Adventista
            </li>
            <li>
              <strong>México:</strong> Universidad Linda Vista
            </li>
            <li>
              <strong>Puerto Rico:</strong> Antillean Adventist University
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
