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

  // Flag para evitar que el useEffect vuelva a buscar al seleccionar
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    // Si estoy seleccionando, no ejecuto el autocomplete
    if (isSelecting) return;

    if (query.length < 3) {
      setResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&limit=5&lang=es&filter=countrycode:ar&apiKey=${
          process.env.NEXT_PUBLIC_GEOAPIFY_KEY
        }`
      );

      const data = await res.json();

      const lugares: Lugar[] = data.features.map((f: any) => ({
        display_name: f.properties.formatted,
        lat: String(f.properties.lat),
        lon: String(f.properties.lon),
      }));

      setResultados(lugares);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, isSelecting]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar ubicación..."
        value={query}
        onChange={(e) => {
          setIsSelecting(false); // si el usuario vuelve a tipear, vuelvo al modo "buscar"
          setQuery(e.target.value);
        }}
        className="w-full border px-3 py-2 rounded-md"
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {resultados.length > 0 && (
        <div className="absolute bg-white border rounded-md shadow-lg z-50 w-full max-h-60 overflow-auto">
          {resultados.map((lugar, index) => (
            <button
              key={index}
              className="text-left w-full px-3 py-2 hover:bg-gray-100"
              onClick={() => {
                setIsSelecting(true);
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
