"use client";

import { HeroSobreNosotros } from "@/components/ui/HeroSobreNosotros";
import { QuienesSomos } from "@/components/ui/QuienesSomos";
import { MisionVision } from "@/components/ui/MisionVision";
import { DondeEstamos } from "@/components/ui/DondeEstamos";
import { useEffect, useState } from "react";

const COMPONENTS_MAP: Record<string, React.FC> = {
  HeroSobreNosotros,
  QuienesSomos,
  MisionVision,
  DondeEstamos,
};

export default function SobreNosotrosPage() {
  const [secciones, setSecciones] = useState<{nombre: string}[]>([]);

  useEffect(() => {
    fetch("/api/sobreNosotros/secciones")
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
