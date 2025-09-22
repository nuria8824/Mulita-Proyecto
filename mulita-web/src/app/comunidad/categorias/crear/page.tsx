"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CrearCategoria() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert("Por favor ingresa un nombre para la categoría");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/comunidad/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Categoría "${data.categoria.nombre}" creada correctamente`);
        router.push("/comunidad");
      } else {
        alert(data.error || "Error al crear categoría");
      }
    } catch (error) {
      console.error("Error creando categoría:", error);
      alert("Ocurrió un error al crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 text-[#003c71] font-inter">
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-black">Crear Nueva Categoría</h1>
        <p className="text-lg mt-2">Introduce el nombre de la categoría</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md"
      >
        {/* Nombre de categoría */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Nombre</label>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className={`w-40 h-12 bg-[#003c71] text-white font-medium rounded-md hover:bg-blue-800 transition self-center ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creando..." : "Crear Categoría"}
        </button>
      </form>
    </div>
  );
}
