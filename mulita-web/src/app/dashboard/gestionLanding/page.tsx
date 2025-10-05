"use client";

import Image from "next/image";
import Link from "next/link";

export default function GestionLandingPage() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col items-center px-0 pb-10 box-border text-center text-xs text-[#6d758f] font-inter">
      
      {/* Headings */}
      <div className="w-[1103px] h-[86px] flex flex-col items-start text-[36px]">
        <div className="relative leading-10 font-extrabold text-black">
          Gestión de Landing
        </div>
        <div className="w-[14px] h-[14px] relative opacity-0 text-xs"></div>
        <div className="w-[615px] relative text-left text-base leading-6 inline-block">
          Gestión de las diferentes secciones de la página
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-6 w-[1103px] mt-6">

        {/* Card - Inicio */}
        <Link
          href="/dashboard/gestionLanding/gestionInicio"
          className="w-full flex items-center justify-between p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col items-start">
            <div className="text-lg font-semibold text-black">Gestión Inicio</div>
            <div className="text-sm text-[#6d758f]">Configura la página principal</div>
          </div>
          <Image
            src="/images/icons/dashboard/gestionLanding/flecha.svg"
            alt="Ir a gestión inicio"
            width={20}
            height={20}
          />
        </Link>

        {/* Card - Noticias */}
        <Link
          href="/dashboard/gestionLanding/gestionNoticias"
          className="w-full flex items-center justify-between p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col items-start">
            <div className="text-lg font-semibold text-black">Gestión Noticias</div>
            <div className="text-sm text-[#6d758f]">Administra las noticias publicadas</div>
          </div>
          <Image
            src="/images/icons/dashboard/gestionLanding/flecha.svg"
            alt="Ir a gestión noticias"
            width={20}
            height={20}
          />
        </Link>

        {/* Card - Categorías */}
        <Link
          href="/dashboard/gestionLanding/gestionCategorias"
          className="w-full flex items-center justify-between p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col items-start">
            <div className="text-lg font-semibold text-black">Gestión Categorías</div>
            <div className="text-sm text-[#6d758f]">Organiza categorías de productos o noticias</div>
          </div>
          <Image
            src="/images/icons/dashboard/gestionLanding/flecha.svg"
            alt="Ir a gestión categorías"
            width={20}
            height={20}
          />
        </Link>

        {/* Card - Productos */}
        <Link
          href="/dashboard/gestionLanding/gestionProductos"
          className="w-full flex items-center justify-between p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col items-start">
            <div className="text-lg font-semibold text-black">Gestión Productos</div>
            <div className="text-sm text-[#6d758f]">Controla y edita los productos</div>
          </div>
          <Image
            src="/images/icons/dashboard/gestionLanding/flecha.svg"
            alt="Ir a gestión productos"
            width={20}
            height={20}
          />
        </Link>

        {/* Card - Sobre Nosotros */}
        <Link
          href="/dashboard/gestionLanding/gestionSobreNosotros"
          className="w-full flex items-center justify-between p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col items-start">
            <div className="text-lg font-semibold text-black">Gestión Sobre Nosotros</div>
            <div className="text-sm text-[#6d758f]">Edita la información de la empresa</div>
          </div>
          <Image
            src="/images/icons/dashboard/gestionLanding/flecha.svg"
            alt="Ir a gestión sobre nosotros"
            width={20}
            height={20}
          />
        </Link>

      </div>
    </div>
  );
}
