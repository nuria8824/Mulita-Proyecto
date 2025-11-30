"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import ModalColecciones from "./ModalColecciones";

type Actividad = {
  id: string;
  usuario_id: string;
};

type AccionesMenuProps = {
  actividad: Actividad;
  userId: string;
  rol: string;
};

export default function MenuAccionesActividades({ actividad, userId, rol }: AccionesMenuProps) {
  const [open, setOpen] = useState(false);
  const [modalColeccionesOpen, setModalColeccionesOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const esAutor = actividad.usuario_id === userId;
  const esAdmin = rol === "admin" || rol === "superAdmin";

  const toggleMenu = () => setOpen((prev) => !prev);

  // Cerrar menú al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEliminar = async () => {
    try {
      const res = await fetch(`/api/comunidad/actividades/${actividad.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error eliminando la actividad");

      toast.success("Actividad eliminada correctamente");
      setOpen(false);
      setShowConfirmDelete(false);
      router.push("/comunidad");
    } catch (err: any) {
      console.error(err);
      toast.error("No se pudo eliminar la actividad");
    }
  };

  const handleAbrirModalColecciones = () => {
    setOpen(false);
    setModalColeccionesOpen(true);
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Eliminar actividad"
        message="¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={handleEliminar}
      />
      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="text-gray-600 hover:text-gray-900 text-xl leading-none px-2"
        >
          ⋯
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
            <Link
              href={`/perfil/${actividad.usuario_id}`}
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
            >
              Ver perfil
            </Link>

            <button
              onClick={handleAbrirModalColecciones}
              className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
            >
              Agregar a colección
            </button>

            {esAutor && (
              <>
                <hr className="my-1 border-gray-200" />
                <Link
                  href={`/comunidad/actividades/editar/${actividad.id}`}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-left hover:bg-gray-100 text-sm text-blue-600"
                >
                  Editar
                </Link>

                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
                >
                  Eliminar
                </button>
              </>
            )}

            {esAdmin && !esAutor && (
              <>
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal Colecciones */}
      {modalColeccionesOpen && (
        <ModalColecciones
          isOpen={modalColeccionesOpen}
          onClose={() => setModalColeccionesOpen(false)}
          actividadId={actividad.id}
        />
      )}
    </>
  );
}
