"use client";

import { useEffect, useState } from "react";

interface Categoria {
  id: string;
  nombre: string;
}

interface FiltroCategoriaMateriaProps {
  materiaSeleccionada: string;
  onChange: (value: string) => void;
}

interface FiltroCategoriaGradoProps {
  gradoSeleccionado: string;
  onChange: (value: string) => void;
}

interface FiltroCategoriaDificultadProps {
  dificultadSeleccionada: string;
  onChange: (value: string) => void;
}

interface FiltroFechaProps {
  fechaSeleccionada: string;
  onChange: (fecha: string) => void;
}

export function FiltroCategoriaMateria({ materiaSeleccionada, onChange }: FiltroCategoriaMateriaProps) {
  const [materias, setMaterias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      setMaterias(data.materias || []);
    };
    fetchCategorias();
  }, []);

  return (
    <select
      aria-label="Filtrar por materia"
      value={materiaSeleccionada}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003c71]"
    >
      <option value="">Materia</option>
      {materias.map((m) => (
        <option key={m.id} value={m.nombre}>
          {m.nombre}
        </option>
      ))}
    </select>
  );
}

export function FiltroCategoriaGrado({ gradoSeleccionado, onChange }: FiltroCategoriaGradoProps) {
  const [grados, setGrados] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      setGrados(data.grados || []);
    };
    fetchCategorias();
  }, []);

  return (
    <select
      aria-label="Filtrar por grados"
      value={gradoSeleccionado}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003c71]"
    >
      <option value="">Grado</option>
      {grados.map((g) => (
        <option key={g.id} value={g.nombre}>
          {g.nombre}
        </option>
      ))}
    </select>
  );
}

export function FiltroCategoriaDificultad({ dificultadSeleccionada, onChange }: FiltroCategoriaDificultadProps) {
  const [dificultades, setDificultades] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      setDificultades(data.dificultades || []);
    };
    fetchCategorias();
  }, []);

  return (
    <select
      aria-label="Filtrar por dificultad"
      value={dificultadSeleccionada}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003c71]"
    >
      <option value="">Dificultad</option>
      {dificultades.map((d) => (
        <option key={d.id} value={d.nombre}>
          {d.nombre}
        </option>
      ))}
    </select>
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