"use client";

import { useEffect, useState } from "react";

interface Pregunta {
  id: number;
  pregunta: string;
  respuesta: string;
}

export function PreguntasFrecuentes() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const res = await fetch("/api/inicio/preguntasFrecuentes");
        const data = await res.json();
        setPreguntas(data ?? []);
      } catch (err) {
        console.error("Error fetching preguntas frecuentes:", err);
      }
    };
    fetchPreguntas();
  }, []);

  return (
    <section className="mt-24 mb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
        {preguntas.map((item) => (
          <div key={item.id} className="rounded-xl border border-light p-6">
            <h3 className="text-lg font-bold">{item.pregunta}</h3>
            <p className="mt-3 text-muted-foreground">{item.respuesta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
