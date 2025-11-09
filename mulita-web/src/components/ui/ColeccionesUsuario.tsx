import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuAccionesColecciones from "./MenuAccionesColecciones";

type Coleccion = {
  id: string;
  nombre: string;
  created_at: string;
};

export default function ColeccionesUsuario() {
  const router = useRouter();
  const [colecciones, setColecciones] = useState<Coleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombreTemporal, setNombreTemporal] = useState("");

  useEffect(() => {
    const fetchColecciones = async () => {
      try {
        const res = await fetch("/api/colecciones");
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
  }, []);

  const handleEditar = (id: string) => {
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
      setColecciones((prev) =>
        prev.map((col) => (col.id === id ? { ...col, nombre: data.nombre } : col))
      );
      setEditandoId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      const res = await fetch(`/api/colecciones/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar la colección");
      setColecciones((prev) => prev.filter((col) => col.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("No se pudo eliminar la colección: " + err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando colecciones...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (colecciones.length === 0)
    return <p className="text-center text-gray-400">No tenés colecciones todavía.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
      {colecciones.map((col) => (
        <div
          key={col.id}
          className="relative flex flex-col items-start justify-between p-6 rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          onClick={() => router.push(`/colecciones/${col.id}`)} // 🔹 Navegación a detalle
        >
          <div className="flex justify-between items-center w-full text-sm font-semibold text-gray-500 mb-2">
            <span>
              {new Date(col.created_at).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <MenuAccionesColecciones
              coleccionId={col.id}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
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
