// "use client";

// import { useEffect, useState } from "react";

// type Archivo = { archivo_url: string; tipo: string };
// type Categoria = { categoria: { nombre: string } };
// type Usuario = { id: string; nombre: string; apellido: string; foto_url?: string };

// type Actividad = {
//   id: string;
//   titulo: string;
//   descripcion: string;
//   fecha: string;
//   usuario_id: string;
//   usuario?: Usuario;
//   actividad_archivos: Archivo[];
//   actividad_categoria: Categoria[];
// };

// export default function Actividades() {
//   const [actividades, setActividades] = useState<Actividad[]>([]);
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchActividades = async () => {
//       try {
//         const res = await fetch("/api/comunidad/actividades");
//         if (!res.ok) throw new Error("Error al obtener las actividades");
//         const data = await res.json();
//         setActividades(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchActividades();
//   }, []);

//   const toggleExpand = (id: string) => {
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-60">
//         <p className="text-gray-600 animate-pulse">Cargando actividades...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-center text-red-600 font-medium mt-10">{error}</div>
//     );

//   if (actividades.length === 0)
//     return (
//       <div className="text-center text-gray-600 mt-10">
//         No hay actividades disponibles.
//       </div>
//     );

//   return (
//     <div className="w-full min-h-screen flex flex-col items-center py-10 px-4">
//       <h1 className="text-3xl font-bold mb-10 text-[#003c71] text-center">
//         Actividades Mulita
//       </h1>

//       <div className="flex flex-col gap-8 max-w-xl w-full">
//         {actividades.map((act) => {
//           const imagenes = act.actividad_archivos.filter((a) =>
//             a.tipo.startsWith("image/")
//           );
//           const otrosArchivos = act.actividad_archivos.filter(
//             (a) => !a.tipo.startsWith("image/")
//           );
//           const categorias = act.actividad_categoria?.map(
//             (c) => c.categoria.nombre
//           );

//           return (
//             <div
//               key={act.id}
//               className="w-full bg-white rounded-2xl shadow border border-gray-200 p-5 flex flex-col gap-4"
//             >
//               {/* CABECERA */}
//               <div className="flex justify-between items-start">
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={act.usuario?.foto_url || "/default-profile.png"}
//                     alt="Perfil"
//                     className="w-12 h-12 rounded-full object-cover border"
//                   />
//                   <div>
//                     <p className="font-semibold text-gray-800">
//                       {act.usuario?.nombre} {act.usuario?.apellido}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {new Date(act.fecha).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>

//                 {/* CATEGORÍAS + BOTÓN ⋯ */}
//                 <div className="flex items-center gap-2">
//                   {categorias?.map((cat, i) => (
//                     <span
//                       key={i}
//                       className="shadow border border-[#f1f3f7] bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700"
//                     >
//                       {cat}
//                     </span>
//                   ))}
//                   <button className="text-gray-600 hover:text-gray-900 text-xl leading-none px-2">
//                     ⋯
//                   </button>
//                 </div>
//               </div>

//               {/* DESCRIPCIÓN */}
//               <div className="text-gray-700 text-sm leading-relaxed">
//                 {expanded[act.id]
//                   ? act.descripcion
//                   : act.descripcion.length > 200
//                   ? act.descripcion.slice(0, 200) + "..."
//                   : act.descripcion}
//                 {act.descripcion.length > 200 && (
//                   <button
//                     onClick={() => toggleExpand(act.id)}
//                     className="text-[#003c71] ml-2 font-semibold hover:underline"
//                   >
//                     {expanded[act.id] ? "Ver menos" : "Ver más"}
//                   </button>
//                 )}
//               </div>

//               {/* ARCHIVOS DESCARGABLES */}
//               {otrosArchivos.length > 0 && (
//                 <div className="flex flex-col gap-1 mt-2">
//                   {otrosArchivos.map((a, i) => (
//                     <a
//                       key={i}
//                       href={a.archivo_url}
//                       download
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-[#003c71] hover:underline flex items-center gap-2"
//                     >
//                       📎 Descargar archivo {i + 1}
//                     </a>
//                   ))}
//                 </div>
//               )}

//               {/* GALERÍA DE IMÁGENES */}
//               {imagenes.length > 0 && (
//                 <div
//                   className={`grid ${
//                     imagenes.length === 1
//                       ? "grid-cols-1"
//                       : imagenes.length === 2
//                       ? "grid-cols-2"
//                       : "grid-cols-3"
//                   } gap-2 mt-3`}
//                 >
//                   {imagenes.map((img, i) => (
//                     <img
//                       key={i}
//                       src={img.archivo_url}
//                       alt={`Imagen ${i + 1}`}
//                       className="w-full h-48 object-cover rounded-lg cursor-pointer"
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* BOTONES DE ACCIÓN */}
//               <div className="flex justify-between text-gray-600 pt-3 border-t border-gray-200 text-sm">
//                 <button className="hover:text-[#003c71]">👍 Me gusta</button>
//                 <button className="hover:text-[#003c71]">💬 Comentar</button>
//                 <button className="hover:text-[#003c71]">📁 Guardar</button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MenuAccionesActividades from "@/components/ui/MenuAccionesActividades";
import ModalImagenActividades from "@/components/ui/ModalImagenActividades";

type Archivo = { archivo_url: string; tipo: string; nombre?: string };
type Categoria = { categoria: { nombre: string } };
type Usuario = { id: string; nombre: string; apellido: string; avatar_url?: string };
type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  usuario: Usuario;
  actividad_archivos: Archivo[];
  actividad_categoria: Categoria[];
};

