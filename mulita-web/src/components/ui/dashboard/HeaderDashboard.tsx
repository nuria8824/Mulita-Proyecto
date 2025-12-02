"use client";

import Image from "next/image";
import { useUser } from "@/hooks/queries";
import { Menu } from "lucide-react";
import MenuAccionesHeaderPrincipal from "../MenuAccionesHeaderPrincipal";
import UserRoleBadge from "./UserRoleBadge";

export default function HeaderDashboard({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { user } = useUser();

  return (
    <header className="w-full relative bg-white h-auto md:h-[79px] text-gray-600 font-inter text-base shadow flex flex-col md:flex-row items-center justify-between px-4 py-3 md:py-0">
      {/* Primera fila: Hamburguesa y Logo */}
      <div className="flex items-center justify-between w-full md:w-auto gap-3">
        {/* Botón hamburguesa solo móvil */}
        <button
          onClick={onMenuClick}
          className="block md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="boton-hamburguesa"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <b className="text-black text-[15px] leading-[36px]">Dashboard</b>
        </div>
      </div>

      {/* Segunda fila: Rol y Menú de acciones */}
      <div className="flex items-center gap-[30px] w-full md:w-auto mt-3 md:mt-0 justify-between md:justify-end">
        {/* Badge de rol */}
        <div className="hidden lg:block">
          <UserRoleBadge />
        </div>

        {/* Menú de acciones */}
        <div className="flex items-center gap-2">
          <MenuAccionesHeaderPrincipal />
        </div>
      </div>

      {/* Badge en móvil - debajo del todo */}
      <div className="block lg:hidden w-full mt-3">
        <UserRoleBadge />
      </div>
    </header>
  );
}
