"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
  coleccionId: string;
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
};

export default function MenuAccionesColecciones({ coleccionId, onEditar, onEliminar }: Props) {
  const [open, setOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    onEditar(coleccionId);
  };

  const handleEliminarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    await onEliminar(coleccionId);
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMenu();
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Eliminar colección"
        message="¿Estás seguro de que deseas eliminar esta colección? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
      />
      <div className="relative" ref={menuRef}>
      <button
        title="menu acciones colecciones"
        onClick={handleToggleMenu}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-md z-50">
          <button
            onClick={handleEditarClick}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl"
          >
            Editar
          </button>
          <button
            onClick={handleEliminarClick}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
          >
            Eliminar
          </button>
        </div>
        )}
      </div>
    </>
  );
}