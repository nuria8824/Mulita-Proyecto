"use client";

import { useState } from "react";
import toast from "react-hot-toast";

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
        toast.success("Comentario enviado");
        setContenido("");
        onNuevoComentario?.();
      } else {
        toast.error("Error al agregar comentario");
      }
    } catch (err) {
      console.error("Error en el envío:", err);
      toast.error("Error al enviar comentario");
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="text"
        placeholder="Escribe un comentario..."
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        onKeyDown={handleKeyDown}
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
