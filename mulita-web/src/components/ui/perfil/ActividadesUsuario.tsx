"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import MenuAccionesActividades from "@/components/ui/comunidad/MenuAccionesActividades";
import ModalImagenActividades from "@/components/ui/comunidad/ModalImagenActividades";
import ComentarioInput from "@/components/ui/comunidad/ComentarioInput";
import ComentariosModal from "@/components/ui/comunidad/ComentariosModal";
import ModalColecciones from "@/components/ui/comunidad/ModalColecciones";
import { FiltroCategoria, FiltroFecha } from "@/components/ui/comunidad/Filtros";
import { useUser } from "@/hooks/queries";
import { SkeletonActividadesUsuario } from "./skeletons/SkeletonActividadesUsuario";

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

type Props = {
  usuarioId: string;
  perfilImagen?: string;
  mostrarSoloFavoritos?: boolean;
};

export default function ActividadesUsuario({
  usuarioId,
  perfilImagen,
  mostrarSoloFavoritos = false,
}: Props) {
  const { user } = useUser();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loadingInicial, setLoadingInicial] = useState(false);
  const [loadingVerMas, setLoadingVerMas] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

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
  const [showScrollButton, setShowScrollButton] = useState(false);

  const limit = 5;

  // Obtiene la cantidad de comentarios de una actividad
  const fetchComentariosCount = async (actividadId: string) => {
    try {
      const res = await fetch(`/api/comunidad/comentarios/${actividadId}`);
      if (!res.ok) throw new Error("Error al obtener comentarios");
      const data = await res.json();
      return data.length;
    } catch {
      return 0;
    }
  };

  const fetchLikesCount = async (actividadId: string) => {
    try {
      const res = await fetch(`/api/comunidad/actividades/${actividadId}/likes`);
      if (!res.ok) throw new Error("Error al obtener likes");
      const data = await res.json();
      return data.count || 0;
    } catch {
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
    } catch {
      // Silenciosamente ignorar errores
    }
  };

  const actualizarComentarios = (actividadId: string, nuevoCount: number) => {
    setComentariosPorActividad((prev) => ({ ...prev, [actividadId]: nuevoCount }));
  };

  const actualizarLikes = (actividadId: string, nuevoCount: number) => {
    setLikesPorActividad((prev) => ({ ...prev, [actividadId]: nuevoCount }));
  };

  // Trae todas las actividades o solo los favoritos
  const fetchActividades = useCallback(
    async (newOffset = 0, categorias: string[] = [], fecha = "") => {
      try {
        if (newOffset === 0) {
          setLoadingInicial(true);
        } else {
          setLoadingVerMas(true);
        }
        let data: Actividad[] = [];

        // Obtener todas las colecciones del usuario ---
        const resColecciones = await fetch(`/api/colecciones?userId=${usuarioId}`);
        if (!resColecciones.ok) throw new Error("Error al obtener las colecciones del usuario");

        const colecciones = await resColecciones.json();
        const coleccionFavoritos = colecciones.find(
          (c: any) => c.nombre?.toLowerCase() === "favoritos"
        );

        // Si hay favoritos, traer sus actividades ---
        let idsFavoritos: string[] = [];
        if (coleccionFavoritos) {
          const resFav = await fetch(`/api/colecciones/${coleccionFavoritos.id}`);
          if (resFav.ok) {
            const favData = await resFav.json();
            idsFavoritos = (favData.actividades || []).map((a: Actividad) => a.id);
            setFavoritos(idsFavoritos);
          }
        }

        // Si se muestran solo favoritos, usar esos datos ---
        if (mostrarSoloFavoritos && coleccionFavoritos) {
          const resFav = await fetch(`/api/colecciones/${coleccionFavoritos.id}`);
          if (!resFav.ok) throw new Error("Error al obtener actividades favoritas");

          const coleccionData = await resFav.json();
          data = coleccionData.actividades || [];
          
          // Aplicar filtros a los favoritos ---
          if (categorias.length > 0) {
            data = data.filter((act: Actividad) => {
              const actCategorias = act.actividad_categoria?.map((c: any) => c.categoria.nombre) || [];
              return categorias.some(cat => actCategorias.includes(cat));
            });
          }
          
          if (fecha) {
            // Ordenamiento por fecha
            if (fecha === "nuevo_antiguo") {
              data = data.sort((a: Actividad, b: Actividad) => 
                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
              );
            } else if (fecha === "antiguo_nuevo") {
              data = data.sort((a: Actividad, b: Actividad) => 
                new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
              );
            } else if (fecha === "hoy") {
              const hoy = new Date().toLocaleDateString('es-AR');
              data = data.filter((act: Actividad) => 
                new Date(act.fecha).toLocaleDateString('es-AR') === hoy
              );
            } else if (fecha === "semana") {
              const ahora = new Date();
              const hace7dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
              data = data.filter((act: Actividad) => {
                const actFecha = new Date(act.fecha);
                return actFecha >= hace7dias && actFecha <= ahora;
              });
            } else if (fecha === "mes") {
              const ahora = new Date();
              const hace30dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
              data = data.filter((act: Actividad) => {
                const actFecha = new Date(act.fecha);
                return actFecha >= hace30dias && actFecha <= ahora;
              });
            }
          }
        } else {
          // Si no, traer las actividades del usuario ---
          const res = await fetch(
            `/api/perfil/${usuarioId}/actividades?offset=${newOffset}&limit=${limit}`
          );
          if (!res.ok) throw new Error("Error al obtener las actividades del usuario");
          data = await res.json();
          setHasMore(data.length === limit);
          
          // Aplicar filtros en cliente ---
          if (categorias.length > 0) {
            data = data.filter((act: Actividad) => {
              const actCategorias = act.actividad_categoria?.map((c: any) => c.categoria.nombre) || [];
              return categorias.some(cat => actCategorias.includes(cat));
            });
          }
          
          if (fecha) {
            // Ordenamiento por fecha
            if (fecha === "nuevo_antiguo") {
              data = data.sort((a: Actividad, b: Actividad) => 
                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
              );
            } else if (fecha === "antiguo_nuevo") {
              data = data.sort((a: Actividad, b: Actividad) => 
                new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
              );
            } else if (fecha === "hoy") {
              const hoy = new Date().toLocaleDateString('es-AR');
              data = data.filter((act: Actividad) => 
                new Date(act.fecha).toLocaleDateString('es-AR') === hoy
              );
            } else if (fecha === "semana") {
              const ahora = new Date();
              const hace7dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
              data = data.filter((act: Actividad) => {
                const actFecha = new Date(act.fecha);
                return actFecha >= hace7dias && actFecha <= ahora;
              });
            } else if (fecha === "mes") {
              const ahora = new Date();
              const hace30dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
              data = data.filter((act: Actividad) => {
                const actFecha = new Date(act.fecha);
                return actFecha >= hace30dias && actFecha <= ahora;
              });
            }
          }
        }

        // Agregar campo 'isFav' a cada actividad ---
        const actividadesConLike = data.map((act) => ({
          ...act,
          isFav: idsFavoritos.includes(act.id),
        }));

        // Actualizar estado ---
        if (newOffset === 0) setActividades(actividadesConLike);
        else setActividades((prev) => [...prev, ...actividadesConLike]);

        // Cargar cantidad de comentarios, likes y último comentario ---
        const counts: Record<string, number> = {};
        const likes: Record<string, number> = {};
        await Promise.all(
          data.map(async (act) => {
            counts[act.id] = await fetchComentariosCount(act.id);
            likes[act.id] = await fetchLikesCount(act.id);
            await fetchUltimoComentario(act.id);
          })
        );
        setComentariosPorActividad((prev) => ({ ...prev, ...counts }));
        setLikesPorActividad((prev) => ({ ...prev, ...likes }));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingInicial(false);
        setLoadingVerMas(false);
      }
    },
    [usuarioId, mostrarSoloFavoritos]
  );

  useEffect(() => {
    if (usuarioId) {
      setOffset(0);
      fetchActividades(0, categoriasSeleccionadas, fechaSeleccionada);
    }
  }, [usuarioId, categoriasSeleccionadas, fechaSeleccionada, fetchActividades]);

  const handleVerMas = () => {
    const nuevoOffset = offset + limit;
    setOffset(nuevoOffset);
    fetchActividades(nuevoOffset, categoriasSeleccionadas, fechaSeleccionada);
  };

  const toggleLike = (actividadId: string) => {
    // Guardar estado anterior en caso de necesitar revertir
    const isFav = favoritos.includes(actividadId);
    const estadoAnterior = favoritos;
    const likesAnteriores = likesPorActividad;

    // Actualizar estado INMEDIATAMENTE (optimistic update)
    setFavoritos((prev) =>
      prev.includes(actividadId)
        ? prev.filter((id) => id !== actividadId)
        : [...prev, actividadId]
    );

    // Actualizar contador de likes
    setLikesPorActividad((prev) => ({
      ...prev,
      [actividadId]: isFav ? (prev[actividadId] || 0) - 1 : (prev[actividadId] || 0) + 1,
    }));

    // Mostrar toast inmediatamente
    toast.success(isFav ? "Removido de favoritos" : "Agregado a favoritos");

    if (mostrarSoloFavoritos) {
      setActividades((prev) => prev.filter((a) => a.id !== actividadId));
    }

    // Hacer el fetch en background (sin await)
    fetch(`/api/comunidad/actividades/${actividadId}/like`, { method: "POST" })
      .catch((err) => {
        console.error("Error al dar like:", err);
        // Revertir cambios si hay error
        setFavoritos(estadoAnterior);
        setLikesPorActividad(likesAnteriores);
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (loadingInicial)
    return <SkeletonActividadesUsuario />;

  if (error)
    return <div className="text-red-600 text-center font-medium mt-10">{error}</div>;

  if (actividades.length === 0)
    return <div className="text-center text-gray-600 mt-10">No hay actividades para mostrar.</div>;

  if (!user)
    return (
      <div className="text-center text-gray-600 mt-10">
        Debes iniciar sesión para ver las actividades.
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center py-6 px-4 md:px-0">
      <h2 className="text-3xl font-bold mb-8 text-[#003c71] text-center">
        {mostrarSoloFavoritos ? "Favoritos" : "Actividades del usuario"}
      </h2>

      {/* Filtros */}
      <div className="w-full max-w-2xl mb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <span className="text-sm font-semibold text-gray-600">Filtrar por:</span>
          <div className="flex items-center gap-2 flex-wrap justify-center">
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

      <div className="flex flex-col gap-8 max-w-2xl w-full">
        {actividades.map((act) => {
          const imagenesAct = act.actividad_archivos.filter((a) => a.tipo.startsWith("image/"));
          const otrosArchivos = act.actividad_archivos.filter((a) => !a.tipo.startsWith("image/"));
          const categorias = act.actividad_categoria?.map((c) => c.categoria.nombre);
          const isFav = favoritos.includes(act.id);

          return (
            <div
              key={act.id}
              className="w-full bg-white rounded-2xl shadow border border-gray-200 p-5 flex flex-col justify-between"
            >
              {/* Contenido superior */}
              <div className="flex flex-col flex-1 gap-4">
                {/* Cabecera */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={perfilImagen || "/images/icons/perfil/default-avatar.svg"}
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
                      actividad={{ id: act.id, usuario_id: act.usuario_id }}
                      userId={user.id}
                      rol={user.rol}
                    />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-[#003c71] -mb-2">{act.titulo}</h3>

                {/* Descripción */}
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

                {/* Otros archivos */}
                {otrosArchivos.length > 0 && (
                  <div className="flex flex-col gap-1 mt-2">
                    {otrosArchivos.map((a, i) => (
                      <a
                        key={i}
                        href={a.archivo_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-2 truncate"
                        title={a.nombre}
                      >
                        📎 <span className="truncate">Descargar archivo: {a.nombre}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Galería de imágenes */}
                {imagenesAct.length > 0 && (
                  <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                    {imagenesAct.slice(0, 2).map((img, i) => (
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
                    {/* Indicador de más imágenes */}
                    {imagenesAct.length > 2 && (
                      <button
                        onClick={() => toggleModal(imagenesAct, 2)}
                        className="w-full aspect-square rounded-md flex items-center justify-center text-gray-700 text-2xl font-bold transition relative overflow-hidden bg-gray-200"
                      >
                        <span className="relative z-10">+{imagenesAct.length - 2}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Botones y barra de comentarios */}
              <div className="mt-4">
                <div className="flex items-center gap-4 text-gray-600 pt-3 border-t border-gray-200 text-sm">
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
                    await fetchUltimoComentario(act.id);
                  }}
                />
              </div>     

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
        })}

        {hasMore && !loadingInicial && !mostrarSoloFavoritos && (
          <button
            onClick={handleVerMas}
            disabled={loadingVerMas}
            className="px-5 py-2 bg-[#003c71] text-white rounded-full hover:bg-[#00509e] transition self-center"
          >
            {loadingVerMas ? "Cargando..." : "Ver más"}
          </button>
        )}
      </div>

      {/* Modales */}
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
