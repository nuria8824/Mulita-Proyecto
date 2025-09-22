"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Categoria {
  id: number;
  nombre: string;
}

export default function CrearActividad() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | "">("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/comunidad/categorias");
        if (!res.ok) throw new Error("Error al cargar categorías");
        const data = await res.json();
        if (data.categorias) setCategorias(data.categorias);
      } catch (error) {
        console.error("Error cargando categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!titulo || !descripcion || !categoriaSeleccionada) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      if (archivo) formData.append("archivo", archivo);
      formData.append("categoriaId", JSON.stringify(categoriaSeleccionada));

      const res = await fetch("/api/comunidad/actividades", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        router.push("/comunidad");
      }
    } catch (error) {
      console.error("Error al crear actividad:", error);
      alert("Hubo un error al crear la actividad.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 text-[#003c71] font-inter">
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-black">Crear Nueva Actividad</h1>
        <p className="text-lg mt-2">Introduce los datos</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md"
      >
        {/* Título */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Título</label>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-2 relative">
          <label className="font-semibold text-lg">Asignar categoría</label>
          <select
           aria-label="Categoría"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
            className="w-full h-12 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Descripción</label>
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Archivos */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-lg">Archivos</label>
          <label className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition">
            <span className="text-gray-500">Sube archivos desde tu dispositivo</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            />
          </label>
          {archivo && <p className="text-sm text-gray-600 mt-1">Archivo seleccionado: {archivo.name}</p>}
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-40 h-12 bg-[#003c71] text-white font-medium rounded-md hover:bg-blue-800 transition self-center"
        >
          Crear Actividad
        </button>
      </form>
    </div>
  );
}
