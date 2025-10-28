"use client";

import { useState, useRef, useEffect } from "react";

type Actividad = {
  id: string;
  usuario_id: string;
};

type AccionesMenuProps = {
  actividad: Actividad;
};

export default function MenuAccionesActividades({ actividad }: AccionesMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(!open);

  const handleAction = (action: string) => {
    if (action === "perfil") {
      window.location.href = `/perfil/${actividad.usuario_id}`;
    } else if (action === "favoritos") {
      console.log("Agregar a favoritos:", actividad.id);
    } else if (action === "coleccion") {
      console.log("Agregar a colección:", actividad.id);
    }
    setOpen(false);
  };

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="text-gray-600 hover:text-gray-900 text-xl leading-none px-2"
      >
        ⋯
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
          <button
            onClick={() => handleAction("perfil")}
            className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
          >
            Ver perfil
          </button>
          <button
            onClick={() => handleAction("favoritos")}
            className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
          >
            Agregar a favoritos
          </button>
          <button
            onClick={() => handleAction("coleccion")}
            className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
          >
            Agregar a colección
          </button>
        </div>
      )}
    </div>
  );
}
