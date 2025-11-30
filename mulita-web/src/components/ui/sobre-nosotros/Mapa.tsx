"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Iconos faltantes de Leaflet
const icon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Mapa() {
  const mapRef = useRef<HTMLDivElement>(null);

  const LAT = -32.073393;
  const LON = -60.467044;

  useEffect(() => {
    if (!mapRef.current) return;

    // Crear mapa
    const map = L.map(mapRef.current).setView([LAT, LON], 16);

    // Tiles oficiales de OpenStreetMap
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Marcador
    L.marker([LAT, LON], { icon }).addTo(map);

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    />
  );
}
