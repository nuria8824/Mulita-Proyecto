"use client";

export default function SkeletonHero() {
  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl flex flex-col gap-6 animate-pulse">

        {/* Título */}
        <div className="h-8 w-48 bg-gray-300 rounded-md mx-auto" />

        <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">

          {/* Input Título */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-24 bg-gray-300 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded-md" />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-32 bg-gray-300 rounded" />
            <div className="h-32 w-full bg-gray-200 rounded-md" />
          </div>

          {/* Imagen */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-40 bg-gray-300 rounded" />
            <div className="h-48 w-full bg-gray-200 rounded-md" />
            <div className="h-10 w-full bg-gray-200 rounded-md" />
          </div>

          {/* Botones */}
          <div className="flex w-full gap-4">
            <div className="w-1/2 h-12 bg-gray-200 rounded-md" />
            <div className="w-1/2 h-12 bg-gray-300 rounded-md" />
          </div>

        </div>
      </div>
    </div>
  );
}