export default function Actividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal de imágenes
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagenes, setImagenes] = useState<Archivo[]>([]);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await fetch("/api/comunidad/actividades");
        if (!res.ok) throw new Error("Error al obtener las actividades");
        const data = await res.json();
        setActividades(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchActividades();
  }, []);

  const toggleModal = (imagenes: Archivo[], index: number) => {
    setImagenes(imagenes);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-600 animate-pulse">Cargando actividades...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-medium mt-10">{error}</div>
    );

  if (actividades.length === 0)
    return (
      <div className="text-center text-gray-600 mt-10">
        No hay actividades disponibles.
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center py-12 px-6">
      <h1 className="text-3xl font-bold mb-10 text-[#003c71] text-center">
        Actividades disponibles
      </h1>

      <div className="flex flex-col gap-8 max-w-4xl w-full">
        {actividades.map((act) => {
          const imagenesAct = act.actividad_archivos?.filter((a) =>
            a.tipo.startsWith("image/")
          );
          const categorias = act.actividad_categoria?.map(
            (c) => c.categoria.nombre
          );

          return (
            <div
              key={act.id}
              className="w-full shadow-md rounded-lg border border-[#e1e4ed] bg-white flex flex-col overflow-hidden"
            >
              {/* HEADER: perfil + nombre + fecha + categorías + menú */}
              <div className="flex justify-between items-start p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={act.usuario.avatar_url || "/default-avatar.png"}
                    alt={act.usuario.nombre}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">{`${act.usuario.nombre} ${act.usuario.apellido}`}</span>{" "}
                    — {new Date(act.fecha).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {categorias.map((cat) => (
                      <span
                        key={cat}
                        className="shadow border border-[#f1f3f7] rounded px-2 py-0.5 text-gray-700 text-xs"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <MenuAccionesActividades actividad={{ id: act.id, usuario_id: act.usuario.id }} />
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="px-4 pb-4 text-gray-700 text-sm">
                <p className="line-clamp-3">{act.descripcion}</p>
              </div>

              {/* ARCHIVOS DESCARGABLES */}
              {act.actividad_archivos.length > 0 && (
                <div className="px-4 pb-4 flex flex-col gap-2">
                  {act.actividad_archivos.map((archivo, i) => (
                    <a
                      key={i}
                      href={archivo.archivo_url}
                      download={archivo.nombre}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {archivo.nombre || `Archivo ${i + 1}`}
                    </a>
                  ))}
                </div>
              )}

              {/* GALERÍA DE IMÁGENES */}
              {imagenesAct.length > 0 && (
                <div className="grid grid-cols-3 gap-1">
                  {imagenesAct.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => toggleModal(imagenesAct, i)}
                      className="w-full h-32 overflow-hidden"
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

              {/* BOTONES DE INTERACCIÓN */}
              <div className="flex justify-around items-center py-2 border-t border-[#e1e4ed] mt-2">
                <button className="text-gray-600 hover:text-gray-800 text-sm font-semibold">
                  Me gusta
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-semibold">
                  Comentarios
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-semibold">
                  Agregar a colección
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE IMÁGENES */}
      {modalOpen && (
        <ModalImagenActividades
          images={imagenes.map((img) => img.archivo_url)}
          initialIndex={currentIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
