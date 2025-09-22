"use client";

import Link from "next/link";
import Image from "next/image";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md flex-shrink-0">
      <div className="flex flex-col mt-12 px-2 gap-1">
        {/* Foro */}
        <Link href="/comunidad" className="flex items-center gap-1.5 px-4 py-3 rounded-md text-gray-500 hover:bg-gray-100">
          <Image src="/images/foro.svg" width={20} height={20} alt="Foro" />
          <span className="leading-5 font-semibold">Foro</span>
        </Link>

        {/* Buscar */}
        <Link href="/buscar" className="flex items-center gap-1.5 px-4 py-3 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100">
          <Image src="/images/buscar.svg" width={20} height={20} alt="Buscar" />
          <span className="leading-5 font-semibold">Buscar</span>
        </Link>

        {/* Crear */}
        <Link href="/comunidad/actividades/crear" className="flex items-center gap-1.5 px-4 py-3 rounded-md text-gray-500 hover:bg-gray-100">
          <Image src="/images/crear.svg" width={20} height={20} alt="Crear" />
          <span className="leading-5 font-semibold">Crear</span>
        </Link>

        {/* Colecciones */}
        <Link href="/colecciones" className="flex items-center gap-1.5 px-4 py-3 rounded-md text-gray-500 hover:bg-gray-100">
          <Image src="/images/colecciones.svg" width={20} height={20} alt="Colecciones" />
          <span className="leading-5 font-semibold">Colecciones</span>
        </Link>

        {/* Favoritos */}
        <Link href="/favoritos" className="flex items-center gap-1.5 px-4 py-3 rounded-md text-gray-500 hover:bg-gray-100">
          <Image src="/images/favoritos.svg" width={20} height={20} alt="Favoritos" />
          <span className="leading-5 font-semibold">Favoritos</span>
        </Link>

        {/* Configuración */}
        <Link href="/configuracion" className="flex items-center gap-1.5 px-4 py-3 rounded-md text-gray-500 hover:bg-gray-100">
          <Image src="/images/configuracion.svg" width={20} height={20} alt="Configuración" />
          <span className="leading-5 font-semibold">Configuración</span>
        </Link>
      </div>
    </aside>
  );
}
