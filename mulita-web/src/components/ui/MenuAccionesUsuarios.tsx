"use client";

import { useState, useRef, useEffect } from "react";
import EditRolModal from "./EditRolModal";
import EditPermissionsModal from "./EditPermisosModal";
import Link from "next/link";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  acceso_comunidad: boolean;
}

interface Props {
  user: Usuario;
  onUpdate: () => void;
}

export default function MenuAccionesUsuarios({ user, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<null | "perfil" | "rol" | "permisos">(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer clic afuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDelete = async () => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/usuarios/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Usuario marcado como eliminado.");
      onUpdate();
    } else {
      alert("Error al eliminar usuario.");
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 rounded hover:bg-gray-200"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          <Link
            href={`/perfil/${user.id}`}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Ver perfil
          </Link>
          <button
            onClick={() => {
              setModal("rol");
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Editar rol
          </button>
          <button
            onClick={() => {
              setModal("permisos");
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Editar permisos
          </button>
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Eliminar usuario
          </button>
        </div>
      )}

      {modal === "rol" && (
        <EditRolModal
          user={user}
          onClose={() => setModal(null)}
          onUpdated={onUpdate}
        />
      )}
      {modal === "permisos" && (
        <EditPermissionsModal
          user={user}
          onClose={() => setModal(null)}
          onUpdated={onUpdate}
        />
      )}
    </div>
  );
}
