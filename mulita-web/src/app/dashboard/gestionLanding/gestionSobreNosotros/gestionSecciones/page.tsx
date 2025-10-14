"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Seccion {
  id: number;
  nombre: string;
  orden: number;
}

export default function GestionSeccionesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([]);

  useEffect(() => {
    fetchSecciones();
  }, []);

  async function fetchSecciones() {
    const res = await fetch("/api/sobreNosotros/secciones");
    const data = await res.json();
    setSecciones(data.secciones);
  }

  // Guardar nuevo orden en la base de datos
  async function actualizarOrden(seccionesActualizadas: Seccion[]) {
    for (let i = 0; i < seccionesActualizadas.length; i++) {
      const sec = seccionesActualizadas[i];
      await fetch(`/api/sobreNosotros/secciones/${sec.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden: i + 1 })
      });
    }
    fetchSecciones();
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(secciones);
    const [reordenado] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordenado);

    setSecciones(items);
    actualizarOrden(items);
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden flex flex-col items-center px-4 sm:px-6 pb-10 box-border font-inter">
      {/* Header */}
      <div className="w-full max-w-[1103px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <div className="flex flex-col text-[28px] sm:text-[32px] md:text-[36px]">
          <h1 className="leading-tight font-extrabold text-black">
            Gestión de Secciones
          </h1>
          <p className="mt-2 text-left text-sm sm:text-base leading-6 text-[#6d758f]">
            Arrastra y organiza el orden de las secciones de la página Sobre Nosotros.
          </p>
        </div>
      </div>

      {/* Lista de secciones */}
      <div className="flex-1 w-full max-w-[1103px] mt-10 flex flex-col gap-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="secciones">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-4"
              >
                {secciones.map((sec, index) => (
                  <Draggable key={sec.id} draggableId={sec.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 bg-white border border-[#e1e4ed] rounded-lg shadow-sm transition ${
                          snapshot.isDragging ? "shadow-md bg-blue-50" : "hover:shadow-md"
                        }`}
                      >
                        <div className="text-base sm:text-lg font-semibold text-black break-words">
                          {sec.nombre}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
