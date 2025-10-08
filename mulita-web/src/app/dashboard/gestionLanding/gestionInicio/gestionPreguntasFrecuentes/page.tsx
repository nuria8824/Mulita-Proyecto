"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GestionPreguntasFrecuentesPage() {
  const router = useRouter();
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/preguntasFrecuentes", {
        method: "POST",
        body: JSON.stringify({ pregunta, respuesta }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        console.log(error);
        alert("Error creando pregunta");
        return;
      }

      router.push("/dashboard/gestionLanding/gestionInicio");
    } catch (err) {
      console.log("Error en fetch:", err);
      alert("Error creando pregunta");
    }
  };

  const handleCancel = () => router.push("/dashboard/gestionLanding/gestionInicio");

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71]">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black text-center">Gestión Preguntas Frecuentes</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div>
            <label className="block text-lg font-semibold mb-2">Pregunta</label>
            <input
              aria-label="pregunta"
              type="text"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Respuesta</label>
            <textarea
              aria-label="respuesta"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 h-28 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
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
