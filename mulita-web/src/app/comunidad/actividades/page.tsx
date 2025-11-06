"use client";

import { useEffect, useState, useCallback } from "react";
import MenuAccionesActividades from "@/components/ui/MenuAccionesActividades";
import ModalImagenActividades from "@/components/ui/ModalImagenActividades";
import ComentarioInput from "@/components/ui/ComentarioInput";
import ComentariosModal from "@/components/ui/ComentariosModal";
import ModalColecciones from "@/components/ui/ModalColecciones";
import { FiltroCategoria } from "@/components/ui/Filtros";
import { FiltroFecha } from "@/components/ui/Filtros";
import { useUser } from "@/context/UserContext";

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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagenes, setImagenes] = useState<Archivo[]>([]);

  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
  const [comentariosPorActividad, setComentariosPorActividad] = useState<Record<string, number>>({});

  const [modalColecciones, setModalColecciones] = useState(false);
  const [actividadParaColeccion, setActividadParaColeccion] = useState<string | null>(null);


  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 5;

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(""); // <-- estado fecha

  // Debounce para búsqueda
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

  const actualizarComentarios = (actividadId: string, nuevoCount: number) => {
    setComentariosPorActividad((prev) => ({ ...prev, [actividadId]: nuevoCount }));
  };

  // fetchActividades con filtros por offset, búsqueda, categoría y fecha
  const fetchActividades = useCallback(
    async (newOffset = 0, searchTerm = "", categoria = "", fecha = "") => {
      try {
        setLoading(true);

        let url = `/api/comunidad/actividades?offset=${newOffset}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`;
        if (categoria) url += `&categoria=${encodeURIComponent(categoria)}`;
        if (fecha) url += `&fecha=${encodeURIComponent(fecha)}`; // <-- agregamos fecha

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener las actividades");
        const data: Actividad[] = await res.json();

        if (newOffset === 0) setActividades(data);
        else setActividades((prev) => [...prev, ...data]);

        setHasMore(data.length === limit);

        const counts: Record<string, number> = {};
        await Promise.all(
          data.map(async (act) => {
            counts[act.id] = await fetchComentariosCount(act.id);
          })
        );
        setComentariosPorActividad((prev) => ({ ...prev, ...counts }));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Carga inicial y actualización al cambiar filtros
  useEffect(() => {
    setOffset(0);
    fetchActividades(0, debouncedSearch, categoriaSeleccionada, fechaSeleccionada);
  }, [debouncedSearch, categoriaSeleccionada, fechaSeleccionada, fetchActividades]);

  const handleVerMas = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchActividades(newOffset, debouncedSearch, categoriaSeleccionada, fechaSeleccionada);
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

  if (loading && actividades.length === 0)
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-600 animate-pulse">Cargando actividades...</p>
      </div>
    );

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
      <div className="w-full max-w-xl mb-6 flex flex-wrap items-center justify-center sm:justify-between gap-2">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por título o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[55%] border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#003c71]"
        />

        {/* Contenedor de filtros */}
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <FiltroCategoria
            categoriaSeleccionada={categoriaSeleccionada}
            onChange={setCategoriaSeleccionada}
          />
          <FiltroFecha
            fechaSeleccionada={fechaSeleccionada}
            onChange={setFechaSeleccionada}
          />
        </div>
      </div>

      {/* LISTADO DE ACTIVIDADES */}
      <div className="flex flex-col gap-8 max-w-xl w-full">
        {actividades.length === 0 && !loading ? (
          <div className="text-center text-gray-600 mt-10">
            No hay actividades disponibles.
          </div>
        ) : (
          actividades.map((act) => {
            const imagenesAct = act.actividad_archivos.filter((a) =>
              a.tipo.startsWith("image/")
            );
            const otrosArchivos = act.actividad_archivos.filter(
              (a) => !a.tipo.startsWith("image/")
            );
            const categorias = act.actividad_categoria?.map((c) => c.categoria.nombre);

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
                        src={act.usuario.perfil.imagen || "/default-profile.png"}
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
                  <button className="hover:opacity-75 transition">
                    <img
                      src="/images/icons/comunidad/favoritos.svg"
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
                    className="hover:opacity-75 transition"
                    onClick={() => {
                      setActividadParaColeccion(act.id);
                      setModalColecciones(true);
                    }}
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
          })
        )}

        {hasMore && !loading && (
          <button
            onClick={handleVerMas}
            className="px-5 py-2 bg-[#003c71] text-white rounded-full hover:bg-[#00509e] transition self-center"
          >
            Ver más
          </button>
        )}

        {loading && (
          <p className="text-gray-600 animate-pulse text-center mt-2">Cargando...</p>
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

      {modalColecciones && actividadParaColeccion && (
        <ModalColecciones
          actividadId={actividadParaColeccion}
          onClose={() => {
            setModalColecciones(false);
            setActividadParaColeccion(null);
          }}
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
