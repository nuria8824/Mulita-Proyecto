"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

interface Categoria {
  id: string;
  nombre: string;
}

export default function GestionCategoriasPage() {
  const { user, loading: userLoading } = useUser();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [nombre, setNombre] = useState("");

  // Traer categorías desde la API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/categorias");
        const data = await res.json();
        setCategorias((data ?? []).reverse());
      } catch (err) {
        console.error("Error fetching categorias:", err);
      } finally {
        setLoadingCategorias(false);
      }
    };
    fetchCategorias();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error("Error al crear categoría");
      const nueva = await res.json();
      setCategorias((prev) => [nueva, ...prev]);
      setNombre("");
    } catch (err) {
      console.error("Error creando categoría:", err);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      const res = await fetch(`/api/categorias`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Error al eliminar categoría");
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error eliminando categoría:", err);
    }
  };

  if (userLoading || loadingCategorias) {
    return <p className="text-center mt-10">Cargando categorías...</p>;
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex flex-col items-center px-4 sm:px-6 pb-10 box-border font-inter">
      {/* Header + botón agregar */}
      <div className="w-full max-w-[1103px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <div className="flex flex-col text-[28px] sm:text-[32px] md:text-[36px]">
          <h1 className="leading-tight font-extrabold text-black">
            Gestión de Categorías
          </h1>
          <p className="mt-2 text-left text-sm sm:text-base leading-6 text-[#6d758f]">
            Crea nuevas categorías o administra las existentes.
          </p>
        </div>

        {(user?.rol === "admin" || user?.rol === "superAdmin") && (
          <form
            onSubmit={handleCrear}
            className="flex gap-2 shadow-md rounded-md bg-[#f8faff] border border-[#e0e0e0] p-2"
          >
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la categoría"
              className="px-2 py-1 border border-[#ccc] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            >
              + Agregar
            </button>
          </form>
        )}
      </div>

      {/* Lista de categorías */}
      <div className="flex-1 w-full max-w-[1100px] mt-6 flex flex-col gap-4">
        {categorias.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No hay categorías disponibles.
          </p>
        ) : (
          categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="text-base sm:text-lg font-semibold text-black break-words">
                {categoria.nombre}
              </div>

              {(user?.rol === "admin" || user?.rol === "superAdmin") && (
                <button
                  onClick={() => handleEliminar(categoria.id)}
                  className="self-end sm:self-auto bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
