"use client";

export default function SkeletonNoticiaDetalle() {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 md:px-16">
      <div className="shadow-lg border border-gray-200 overflow-hidden flex flex-col gap-6 p-6 rounded-lg bg-white animate-pulse">
        
        {/* Título */}
        <div className="h-10 w-3/4 bg-gray-200 rounded" />

        {/* Autor + fecha */}
        <div className="h-4 w-40 bg-gray-200 rounded" />

        {/* Introducción */}
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />

        {/* Imagen */}
        <div className="w-full h-64 bg-gray-200 rounded-lg" />

        {/* Descripción */}
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-[90%] bg-gray-200 rounded" />
        <div className="h-4 w-[80%] bg-gray-200 rounded" />
        <div className="h-4 w-[70%] bg-gray-200 rounded" />

        {/* Botón archivo */}
        <div className="h-5 w-40 bg-gray-200 rounded mt-4" />
      </div>
    </div>
  );
}
