// "use client";

// import { useEffect, useState } from "react";

// type ModalColeccionesProps = {
//   isOpen: boolean;
//   actividadId: string;
//   onClose: () => void;
// };

// type Coleccion = {
//   id: string;
//   nombre: string;
//   pertenece?: boolean; // indica si la actividad ya pertenece a la colección
// };

// export default function ModalColecciones({
//   isOpen,
//   actividadId,
//   onClose,
// }: ModalColeccionesProps) {
//   const [colecciones, setColecciones] = useState<Coleccion[]>([]);
//   const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
//   const [nuevaColeccion, setNuevaColeccion] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Cargar colecciones del usuario con info de si la actividad ya pertenece
//   useEffect(() => {
//     if (!isOpen || !actividadId) return;

//     const fetchColecciones = async () => {
//       try {
//         const res = await fetch(`/api/colecciones/${actividadId}`); // nuevo endpoint
//         if (!res.ok) throw new Error("Error al obtener colecciones");
//         const data = await res.json();

//         setColecciones(data);
//         setSeleccionadas(
//           data.filter((c: Coleccion) => c.pertenece).map((c: Coleccion) => c.id)
//         );
//       } catch (err: any) {
//         setError(err.message);
//       }
//     };

//     fetchColecciones();
//   }, [isOpen, actividadId]);

//   // 🔹 Alternar selección de colecciones
//   const toggleSeleccion = (id: string) => {
//     setSeleccionadas((prev) =>
//       prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
//     );
//   };

//   // 🔹 Crear nueva colección y agregar la actividad
//   const handleCrearColeccion = async () => {
//     if (!nuevaColeccion.trim()) return;
//     setLoading(true);
//     try {
//       const res = await fetch("/api/colecciones", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ nombre: nuevaColeccion, actividadId }),
//       });
//       if (!res.ok) throw new Error("Error al crear la colección");

//       const nueva = await res.json();
//       setColecciones((prev) => [...prev, nueva]);
//       setNuevaColeccion("");
//       setCreating(false);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Guardar selección (agregar actividad a colecciones)
//   const handleGuardar = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Actualizamos todas las colecciones seleccionadas
//       await Promise.all(
//         seleccionadas.map(async (id) => {
//           const res = await fetch(`/api/colecciones/${id}`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ actividadIds: [actividadId] }),
//           });
//           if (!res.ok) throw new Error("Error al agregar actividad");
//         })
//       );

//       onClose();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
//         <h2 className="text-xl font-semibold mb-4 text-[#003c71]">
//           Agregar a colecciones
//         </h2>

//         {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

//         {/* 🔹 Lista de colecciones */}
//         <div className="max-h-60 overflow-y-auto mb-4 border rounded-md">
//           {colecciones.length === 0 ? (
//             <p className="text-center text-gray-500 py-4">
//               No tienes colecciones aún.
//             </p>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {colecciones.map((col) => (
//                 <li
//                   key={col.id}
//                   className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100"
//                   onClick={() => toggleSeleccion(col.id)}
//                 >
//                   <span className="text-gray-800">{col.nombre}</span>
//                   <input
//                     placeholder="colecciones"
//                     type="checkbox"
//                     checked={seleccionadas.includes(col.id)}
//                     readOnly
//                     className="accent-[#003c71] w-4 h-4"
//                   />
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* 🔹 Crear nueva colección */}
//         {creating ? (
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Nombre de la nueva colección"
//               value={nuevaColeccion}
//               onChange={(e) => setNuevaColeccion(e.target.value)}
//               className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#003c71] focus:outline-none"
//             />
//             <div className="flex justify-end gap-2 mt-2">
//               <button
//                 onClick={() => setCreating(false)}
//                 className="text-gray-500 text-sm"
//               >
//                 Cancelar
//               </button>
//               <button
//                 onClick={handleCrearColeccion}
//                 disabled={loading}
//                 className="bg-[#003c71] text-white px-4 py-1 rounded-md text-sm hover:bg-[#00509e] disabled:opacity-50"
//               >
//                 {loading ? "Creando..." : "Crear"}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <button
//             onClick={() => setCreating(true)}
//             className="text-[#003c71] text-sm mb-4 font-semibold hover:underline"
//           >
//             + Crear nueva colección
//           </button>
//         )}

//         {/* 🔹 Botones de acción */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
//           >
//             Cancelar
//           </button>
//           <button
//             onClick={handleGuardar}
//             disabled={loading}
//             className="px-5 py-2 bg-[#003c71] text-white rounded-md hover:bg-[#00509e] disabled:opacity-50"
//           >
//             {loading ? "Guardando..." : "Guardar"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function ModalColecciones({
  actividadId,
  onClose,
}: {
  actividadId: string;
  onClose: () => void;
}) {
  const [colecciones, setColecciones] = useState<any[]>([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/colecciones")
      .then((res) => res.json())
      .then((data) => setColecciones(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAgregar = async (coleccion_id: string) => {
    setLoading(true);
    await fetch(`/api/colecciones/${coleccion_id}/actividades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actividad_id: actividadId }),
    });
    setLoading(false);
    onClose();
  };

  const handleCrear = async () => {
    if (!nuevoNombre.trim()) return;
    setLoading(true);
    const res = await fetch("/api/colecciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevoNombre }),
    });
    const nueva = await res.json();
    setColecciones((prev) => [nueva, ...prev]);
    setNuevoNombre("");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-[#003c71] text-center">
          Guardar en una colección
        </h2>

        {/* Crear nueva colección */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nueva colección..."
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-3 py-1"
          />
          <button
            onClick={handleCrear}
            className="bg-[#003c71] text-white px-3 rounded-full hover:bg-[#00509e]"
          >
            Crear
          </button>
        </div>

        {/* Listado de colecciones */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {colecciones.length === 0 ? (
            <p className="text-center text-gray-500">
              No tienes colecciones aún.
            </p>
          ) : (
            colecciones.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAgregar(c.id)}
                className="w-full text-left border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100"
                disabled={loading}
              >
                {c.nombre}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
