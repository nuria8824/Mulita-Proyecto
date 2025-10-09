"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_principal: string;
}

export function SeccionNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch("/api/inicio/noticias");
        const data = await res.json();
        setNoticias(data ?? []);
      } catch (err) {
        console.error("Error al obtener noticias destacadas:", err);
      }
    };
    fetchNoticias();
  }, []);

  if (noticias.length === 0) {
    return (
      <section className="mt-24 text-center">
        <p className="text-muted-foreground">No hay noticias destacadas por el momento.</p>
      </section>
    );
  }

  return (
    <section className="mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">Noticias</h2>
        <p className="text-center text-muted-foreground mt-2">
          Comunidad, experiencias en escuelas y mejoras de la plataforma.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((noticia) => (
            <article
              key={noticia.id}
              className="rounded-xl border border-light bg-card p-5 hover:shadow-sm transition relative"
            >
              {noticia.imagen_principal && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <img
                    src={noticia.imagen_principal}
                    alt={noticia.titulo}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
              )}

              <h3 className="mt-4 text-lg font-extrabold text-primary">{noticia.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                {noticia.descripcion}
              </p>

              <div className="mt-4">
                <Link
                  href={`/noticias/${noticia.id}`}
                  className="inline-block text-[#003C71] font-semibold text-sm"
                >
                  Leer más →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/noticias" className="btn btn--blue">
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  );
}
