"use client";

import { useEffect, useState, useCallback, useMemo, act } from "react";
import toast from "react-hot-toast";
import MenuAccionesActividades from "./MenuAccionesActividades";
import ModalImagenActividades from "@/components/ui/comunidad/ModalImagenActividades";
import ComentarioInput from "@/components/ui/comunidad/ComentarioInput";
import ComentariosModal from "@/components/ui/comunidad/ComentariosModal";
import { FiltroCategoria, FiltroFecha } from "@/components/ui/comunidad/Filtros";
import ModalColecciones from "@/components/ui/comunidad/ModalColecciones";
import { useUser } from "@/hooks/queries";
import SkeletonActividades from "./skeletons/SkeletonActividades";

type Archivo = { archivo_url: string; tipo: string; nombre: string };
type Categoria = { categoria: { nombre: string } };
type Perfil = { imagen?: string };
type Usuario = { id: string; nombre: string; apellido: string; perfil: Perfil };
type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  usuario_id: string;
  usuario: Usuario;
  actividad_archivos: Archivo[];
  actividad_categoria: Categoria[];
};

export default function Actividades() {
  const { user } = useUser();

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loadingInicial, setLoadingInicial] = useState(false);
  const [loadingVerMas, setLoadingVerMas] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagenes, setImagenes] = useState<Archivo[]>([]);

  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
  const [modalColeccionesOpen, setModalColeccionesOpen] = useState(false);
  const [actividadParaColeccion, setActividadParaColeccion] = useState<string | null>(null);

  const [comentariosPorActividad, setComentariosPorActividad] = useState<Record<string, number>>({});
  const [likesPorActividad, setLikesPorActividad] = useState<Record<string, number>>({});
  const [ultimoComentario, setUltimoComentario] = useState<Record<string, any>>({});
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 5;

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");

  // Debounce búsqueda
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

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

  const fetchLikesCount = async (actividadId: string) => {
    try {
      const res = await fetch(`/api/comunidad/actividades/${actividadId}/likes`);
      if (!res.ok) throw new Error("Error al obtener likes");
      const data = await res.json();
      return data.count || 0;
    } catch (err) {
      console.error(err);
      return 0;
    }
  };

  const fetchUltimoComentario = async (actividadId: string) => {
    try {
      const res = await fetch(`/api/comunidad/comentarios/${actividadId}`);
      if (!res.ok) throw new Error("Error al obtener comentarios");
      const data = await res.json();
      if (data.length > 0) {
        setUltimoComentario((prev) => ({
          ...prev,
          [actividadId]: data[data.length - 1],
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const actualizarComentarios = (actividadId: string, nuevoCount: number) => {
    setComentariosPorActividad((prev) => ({ ...prev, [actividadId]: nuevoCount }));
  };

  const actualizarLikes = (actividadId: string, nuevoCount: number) => {
    setLikesPorActividad((prev) => ({ ...prev, [actividadId]: nuevoCount }));
  };

  // Fetch actividades
  const fetchActividades = useCallback(
    async (newOffset = 0, searchTerm = "", categorias: string[] = [], fecha = "") => {
      try {
        if (newOffset === 0) {
          setLoadingInicial(true);
        } else {
          setLoadingVerMas(true);
        }

        let url = `/api/comunidad/actividades?offset=${newOffset}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`;
        if (categorias.length > 0) {
          categorias.forEach(cat => {
            url += `&categoria=${encodeURIComponent(cat)}`;
          });
        }
        if (fecha) url += `&fecha=${encodeURIComponent(fecha)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener las actividades");
        const data: Actividad[] = await res.json();

        if (newOffset === 0) setActividades(data);
        else setActividades((prev) => [...prev, ...data]);

        setHasMore(data.length === limit);

        const counts: Record<string, number> = {};
        const likeCounts: Record<string, number> = {};
        await Promise.all(
          data.map(async (act) => {
            counts[act.id] = await fetchComentariosCount(act.id);
            likeCounts[act.id] = await fetchLikesCount(act.id);
            await fetchUltimoComentario(act.id);
          })
        );
        setComentariosPorActividad((prev) => ({ ...prev, ...counts }));
        setLikesPorActividad((prev) => ({ ...prev, ...likeCounts }));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingInicial(false);
        setLoadingVerMas(false);
      }
    },
    []
  );

  // Obtener actividades favoritas del usuario
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
    setOffset(0);
    fetchActividades(0, debouncedSearch, categoriasSeleccionadas, fechaSeleccionada);
    fetchFavoritos();
  }, [debouncedSearch, categoriasSeleccionadas, fechaSeleccionada, fetchActividades, fetchFavoritos]);

  const handleVerMas = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchActividades(newOffset, debouncedSearch, categoriasSeleccionadas, fechaSeleccionada);
  };

  // Alternar like (añadir o quitar de favoritos) - Optimistic Update
  const toggleLike = (actividadId: string) => {
    // Guardar estado anterior en caso de necesitar revertir
    const isFav = favoritos.includes(actividadId);
    const estadoAnterior = favoritos;
    const likesAnteriores = likesPorActividad[actividadId] || 0;

    // Actualizar estado INMEDIATAMENTE (optimistic update)
    setFavoritos((prev) =>
      prev.includes(actividadId)
        ? prev.filter((id) => id !== actividadId)
        : [...prev, actividadId]
    );

    // Actualizar contador de likes instantáneamente
    setLikesPorActividad((prev) => ({
      ...prev,
      [actividadId]: isFav ? likesAnteriores - 1 : likesAnteriores + 1,
    }));

    // Mostrar toast inmediatamente
    toast.success(isFav ? "Removido de favoritos" : "Agregado a favoritos");

    // Hacer el fetch en background (sin await)
    fetch(`/api/comunidad/actividades/${actividadId}/like`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar like");
        // Obtener el contador actualizado del servidor
        return fetchLikesCount(actividadId);
      })
      .then((nuevoCount) => {
        // Actualizar con el valor real del servidor
        setLikesPorActividad((prev) => ({ ...prev, [actividadId]: nuevoCount }));
      })
      .catch((err) => {
        console.error("Error al dar like:", err);
        // Revertir cambios si hay error
        setFavoritos(estadoAnterior);
        setLikesPorActividad((prev) => ({ ...prev, [actividadId]: likesAnteriores }));
        toast.error("Error al actualizar favorito");
      });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleModal = (imagenes: Archivo[], index: number) => {
    setImagenes(imagenes);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loadingInicial)
    return <SkeletonActividades />;

  if (error)
    return (
      <div className="text-red-text-center600 font-medium mt-10">{error}</div>
    );

  if (!user)
    return (
      <div className="text-center text-gray-600 mt-10">
        Debes iniciar sesión para ver las actividades.
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#003c71] text-center">
        Actividades Mulita
      </h1>

      {/* FILTROS + BÚSQUEDA */}
      <div className="w-full max-w-2xl mb-8 flex flex-col gap-4">
        {/* Barra de búsqueda */}
        <div className="relative w-full">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar actividades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-[#003c71] focus:ring-0 transition-colors"
          />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-600">Filtrar por:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-full sm:w-48">
              <FiltroCategoria
                categoriasSeleccionadas={categoriasSeleccionadas}
                onChange={setCategoriasSeleccionadas}
              />
            </div>
            <div className="w-full sm:w-40">
              <FiltroFecha
                fechaSeleccionada={fechaSeleccionada}
                onChange={setFechaSeleccionada}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LISTADO DE ACTIVIDADES */}
      <div className="flex flex-col gap-8 max-w-xl w-full">
        {actividades.length === 0 ? (
          <div className="text-center text-gray-600 mt-10">
            No hay actividades disponibles.
          </div>
        ) : (
          actividades.map((act) => {
            const imagenesAct = act.actividad_archivos.filter((a) => a.tipo.startsWith("image/"));
            const otrosArchivos = act.actividad_archivos.filter((a) => !a.tipo.startsWith("image/"));
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
                <h3 className="text-lg font-bold text-[#003c71] -mb-2">
                  {act.titulo}
                </h3>

                {/* DESCRIPCIÓN */}
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
                        <img
                          src={img.archivo_url}
                          alt={`Imagen ${i + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* BOTONES */}
                <div className="flex items-center gap-4 text-gray-600 pt-3 border-t border-gray-200 text-sm">
                  {/* Me gusta */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleLike(act.id)} className="hover:opacity-75 transition">
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
                    <span className="text-sm text-gray-700 font-semibold">
                      {likesPorActividad[act.id] ?? 0}
                    </span>
                  </div>

                  {/* Comentarios */}
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

                  {/* Colecciones */}
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

                {/* Input de comentario */}
                <ComentarioInput
                  actividadId={act.id}
                  onNuevoComentario={async () => {
                    const count = await fetchComentariosCount(act.id);
                    actualizarComentarios(act.id, count);
                    await fetchUltimoComentario(act.id);
                  }}
                />

                {/* ÚLTIMO COMENTARIO */}
                {ultimoComentario[act.id] && (
                  <div className="border-t border-gray-100 pt-3 mt-2">
                    <p className="text-xs text-gray-500 mb-2 font-semibold">Último comentario</p>
                    <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                      {ultimoComentario[act.id].usuario?.perfil?.imagen ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={ultimoComentario[act.id].usuario.perfil.imagen}
                            alt={`${ultimoComentario[act.id].usuario?.nombre}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs flex-shrink-0">
                          {ultimoComentario[act.id].usuario?.nombre?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">
                          {ultimoComentario[act.id].usuario?.nombre} {ultimoComentario[act.id].usuario?.apellido}
                        </p>
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {ultimoComentario[act.id].contenido}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {hasMore && !loadingInicial && (
          <button
            onClick={handleVerMas}
            disabled={loadingVerMas}
            className="px-5 py-2 bg-[#003c71] text-white rounded-full hover:bg-[#00509e] transition self-center"
          >
            {loadingVerMas ? "Cargando..." : "Ver más"}
          </button>
        )}
      </div>

      {/* MODAL IMÁGENES */}
      {modalOpen && (
        <ModalImagenActividades
          images={imagenes.map((img) => img.archivo_url)}
          initialIndex={currentIndex}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* MODAL COMENTARIOS */}
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

      {/* MODAL COLECCIONES */}
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
      
      {/* BOTÓN SCROLL TOP */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#003c71] text-white p-3 rounded-full shadow-lg hover:bg-[#00509e] transition"
          aria-label="Subir arriba"
        >
          🡹
        </button>
      )}
    </div>
  );
}
