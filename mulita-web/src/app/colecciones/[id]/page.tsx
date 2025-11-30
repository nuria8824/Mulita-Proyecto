"use client";

import { useEffect, useState, useCallback } from "react";
import MenuAccionesActividades from "@/components/ui//comunidad/MenuAccionesActividades";
import ModalImagenActividades from "@/components/ui/comunidad/ModalImagenActividades";
import ComentarioInput from "@/components/ui/comunidad/ComentarioInput";
import ComentariosModal from "@/components/ui/comunidad/ComentariosModal";
import ModalColecciones from "@/components/ui/comunidad/ModalColecciones";
import { useUser } from "@/hooks/queries";
import { useParams } from "next/navigation";
import BackButton from "@/components/ui/dashboard/BackButton";
import SkeletonColeccionDetalle from "@/components/ui/perfil/skeletons/SkeletonColeccionDetalle";

type Archivo = { archivo_url: string; tipo: string; nombre: string };
type Categoria = { categoria: { nombre: string } };
type Perfil = { imagen?: string };
type Usuario = { id: string; nombre: string; apellido: string; perfil: Perfil };
type Actividad = {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  created_at: string;
  usuario_id: string;
  usuario: Usuario;
  actividad_archivos?: Archivo[];
  actividad_categoria?: Categoria[];
};

