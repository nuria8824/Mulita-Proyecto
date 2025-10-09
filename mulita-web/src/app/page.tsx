"use client";

import { Hero } from "@/components/ui/Hero";
import { SeccionNoticias } from "@/components/ui/SeccionNoticias";
import { SeccionProductos } from "@/components/ui/SeccionProductos";
import { useEffect, useState } from "react";

const COMPONENTS_MAP: Record<string, React.FC> = {
  Hero,
  SeccionNoticias,
  SeccionProductos,
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
