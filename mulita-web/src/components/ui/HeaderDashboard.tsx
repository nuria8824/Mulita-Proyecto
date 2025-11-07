"use client";

import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { Menu } from "lucide-react";
import MenuAccionesHeaderPrincipal from "./MenuAccionesHeaderPrincipal";

export default function HeaderDashboard({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { user } = useUser();

  return (
    <header className="w-full relative bg-white h-[79px] text-gray-600 font-inter text-base shadow flex items-center justify-between px-4">
      {/* Botón hamburguesa solo móvil */}
      <button
        onClick={onMenuClick}
        className="block md:hidden p-2 rounded hover:bg-gray-100"
        aria-label="boton-hamburguesa"      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <b className="text-black text-[15px] leading-[36px]">Dashboard</b>
      </div>

      {/* Barra de navegación derecha */}
      <div className="flex items-center gap-[30px]">
        <div className="flex items-center gap-2">
         <MenuAccionesHeaderPrincipal />
        </div>

        <div className="w-[59px] flex items-center gap-2 overflow-hidden">
          <div className="relative w-6 h-6 flex-shrink-0">
            <Image src="/icons/vector1.svg" alt="" fill />
            <Image src="/icons/vector2.svg" alt="" fill />
            <Image src="/icons/vector3.svg" alt="" fill />
          </div>
          <b className="uppercase tracking-[0.2px]">ES</b>
        </div>
      </div>
    </header>
  );
}
