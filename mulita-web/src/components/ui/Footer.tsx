"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/noticias/crear") ||
    pathname.startsWith("/noticias/editar")
  ) {
    return null;
  }

  return (
    <footer className="mt-24 bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-lg font-bold tracking-tight">MULITA</h3>
          <p className="mt-3 text-white/80 text-sm">
            Un lugar para aprender, compartir y construir. Sé parte de la comunidad.
          </p>
          <Link
            href="/comunidad"
            className="btn btn--yellow mt-4"
          >
            ¡Únete!
          </Link>
        </div>
        <div className="flex flex-col items-start justify-start gap-6">
          <div className="relative leading-[22px] font-semibold">Sobre nosotros</div>
          <div className="flex flex-col items-start justify-start gap-4 text-[#b4b9c9]">
            <Link href="/about-us" className="cursor-pointer">¿Quiénes somos?</Link>
            <Link href="/about-us" className="cursor-pointer">Misión</Link>
            <Link href="/about-us" className="cursor-pointer">Visión</Link>
            <Link href="/about-us" className="cursor-pointer">¿Dónde estamos?</Link>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-6">
          <div className="relative leading-[22px] font-semibold">Enlaces</div>
          <div className="flex flex-col items-start justify-start gap-4 text-[#b4b9c9]">
            <Link href="/" className="cursor-pointer">Inicio</Link>
            <Link href="/news" className="cursor-pointer">Noticias</Link>
            <Link href="/community" className="cursor-pointer">Comunidad</Link>
            <Link href="/store" className="cursor-pointer">Tienda</Link>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-6">
          <div className="relative leading-[22px] font-semibold">Contacto</div>
          <div className="flex flex-col items-start justify-start gap-4 text-[#b4b9c9]">
            <div>Universidad Adventista del Plata</div>
            <div>Libertador San Martin, Entre Rios</div>
            <div>contacto@uap.edu.ar</div>
            <div>+54 9 3435 723461</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
