"use client";

import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 items-center gap-10 pt-16 md:pt-24">
          {/* Texto */}
          <div className="order-2 md:order-1">
            <div className="h-1.5 w-16 bg-secondary rounded-full mb-6" />
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary drop-shadow-[0_4px_0_var(--uap-yellow)]">
              Mulita
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Plataforma web del <strong>Proyecto Mulita</strong>: informate, comprá el kit y
              compartí actividades educativas. Pensado para escuelas de nivel
              <strong> primario y secundario</strong>, con una comunidad que crece día a día. Mulita
              es <strong>marca registrada</strong> y su modelo de robot es <em>Open Source</em>.
            </p>

            <div className="mt-8 flex items-center gap-4">
              {/* Comunidad */}
              <Link href="/comunidad" className="btn btn--blue">
                Comunidad <span aria-hidden>→</span>
              </Link>

              {/* Ver Tienda */}
              <Link href="/tienda" className="btn btn--outline">
                Ver Tienda
              </Link>

            </div>
          </div>

          {/* Imagen */}
          <div className="order-1 md:order-2 relative w-full aspect-[4/3] md:aspect-auto">
            <Image
              alt="Robot Mulita"
              src="/Logo Mulita-13.svg" 
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
