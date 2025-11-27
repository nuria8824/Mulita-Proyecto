"use client";

import { useState, useEffect } from "react";

export type Lugar = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function UbicacionInput({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (lugar: Lugar) => void;
}) {
  const [query, setQuery] = useState(value);
  const [resultados, setResultados] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );

      const data = await res.json();
      setResultados(data);
      setLoading(false);
    }, 400); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar ubicación..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
      />

      {loading && <p className="text-sm text-gray-400">Buscando...</p>}

      {resultados.length > 0 && (
        <div className="absolute bg-white border rounded-md shadow-lg z-50 w-full max-h-60 overflow-auto">
          {resultados.map((lugar, index) => (
            <button
              key={index}
              className="text-left w-full px-3 py-2 hover:bg-gray-100"
              onClick={() => {
                setQuery(lugar.display_name);
                setResultados([]);
                onSelect(lugar);
              }}
            >
              {lugar.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
