"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/queries";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MenuAccionesColecciones from "./MenuAccionesColecciones";
import SkeletonColeccionesUsuario from "./skeletons/SkeletonColeccionesUsuario";

type Coleccion = {
  id: string;
  nombre: string;
  created_at: string;
  usuario_id: string;
};

type ColeccionesUsuarioProps = {
  userPerfilId?: string;
};

export default function ColeccionesUsuario({ userPerfilId }: ColeccionesUsuarioProps) {
  const router = useRouter();
  const { user } = useUser();

  const [colecciones, setColecciones] = useState<Coleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombreTemporal, setNombreTemporal] = useState("");

  // Determinar si el perfil es propio
  const esPropioPerfil = !userPerfilId || userPerfilId === user?.id;

  useEffect(() => {
    const fetchColecciones = async () => {
      try {
        setLoading(true);

        const query = userPerfilId ? `?userId=${userPerfilId}` : "";
        const res = await fetch(`/api/colecciones${query}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al obtener colecciones");
        setColecciones(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchColecciones();
  }, [userPerfilId]);

  const handleEditar = (id: string) => {
    if (!esPropioPerfil) return; // solo permitimos editar en el propio perfil
    const col = colecciones.find((c) => c.id === id);
    if (!col) return;
    setEditandoId(id);
    setNombreTemporal(col.nombre);
  };

  const handleGuardar = async (id: string) => {
    if (!nombreTemporal.trim()) return;
    try {
      const res = await fetch(`/api/colecciones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombreTemporal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar la colección");
      toast.success("Colección actualizada");
      setColecciones((prev) =>
        prev.map((col) => (col.id === id ? { ...col, nombre: data.nombre } : col))
      );
      setEditandoId(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "No se pudo actualizar la colección");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!esPropioPerfil) return; // solo permitir eliminar en el propio perfil
    try {
      const res = await fetch(`/api/colecciones/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar la colección");
      toast.success("Colección eliminada");
      setColecciones((prev) => prev.filter((col) => col.id !== id));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "No se pudo eliminar la colección");
    }
  };

  if (loading) return <SkeletonColeccionesUsuario />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (colecciones.length === 0)
    return <p className="text-center text-gray-400">No hay colecciones para este usuario.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
      {colecciones.map((col) => (
        <div
          key={col.id}
          className="relative flex flex-col items-start justify-between p-6 rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          onClick={() => router.push(`/colecciones/${col.id}`)}
        >
          <div className="flex justify-between items-center w-full text-sm font-semibold text-gray-500 mb-2">
            <span>
              {new Date(col.created_at).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>

            {esPropioPerfil && (
              <MenuAccionesColecciones
                coleccionId={col.id}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            )}
          </div>

          {editandoId === col.id ? (
            <input
              aria-label="nombre coleccion"
              type="text"
              value={nombreTemporal}
              onChange={(e) => setNombreTemporal(e.target.value)}
              onBlur={() => handleGuardar(col.id)}
              onKeyDown={(e) => e.key === "Enter" && handleGuardar(col.id)}
              autoFocus
              className="w-full text-2xl font-semibold text-[#003c71] mt-2 mb-4 border-b-2 border-blue-500 focus:outline-none bg-transparent"
            />
          ) : (
            <h3 className="text-2xl font-semibold text-[#003c71] mt-2 mb-4 text-left">
              {col.nombre}
            </h3>
          )}
        </div>
      ))}
    </div>
  );
}
