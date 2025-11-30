"use client";

import { useEffect, useRef, useState, memo, useCallback } from "react";

interface Categoria {
  id: string;
  nombre: string;
  tipo?: "curso" | "dificultad" | "materia";
}

interface FiltroCategoriaProps {
  categoriasSeleccionadas: string[];
  onChange: (categorias: string[]) => void;
}

interface FiltroFechaProps {
  fechaSeleccionada: string;
  onChange: (fecha: string) => void;
}

function FiltroCategoriaComponent({ categoriasSeleccionadas, onChange }: FiltroCategoriaProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [localSeleccionadas, setLocalSeleccionadas] = useState<string[]>(categoriasSeleccionadas);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sincronizar estado local con props cuando se reciben del parent
  useEffect(() => {
    setLocalSeleccionadas(categoriasSeleccionadas);
  }, [categoriasSeleccionadas]);

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

  // Cerrar dropdown solo cuando hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Notificar al parent cuando se cierra el dropdown
        onChange(localSeleccionadas);
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, localSeleccionadas, onChange]);

  // Manejar tecla Enter para cerrar dropdown y cargar filtros
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isOpen) {
        event.preventDefault();
        onChange(localSeleccionadas);
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, localSeleccionadas, onChange]);

  const handleCategoriaChange = useCallback((nombre: string) => {
    setLocalSeleccionadas(prev => {
      if (prev.includes(nombre)) {
        return prev.filter((c) => c !== nombre);
      } else {
        return [...prev, nombre];
      }
    });
  }, []);

  const handleCheckboxClick = useCallback((e: React.ChangeEvent<HTMLInputElement>, nombre: string) => {
    e.stopPropagation();
    handleCategoriaChange(nombre);
  }, [handleCategoriaChange]);

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  const handleLimpiarClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLocalSeleccionadas([]);
    onChange([]);
  }, [onChange]);

  const cursos = categorias.filter((c) => c.tipo === "curso");
  const materias = categorias.filter((c) => c.tipo === "materia");
  const dificultades = categorias.filter((c) => c.tipo === "dificultad");

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        className="w-full border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#003c71] bg-white text-left flex justify-between items-center pointer-events-auto hover:border-[#003c71] transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          {localSeleccionadas.length === 0
            ? "Categorías"
            : `${localSeleccionadas.length} seleccionada${localSeleccionadas.length > 1 ? "s" : ""}`}
        </span>
        <svg className="w-4 h-4 text-[#003c71]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M19 14l-7-7m0 0L5 14m7-7v12" : "M5 10l7 7 7-7"} />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Cursos */}
          {cursos.length > 0 && (
            <div className="border-b border-gray-200">
              <div className="bg-blue-50 px-4 py-3 border-l-4 border-blue-500">
                <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  Cursos
                </h3>
              </div>
              <div className="px-4 py-3 space-y-3">
                {cursos.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={localSeleccionadas.includes(cat.nombre)}
                      onChange={(e) => handleCheckboxClick(e, cat.nombre)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">{cat.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Materias */}
          {materias.length > 0 && (
            <div className="border-b border-gray-200">
              <div className="bg-green-50 px-4 py-3 border-l-4 border-green-500">
                <h3 className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  Materias
                </h3>
              </div>
              <div className="px-4 py-3 space-y-3">
                {materias.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={localSeleccionadas.includes(cat.nombre)}
                      onChange={(e) => handleCheckboxClick(e, cat.nombre)}
                      className="w-4 h-4 accent-green-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">{cat.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Dificultades */}
          {dificultades.length > 0 && (
            <div>
              <div className="bg-orange-50 px-4 py-3 border-l-4 border-orange-500">
                <h3 className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  Dificultades
                </h3>
              </div>
              <div className="px-4 py-3 space-y-3">
                {dificultades.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={localSeleccionadas.includes(cat.nombre)}
                      onChange={(e) => handleCheckboxClick(e, cat.nombre)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-medium">{cat.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Botón limpiar */}
          {localSeleccionadas.length > 0 && (
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <button
                onClick={handleLimpiarClick}
                className="w-full text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const FiltroCategoria = memo(FiltroCategoriaComponent);

export function FiltroFecha({ fechaSeleccionada, onChange }: FiltroFechaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const opciones = [
    { label: "Hoy", value: "hoy" },
    { label: "Esta semana", value: "semana" },
    { label: "Este mes", value: "mes" },
    { label: "De más nuevo a más antiguo", value: "nuevo_antiguo" },
    { label: "De más antiguo a más nuevo", value: "antiguo_nuevo" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full flex relative">
      <select
        aria-label="Filtrar por fecha"
        value={fechaSeleccionada}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="w-full border-2 border-gray-200 rounded-full px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#003c71] bg-white hover:border-[#003c71] transition-colors appearance-none pr-10"
      >
        <option value="">📅 Fecha</option>
        {opciones.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#003c71] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M19 14l-7-7m0 0L5 14m7-7v12" : "M5 10l7 7 7-7"} />
      </svg>
    </div>
  );
}
