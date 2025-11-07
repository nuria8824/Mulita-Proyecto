"use client";

import { useEffect, useState } from "react";
import ComentarioInput from "./ComentarioInput";
import ModalImagenActividades from "./ModalImagenActividades";
import MenuAccionesActividades from "./MenuAccionesActividades";
import { useUser } from "@/context/UserContext";

export default function ComentariosModal({ actividad, onClose, onActualizarComentarios }: any) {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalImagenes, setModalImagenes] = useState(false);
  const [indexImagen, setIndexImagen] = useState(0);

  const { user, isSuperAdmin } = useUser();

  const cargarComentarios = async () => {
    setCargando(true);
    try {
      const res = await fetch(`/api/comunidad/comentarios/${actividad.id}`);
      if (!res.ok) throw new Error("Error al obtener comentarios");
      const data = await res.json();
      setComentarios(data);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (actividad?.id) cargarComentarios();
  }, [actividad.id]);

  // Bloquear scroll de fondo mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!user) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Debes iniciar sesión para ver los comentarios.
      </div>
    );
  }

  const handleEliminar = async (comentarioId: string) => {
    try {
      const res = await fetch(`/api/comunidad/comentarios/${comentarioId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await cargarComentarios();
        if (onActualizarComentarios) onActualizarComentarios();
      }
    } catch (err) {
      console.error("Error eliminando comentario:", err);
    }
  };

  const puedeEliminar = (comentario: any) => {
    if (!user) return false;
    return (
      comentario.usuario_id === user.id ||
      user.rol === "admin" ||
      isSuperAdmin()
    );
  };

  const imagenesAct = actividad.actividad_archivos?.filter((a: any) =>
    a.tipo.startsWith("image/")
  );
  const otrosArchivos = actividad.actividad_archivos?.filter(
    (a: any) => !a.tipo.startsWith("image/")
  );
  const categorias = actividad.actividad_categoria?.map(
    (c: any) => c.categoria.nombre
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      {/* Botón de cierre con fondo circular */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[60] flex items-center justify-center w-10 h-10 rounded-full bg-black/70 text-white text-2xl hover:bg-black/90 transition-colors"
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Contenedor del modal */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl w-full max-w-2xl relative shadow-lg flex flex-col max-h-[90vh] overflow-y-auto">
        {/* CABECERA */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={actividad.usuario.perfil?.imagen || "/default-profile.png"}
                alt="Perfil"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {actividad.usuario?.nombre} {actividad.usuario?.apellido}
              </p>
              <p className="text-xs text-gray-500">{actividad.fecha}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {categorias?.map((cat: string, i: number) => (
              <span
                key={i}
                className="shadow border border-[#f1f3f7] bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700"
              >
                {cat}
              </span>
            ))}

            <MenuAccionesActividades
              actividad={{ id: actividad.id, usuario_id: actividad.usuario.id }}
              userId={user?.id ?? ""}
              rol={user?.rol ?? ""}
            />
          </div>
        </div>

        {/* TÍTULO Y DESCRIPCIÓN */}
        <h2 className="text-lg font-bold text-[#003c71] mb-2">
          {actividad.titulo}
        </h2>
        <p className="text-sm mb-4 text-gray-700 whitespace-pre-line">{actividad.descripcion}</p>

        {/* ARCHIVOS DESCARGABLES */}
        {otrosArchivos?.length > 0 && (
          <div className="flex flex-col gap-1 mb-4">
            {otrosArchivos.map((a: any, i: number) => (
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

        {/* GALERÍA DE IMÁGENES */}
        {imagenesAct?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {imagenesAct.map((img: any, i: number) => (
              <button
                key={i}
                onClick={() => {
                  setIndexImagen(i);
                  setModalImagenes(true);
                }}
                className="aspect-square overflow-hidden rounded-md"
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

        {/* BOTONES DE ACCIÓN */}
        <div className="flex items-center gap-4 text-gray-600 pt-3 border-t border-gray-200 text-sm mb-3">
          <button className="hover:opacity-75 transition">
            <img
              src="/images/icons/comunidad/favoritos.svg"
              alt="Me gusta"
              className="w-6 h-6"
            />
          </button>

          <div className="flex items-center gap-1">
            <button className="hover:opacity-75 transition">
              <img
                src="/images/icons/comunidad/comentarios.svg"
                alt="Comentarios"
                className="w-6 h-6"
              />
            </button>
            <span className="text-sm text-gray-700 font-semibold">{comentarios.length}</span>
          </div>

          <button className="hover:opacity-75 transition">
            <img
              src="/images/icons/comunidad/colecciones.svg"
              alt="Guardar"
              className="w-6 h-6"
            />
          </button>
        </div>

        <ComentarioInput
          actividadId={actividad.id}
          onNuevoComentario={async () => {
            await cargarComentarios();
            if (onActualizarComentarios) onActualizarComentarios();
          }}
        />

        {/* COMENTARIOS */}
        <div className="border-t border-gray-200 pt-3">
          <h3 className="text-sm font-medium mb-2">Comentarios</h3>

          {cargando ? (
            <p className="text-sm text-gray-500">Cargando comentarios...</p>
          ) : comentarios.length === 0 ? (
            <p className="text-sm text-gray-500">Sin comentarios aún.</p>
          ) : (
            <div className="space-y-3">
              {comentarios.map((c) => (
                <div key={c.id} className="border-b pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {c.usuario?.perfil?.imagen ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={c.usuario.perfil.imagen}
                            alt={`${c.usuario?.nombre} ${c.usuario?.apellido}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                          {c.usuario?.nombre?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm">
                          <strong>
                            {c.usuario?.nombre} {c.usuario?.apellido}
                          </strong>
                          : {c.contenido}
                        </p>
                        <span className="text-xs text-gray-500">{c.fecha}</span>
                      </div>
                    </div>

                    {puedeEliminar(c) && (
                      <button
                        onClick={() => handleEliminar(c.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de imágenes */}
      {modalImagenes && (
        <ModalImagenActividades
          images={imagenesAct.map((img: any) => img.archivo_url)}
          initialIndex={indexImagen}
          onClose={() => setModalImagenes(false)}
        />
      )}
    </div>
  );
}
