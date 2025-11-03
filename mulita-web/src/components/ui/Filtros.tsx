"use client";

import { useEffect, useState } from "react";

interface Categoria {
  id: string;
  nombre: string;
}

interface FiltroCategoriaProps {
  categoriaSeleccionada: string;
  onChange: (categoria: string) => void;
}

interface FiltroFechaProps {
  fechaSeleccionada: string;
  onChange: (fecha: string) => void;
}

export function FiltroCategoria({ categoriaSeleccionada, onChange }: FiltroCategoriaProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/categorias");
        if (!res.ok) throw new Error("Error al obtener categorías");
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <div className="w-full flex">
      <select
        aria-label="categorias"
        value={categoriaSeleccionada}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003c71]"
      >
        <option value="">Categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.nombre}>
            {cat.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FiltroFecha({ fechaSeleccionada, onChange }: FiltroFechaProps) {
  const opciones = [
    { label: "Hoy", value: "hoy" },
    { label: "Esta semana", value: "semana" },
    { label: "Este mes", value: "mes" },
  ];

  return (
    <div className="w-full flex">
      <select
        aria-label="Filtrar por fecha"
        value={fechaSeleccionada}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003c71]"
      >
        <option value="">Fecha</option>
        {opciones.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}
