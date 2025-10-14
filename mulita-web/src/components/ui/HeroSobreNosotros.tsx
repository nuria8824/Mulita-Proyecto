"use client";

import { useEffect, useState } from "react";

interface HeroSobreNosotrosData {
  titulo: string;
  descripcion: string;
  imagen: string;
}

export function HeroSobreNosotros() {
  const [hero, setHero] = useState<HeroSobreNosotrosData>();
  const [loadingHero, setLoadingHero] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/sobreNosotros/hero");
        const data = await res.json();
        setHero(data);
      } catch (err) {
        console.error("Error al obtener HeroSobreNosotros:", err);
      } finally {
        setLoadingHero(false);
      }
    };
    fetchHero();
  }, []);

  if (loadingHero) return <p className="text-center mt-10">Cargando contenido...</p>;
  if (!hero) return <p className="text-center mt-10">No hay hero definido</p>;

  // 👇 Funciones para hacer scroll suave a las secciones
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="hero-sobre-nosotros" className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-[167px] py-16 bg-white gap-10">
      {/* Texto */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-[36px] md:text-[48px] font-extrabold text-[#003c71]">
          {hero.titulo}
        </h2>

        <p className="max-w-md text-[16px] leading-6 my-6">{hero.descripcion}</p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => scrollToSection("quienes-somos")}
            className="btn btn--blue"
          >
            ¿Quiénes Somos?
          </button>

          <button
            onClick={() => scrollToSection("donde-estamos")}
            className="btn btn--outline"
          >
            ¿Dónde estamos?
          </button>
        </div>
      </div>

      {/* Imagen */}
      <div className="w-full md:w-[564px] h-[300px] rounded-lg relative overflow-hidden">
        <img
          className="object-cover w-full h-full"
          src={hero.imagen}
          alt="Sobre nosotros"
        />
      </div>
    </section>
  );
}
