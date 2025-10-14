"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GestionMisionVisionPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen1, setImagen1] = useState<File | string | null>(null);
  const [imagen2, setImagen2] = useState<File | string | null>(null);
  const [imagen3, setImagen3] = useState<File | string | null>(null);
  const [imagen4, setImagen4] = useState<File | string | null>(null);
  const [imagen5, setImagen5] = useState<File | string | null>(null);
  const [imagen6, setImagen6] = useState<File | string | null>(null);


  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Obtener datos actuales
  useEffect(() => {
    const fetchDondeEstamos = async () => {
      try {
        const res = await fetch("/api/sobreNosotros/dondeEstamos");
        if (!res.ok) throw new Error("No se pudo obtener la información");
        const data = await res.json();

        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setImagen1(data.imagen1);
        setImagen2(data.imagen2);
        setImagen3(data.imagen3);
        setImagen4(data.imagen4);
        setImagen5(data.imagen5);
        setImagen6(data.imagen6);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDondeEstamos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);


      if (imagen1 instanceof File) formData.append("imagen1", imagen1);
      if (imagen2 instanceof File) formData.append("imagen2", imagen2);
      if (imagen3 instanceof File) formData.append("imagen3", imagen3);
      if (imagen4 instanceof File) formData.append("imagen4", imagen4);
      if (imagen5 instanceof File) formData.append("imagen5", imagen5);
      if (imagen6 instanceof File) formData.append("imagen6", imagen6);

      const res = await fetch("/api/sobreNosotros/dondeEstamos", {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al actualizar el contenido");

      router.push("/dashboard/gestionLanding/gestionSobreNosotros");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar Donde Estamos");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => router.push("/dashboard/gestionLanding/gestionSobreNosotros");

  if (loading) return <p className="text-center mt-10">Cargando datos...</p>;

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black text-center">Gestión - ¿Dónde Estamos?</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div>
            <label className="block text-lg font-semibold mb-2">Título</label>
            <input
             aria-label="Título"
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
              aria-label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Imagen 1</label>
            {typeof imagen1 === "string" && (
              <img src={imagen1} alt="Imagen actual" className="w-full h-48 object-cover rounded" />
            )}
            <input
              aria-label="Imagen Principal"
              type="file"
              onChange={(e) => setImagen1(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-gray-600"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Imagen 2</label>
            {typeof imagen2 === "string" && (
              <img src={imagen2} alt="Imagen actual" className="w-full h-48 object-cover rounded" />
            )}
            <input
              aria-label="Imagen Principal"
              type="file"
              onChange={(e) => setImagen2(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-gray-600"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Imagen 3</label>
            {typeof imagen3 === "string" && (
              <img src={imagen3} alt="Imagen actual" className="w-full h-48 object-cover rounded" />
            )}
            <input
              aria-label="Imagen Principal"
              type="file"
              onChange={(e) => setImagen3(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-gray-600"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Imagen 4</label>
            {typeof imagen4 === "string" && (
              <img src={imagen4} alt="Imagen actual" className="w-full h-48 object-cover rounded" />
            )}
            <input
              aria-label="Imagen Principal"
              type="file"
              onChange={(e) => setImagen4(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-gray-600"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Imagen 5</label>
            {typeof imagen5 === "string" && (
              <img src={imagen5} alt="Imagen actual" className="w-full h-48 object-cover rounded" />
            )}
            <input
              aria-label="Imagen Principal"
              type="file"
              onChange={(e) => setImagen5(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-gray-600"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Imagen 6</label>
            {typeof imagen6 === "string" && (
              <img src={imagen6} alt="Imagen actual" className="w-full h-48 object-cover rounded" />
            )}
            <input
              aria-label="Imagen Principal"
              type="file"
              onChange={(e) => setImagen6(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 cursor-pointer text-gray-600"
              accept="image/*"
            />
          </div>

          <div className="flex w-full gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/2 h-12 bg-gray-300 text-[#003c71] font-semibold rounded-md shadow-md hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 h-12 bg-[#003c71] text-white font-semibold rounded-md shadow-md hover:bg-[#00264d] transition"
            >
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
