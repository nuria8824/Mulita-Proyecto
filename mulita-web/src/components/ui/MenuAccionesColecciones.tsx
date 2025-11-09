"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

type Props = {
  coleccionId: string;
};

export default function MenuAccionesColecciones({ coleccionId }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditar = () => {
    setOpen(false);
    console.log("Editar colección:", coleccionId);
    // Aquí podrías abrir un modal o redirigir
  };

  const handleEliminar = () => {
    setOpen(false);
    console.log("Eliminar colección:", coleccionId);
    // Aquí podrías llamar a fetch(`/api/colecciones/${coleccionId}`, { method: "DELETE" })
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        title="menu acciones colecciones"
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-md z-50">
          <button
            onClick={handleEditar}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl"
          >
            Editar
          </button>
          <button
            onClick={handleEliminar}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
