"use client";

import { Hero } from "@/components/ui/Hero";
import { InfoGeneral } from "@/components/ui/InfoGeneral";
import { SeccionNoticias } from "@/components/ui/SeccionNoticias";
import { SeccionProductos } from "@/components/ui/SeccionProductos";
import { PreguntasFrecuentes } from "@/components/ui/PreguntasFrecuentes";

export default function HomePage() {

  return (
    <>
      {/* HERO */}
      <Hero />

      {/* BLOQUE INFO - público general */}
      <InfoGeneral />

      {/* NOTICIAS */}
      <SeccionNoticias />

      {/* PRODUCTOS DESTACADOS */}
      <SeccionProductos />

      {/* FAQ breve / CTA final */}
      <PreguntasFrecuentes />
    </>
  );
}
