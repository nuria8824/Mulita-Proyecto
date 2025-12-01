"use client";

import { Hero } from "@/components/ui/inicio/Hero";
import { SeccionNoticias } from "@/components/ui/inicio/SeccionNoticias";
import { SeccionProductos } from "@/components/ui/inicio/SeccionProductos";
import { Documentacion } from "@/components/ui/inicio/Documentacion";
import { useEffect, useState } from "react";

const COMPONENTS_MAP: Record<string, React.FC> = {
  Hero,
  SeccionNoticias,
  SeccionProductos,
  Documentacion,
};

export default function HomePage() {
  const [secciones, setSecciones] = useState<{nombre: string}[]>([]);

  useEffect(() => {
    fetch("/api/inicio/secciones")
      .then(res => res.json())
      .then(data => setSecciones(data.secciones));
  }, []);

  return (
    <>
      {secciones.map(sec => {
        const Component = COMPONENTS_MAP[sec.nombre];
        return Component ? <Component key={sec.nombre} /> : null;
      })}
    </>
  );
}
