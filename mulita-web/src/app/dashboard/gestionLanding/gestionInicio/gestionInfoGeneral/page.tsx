"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GestionInfoGeneralPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    if (imagen) formData.append("imagen", imagen);

    try {
      const res = await fetch("/api/infoGeneral", {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        console.log(error);
        alert("Error actualizando Información General");
        return;
      }

      router.push("/dashboard/gestionLanding/gestionInicio");
    } catch (err) {
      console.log("Error en fetch:", err);
      alert("Error actualizando Información General");
    }
  };

  const handleCancel = () => router.push("/dashboard/gestionLanding/gestionInicio");

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black text-center">Gestión Información General</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div>
            <label className="block text-lg font-semibold mb-2">Título</label>
            <input
              aria-label="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Descripción</label>
            <textarea
              aria-label="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Imagen</label>
            <label className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition">
              <span className="text-gray-500">Sube una imagen (opcional)</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
                accept="image/*"
              />
            </label>
            {imagen && <p className="text-sm text-gray-600 mt-1">Archivo seleccionado: {imagen.name}</p>}
          </div>

          <div className="flex w-full gap-4">
            <button type="button" onClick={handleCancel} className="w-1/2 h-12 bg-gray-300 text-[#003c71] font-semibold rounded-md shadow-md hover:bg-gray-400 transition">
              Cancelar
            </button>
            <button type="submit" className="w-1/2 h-12 bg-[#003c71] text-white font-semibold rounded-md shadow-md hover:bg-[#00264d] transition">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
