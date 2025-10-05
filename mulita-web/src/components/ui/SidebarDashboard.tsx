"use client";

import Link from "next/link";
import Image from "next/image";

export default function SidebarDashboard() {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#003c71] text-white shadow-md border-r border-gray-200">
      {/* Logo + título */}
      <div className="h-20 flex items-center justify-center bg-[#003c71]">
        <div className="bg-white rounded-md p-2">
          <Image src="/images/logosMulita/logo Mulita-12.svg" width={160} height={60} alt="Logo Mulita" />
        </div>
        {/* <p className="text-2xl font-extrabold text-white">Mulita</p> */}
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 p-3 text-sm">
        {/* Landing */}
        <Link
          href="/"
          className="rounded-md bg-[#003c71] hover:bg-[#002a50] px-4 py-3 flex items-center gap-2"
        >
          <Image src="/images/icons/dashboard/landing.svg" width={20} height={20} alt="Landing" />
          <span>Landing</span>
        </Link>

        {/* Dashboard destacado */}
        <Link
          href="/dashboard"
          className="rounded-md bg-[#fedd00] text-[#003c71] px-4 py-3 flex items-center gap-2 font-bold"
        >
          <Image src="/images/icons/dashboard/dashboard.svg" width={20} height={20} alt="Dashboard" />
          <span>Dashboard</span>
        </Link>

        {/* Gestión de Landing */}
        <Link
          href="/dashboard/gestionLanding"
          className="rounded-md bg-[#003c71] hover:bg-[#002a50] px-4 py-3 flex items-center gap-2"
        >
          <Image src="/images/icons/dashboard/gestion landing.svg" width={17} height={17} alt="Gestión de Landing" />
          <span>Gestión de Landing</span>
        </Link>

        {/* Usuarios */}
        <Link
          href="/dashboard/usuarios"
          className="rounded-md bg-[#003c71] hover:bg-[#002a50] px-4 py-3 flex items-center gap-2"
        >
          <Image src="/images/icons/dashboard/usuarios.svg" width={20} height={20} alt="Usuarios" />
          <span>Usuarios</span>
        </Link>

        {/* Configuración */}
        <Link
          href="/dashboard/configuracion"
          className="rounded-md bg-[#003c71] hover:bg-[#002a50] px-4 py-3 flex items-center gap-2"
        >
          <Image src="/images/icons/dashboard/configuracion.svg" width={20} height={20} alt="Configuración" />
          <span>Configuración</span>
        </Link>
      </nav>
    </aside>
  );
}
