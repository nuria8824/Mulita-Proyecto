import Link from "next/link";
import Image from "next/image";
import { Noticia } from "@/lib/types";

export function SeccionNoticias() {
  const posts: Noticia[] = [
    {
      id: 1,
      titulo: "¿Qué es Mulita?",
      autor: "Equipo Mulita",
      fecha: new Date("2024-01-15"),
      descripcion:
        "Un robot educativo impreso en 3D para aprender robótica en primaria y secundaria, dentro de una plataforma web con info, comunidad y tienda.",
      introduccion: "Aprendé robótica con Mulita",
      imagen_principal: "/imagenes/noticias/mulita.jpg",
    },
    {
      id: 2,
      titulo: "Comunidad docente",
      autor: "Equipo Mulita",
      fecha: new Date("2024-02-10"),
      descripcion:
        "Registrate para subir actividades, organizar recursos por materias y niveles, comentar y dar “me gusta”. Colaboramos entre escuelas.",
      introduccion: "Participá en la comunidad docente",
      imagen_principal: "/imagenes/noticias/comunidad.jpg",
    },
    {
      id: 3,
      titulo: "Multilenguaje",
      autor: "Equipo Mulita",
      fecha: new Date("2024-03-05"),
      descripcion:
        "La web está pensada para Argentina, Brasil y EE. UU.: disponible en español, portugués e inglés para una comunidad internacional.",
      introduccion: "Mulita en varios idiomas",
      imagen_principal: "/imagenes/noticias/multilenguaje.jpg",
    },
  ];

  return (
    <section className="mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">Noticias</h2>
        <p className="text-center text-muted-foreground mt-2">
          Comunidad, experiencias en escuelas y mejoras de la plataforma.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-light bg-card p-5 hover:shadow-sm transition relative"
            >
              {p.imagen_principal && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={p.imagen_principal}
                    alt={p.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <h3 className="mt-4 text-lg font-extrabold text-primary">{p.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.descripcion}</p>

              <div className="mt-4">
                <Link
                  href={`/noticias/${p.id}`}
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
