"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    if (!confirm("¿Seguro que deseas eliminar esta actividad?")) return;

    try {
      const res = await fetch(`/api/actividades/${actividad.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error eliminando la actividad");

      // Opcional: actualizar UI localmente
      console.log("Actividad eliminada correctamente:", actividad.id);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert("No se pudo eliminar la actividad");
    }
  };

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
          <Link
            href={`/perfil/${actividad.usuario_id}`}
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
          >
            Ver perfil
          </Link>

          <Link
            href={`#favoritos`}
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
          >
            Agregar a favoritos
          </Link>

          <Link
            href={`#coleccion`}
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
          >
            Agregar a colección
          </Link>

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
                onClick={handleEliminar}
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
                onClick={handleEliminar}
                className="px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
              >
                Eliminar
              </button>
            </>
          )}      
        </div>
      )}
    </div>
  );
}
