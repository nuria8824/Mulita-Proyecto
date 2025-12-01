"use client";

import { useEffect, useState } from "react";

interface Documento {
  id: number;
  tipo: "link" | "archivo" | "imagen";
  url: string;
  descripcion: string;
  nombre: string;
}

interface DocumentacionData {
  id: number;
  titulo: string;
  descripcion: string;
  documentos: Documento[];
}

export function Documentacion() {
  const [data, setData] = useState<DocumentacionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inicio/documentacion")
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Cargando documentación...</p>;
  if (!data) return <p className="p-4">No hay documentación disponible.</p>;

  const documentosNoImagen = data.documentos.filter(doc => doc.tipo !== "imagen");
  const documentosImagen = data.documentos.filter(doc => doc.tipo === "imagen");

  return (
    <div className="w-full flex flex-col items-center px-6 md:px-20 lg:px-40 py-16 bg-white">

      {/* TITULO Y DESCRIPCION CENTRADOS */}
      <div className="flex flex-col items-center text-center mt-8 mb-10">
        <h2 className="text-[#003c71] font-extrabold text-3xl md:text-4xl">{data.titulo}</h2>
        <p className="max-w-2xl text-base md:text-lg leading-6 mt-4 text-gray-600">
          {data.descripcion}
        </p>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* CONTENEDOR DE DOCUMENTOS E IMÁGENES */}
      <div className="flex flex-col md:flex-row gap-6 w-full">

        {/* COLUMNA LINKS Y ARCHIVOS */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {documentosNoImagen.map(doc => (
            <div
              key={doc.id}
              className="p-4 rounded-lg border bg-white border-gray-300 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <p className="text-sm text-gray-600 mb-1">{doc.descripcion}</p>

              {doc.tipo === "link" && (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {doc.url}
                </a>
              )}

              {doc.tipo === "archivo" && (
                <a
                  href={doc.url}
                  download={doc.nombre}
                  className="text-blue-600 underline text-sm"
                >
                  {doc.nombre || "Descargar archivo"}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* COLUMNA IMÁGENES */}
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
          {documentosImagen.map(doc => (
            <div
              key={doc.id}
              className="w-full h-48 overflow-hidden flex items-center justify-center rounded-lg"
            >
              <img
                src={doc.url}
                alt={doc.nombre}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
