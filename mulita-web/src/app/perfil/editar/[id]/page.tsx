"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EditarPerfilPage() {
  console.log("Rendering EditarPerfilPage");
  const params = useParams();
  const router = useRouter();

  const [biografia, setBiografia] = useState("");
  const [imagen, setImagen] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar perfil existente
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`/api/perfil/${params.id}`);
        if (!res.ok) throw new Error("Perfil no encontrado");
        const data = await res.json();

        setBiografia(data.perfil.biografia || "");
        setImagen(data.perfil.imagen || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("biografia", biografia);
      if (imagen instanceof File) formData.append("imagen", imagen);

      const res = await fetch(`/api/perfil/${params.id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error actualizando el perfil");

      toast.success("Perfil actualizado exitosamente");
      router.push(`/perfil/${params.id}`);
    } catch (err) {
      console.error("Error en fetch:", err);
      toast.error("Error actualizando el perfil");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => router.push(`/perfil/${params.id}`);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Cargando perfil...
      </div>
    );

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black text-center">Editar Perfil</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div>
            <label className="block text-lg font-semibold mb-2">Biografía</label>
            <textarea
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Contanos algo sobre vos..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Imagen de perfil</label>
            {typeof imagen === "string" && imagen && (
              <img
                src={imagen}
                alt="Imagen actual"
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <input
              type="file"
              placeholder="Imagen de Perfil"
              onChange={(e) => setImagen(e.target.files?.[0] || null)}
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
              {submitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
