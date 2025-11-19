"use client";

import { useState } from "react";

export default function ComentarioInput({
  actividadId,
  onNuevoComentario,
}: {
  actividadId: string;
  onNuevoComentario?: () => void;
}) {
  const [contenido, setContenido] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleEnviar = async () => {
    if (!contenido.trim()) return;
    setCargando(true);
    try {
      const res = await fetch("/api/comunidad/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido,
          actividad_id: actividadId,
        }),
      });
      if (res.ok) {
        setContenido("");
        onNuevoComentario?.();
      } else {
        console.error("Error al agregar comentario");
      }
    } catch (err) {
      console.error("Error en el envío:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="text"
        placeholder="Escribe un comentario..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        className="flex-1 border rounded-full px-3 py-1 text-sm"
        disabled={cargando}
      />
      <button
        onClick={handleEnviar}
        disabled={cargando}
        className="text-sm text-blue-600 hover:underline"
      >
        {cargando ? "Enviando..." : "Comentar"}
      </button>
    </div>
  );
}
