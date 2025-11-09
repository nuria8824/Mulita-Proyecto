"use client";

import { useState } from "react";
import { SidebarComunidad } from "@/components/ui/SidebarComunidad";
import Actividades from "../../components/ui/Actividades"

export default function Comunidad() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <SidebarComunidad isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Contenedor principal con un único scroll */}
      <main className="flex-1 overflow-auto p-6 ml-0 md:ml-60">
        {/* Botón para abrir sidebar en mobile */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden mb-4 px-4 py-2 rounded-md bg-[#003c71] text-white font-semibold shadow-sm hover:bg-[#002a50] active:bg-[#001c36] transition-colors duration-200"
        >
          ☰ Menú
        </button>

        <Actividades />
      </main>
    </div>
  );
}
