// components/ui/FiltroCategoria.tsx
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

export default function FiltroCategoria({ categoriaSeleccionada, onChange }: FiltroCategoriaProps) {
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
    <div className="w-full flex justify-end mb-4">
      <select
        aria-label="categorias"
        value={categoriaSeleccionada}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#003c71]"
      >
        <option value="">Filtrar por categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.nombre}>
            {cat.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