export default function ColeccionDetallePage() {
  const { id } = useParams();
  if (!id) return null;

  const { user } = useUser();
  const [nombreColeccion, setNombreColeccion] = useState("");
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]); // ✅ nuevo estado
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagenes, setImagenes] = useState<Archivo[]>([]);

  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
  const [modalColeccionesOpen, setModalColeccionesOpen] = useState(false);
  const [actividadParaColeccion, setActividadParaColeccion] = useState<string | null>(null);
  const [comentariosPorActividad, setComentariosPorActividad] = useState<Record<string, number>>({});

  // traer comentarios
  const fetchComentariosCount = async (actividadId: string) => {
    try {
      const res = await fetch(`/api/comunidad/comentarios/${actividadId}`);
      if (!res.ok) throw new Error("Error al obtener comentarios");
      const data = await res.json();
      return data.length;
    } catch (err) {
      console.error(err);
      return 0;
    }
  };

  const actualizarComentarios = (actividadId: string, nuevoCount: number) => {
    setComentariosPorActividad((prev) => ({ ...prev, [actividadId]: nuevoCount }));
  };

  // obtener colección con actividades
  useEffect(() => {
    const fetchColeccion = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/colecciones/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al obtener la colección");

        setNombreColeccion(data.nombre || "");
        const acts: Actividad[] = data.actividades || [];
        setActividades(acts);
        console.log("actividades", acts);

        const counts: Record<string, number> = {};
        await Promise.all(
          acts.map(async (act) => {
            counts[act.id] = await fetchComentariosCount(act.id);
          })
        );
        setComentariosPorActividad(counts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchColeccion();
  }, [id]);

  // obtener favoritos (likes del usuario)
  const fetchFavoritos = useCallback(async () => {
    try {
      const res = await fetch("/api/colecciones/favoritos");
      if (!res.ok) return;
      const data = await res.json();
      const favIds = data.map((f: { actividad_id: string }) => f.actividad_id);
      setFavoritos(favIds);
    } catch (err) {
      console.error("Error al cargar favoritos", err);
    }
  }, []);

  useEffect(() => {
    fetchFavoritos();
  }, [fetchFavoritos]);

  // alternar like
  const toggleLike = async (actividadId: string) => {
    try {
      const res = await fetch(`/api/comunidad/actividades/${actividadId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error al actualizar like");

      setFavoritos((prev) =>
        prev.includes(actividadId)
          ? prev.filter((id) => id !== actividadId)
          : [...prev, actividadId]
      );
    } catch (err) {
      console.error("Error al dar like:", err);
    }
  };

  const toggleExpand = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleModal = (imagenes: Archivo[], index: number) => {
    setImagenes(imagenes);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  if (loading)
    return <SkeletonColeccionDetalle />;
  if (error) 
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <p className="text-center text-red-500 mt-4">{error}</p>
      </div>
    );
  if (actividades.length === 0)
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="mb-4">
          <BackButton />
        </div>
        <p className="text-center text-gray-400 mt-4">No hay actividades en esta colección.</p>
      </div>
    );

  if (!user)
    return (
      <div className="text-center text-gray-600 mt-10">
        Debes iniciar sesión para ver las actividades.
      </div>
    );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex mb-4 gap-8">
        <BackButton />

        <h2 className="text-2xl font-semibold text-[#003c71] mb-4">
          {`Actividades de "${nombreColeccion}"`}
        </h2>
      </div>
      
      <div className="flex flex-col gap-8">
        {actividades.map((act) => {
          const imagenesAct = act.actividad_archivos?.filter((a) => a.tipo.startsWith("image/")) || [];
          const otrosArchivos = act.actividad_archivos?.filter((a) => !a.tipo.startsWith("image/")) || [];
          const categorias = act.actividad_categoria?.map((c) => c.categoria.nombre);
          const isFav = favoritos.includes(act.id);

          return (
            <div
              key={act.id}
              className="w-full bg-white rounded-2xl shadow border border-gray-200 p-5 flex flex-col gap-4"
            >
              {/* CABECERA */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={act.usuario.perfil.imagen || "/images/icons/perfil/default-avatar.svg"}
                      alt="Perfil"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {act.usuario?.nombre} {act.usuario?.apellido}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(act.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {categorias?.map((cat, i) => (
                    <span
                      key={i}
                      className="shadow border border-[#f1f3f7] bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700"
                    >
                      {cat}
                    </span>
                  ))}
                  <MenuAccionesActividades
                    actividad={{ id: act.id, usuario_id: act.usuario.id }}
                    userId={user.id}
                    rol={user.rol}
                  />
                </div>
              </div>

              {/* TÍTULO */}
              <h3 className="text-lg font-bold text-[#003c71] -mb-2">{act.titulo}</h3>

              {/* DESCRIPCIÓN */}
              {act.descripcion && (
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {expanded[act.id]
                    ? act.descripcion
                    : act.descripcion.length > 200
                    ? act.descripcion.slice(0, 200) + "..."
                    : act.descripcion}
                  {act.descripcion.length > 200 && (
                    <button
                      onClick={() => toggleExpand(act.id)}
                      className="text-[#003c71] ml-2 font-semibold hover:underline"
                    >
                      {expanded[act.id] ? "Ver menos" : "Ver más"}
                    </button>
                  )}
                </div>
              )}

              {/* ARCHIVOS */}
              {otrosArchivos.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  {otrosArchivos.map((a, i) => (
                    <a
                      key={i}
                      href={a.archivo_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                    >
                      📎 Descargar archivo: {a.nombre}
                    </a>
                  ))}
                </div>
              )}

              {/* GALERÍA */}
              {imagenesAct.length > 0 && (
                <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                  {imagenesAct.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => toggleModal(imagenesAct, i)}
                      className="w-full aspect-square overflow-hidden rounded-md"
                    >
                      <img src={img.archivo_url} alt={`Imagen ${i + 1}`} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}

              {/* BOTONES */}
              <div className="flex items-center gap-4 text-gray-600 pt-3 border-t border-gray-200 text-sm">
                {/* Me gusta */}
                <button
                  onClick={() => toggleLike(act.id)}
                  className="hover:opacity-75 transition"
                >
                  <img
                    src={
                      isFav
                        ? "/images/icons/comunidad/favoritos-fill.svg"
                        : "/images/icons/comunidad/favoritos.svg"
                    }
                    alt="Me gusta"
                    className="w-6 h-6"
                  />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    className="hover:opacity-75 transition"
                    onClick={() => setActividadSeleccionada(act)}
                  >
                    <img
                      src="/images/icons/comunidad/comentarios.svg"
                      alt="Comentarios"
                      className="w-6 h-6"
                    />
                  </button>
                  <span className="text-sm text-gray-700 font-semibold">
                    {comentariosPorActividad[act.id] ?? 0}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setActividadParaColeccion(act.id);
                    setModalColeccionesOpen(true);
                  }}
                  className="hover:opacity-75 transition"
                >
                  <img
                    src="/images/icons/comunidad/colecciones.svg"
                    alt="Guardar"
                    className="w-6 h-6"
                  />
                </button>
              </div>

              <ComentarioInput
                actividadId={act.id}
                onNuevoComentario={async () => {
                  const count = await fetchComentariosCount(act.id);
                  actualizarComentarios(act.id, count);
                }}
              />
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <ModalImagenActividades
          images={imagenes.map((img) => img.archivo_url)}
          initialIndex={currentIndex}
          onClose={() => setModalOpen(false)}
        />
      )}

      {actividadSeleccionada && (
        <ComentariosModal
          actividad={actividadSeleccionada}
          onClose={() => setActividadSeleccionada(null)}
          onActualizarComentarios={async () => {
            const count = await fetchComentariosCount(actividadSeleccionada.id);
            actualizarComentarios(actividadSeleccionada.id, count);
          }}
        />
      )}

      {actividadParaColeccion && (
        <ModalColecciones
          isOpen={modalColeccionesOpen}
          onClose={() => {
            setModalColeccionesOpen(false);
            setActividadParaColeccion(null);
          }}
          actividadId={actividadParaColeccion}
        />
      )}
    </div>
  );
}
