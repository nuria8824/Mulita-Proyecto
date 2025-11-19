"use client";

export default function SkeletonActividades() {
  return (
    <div className="w-full flex flex-col items-center py-10 px-4 animate-pulse">
      {/* Título */}
      <div className="h-8 w-48 bg-gray-200 rounded mb-8" />

      {/* FILTROS + BÚSQUEDA */}
      <div className="w-full max-w-xl mb-6 flex flex-col sm:flex-row gap-3 items-center">
        <div className="w-full h-10 bg-gray-200 rounded-full" />
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="w-32 h-10 bg-gray-200 rounded-full" />
          <div className="w-32 h-10 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* TARJETAS DE ACTIVIDAD (x3) */}
      <div className="flex flex-col gap-8 max-w-xl w-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full bg-white rounded-2xl shadow border border-gray-200 p-5 flex flex-col gap-4"
          >
            {/* CABECERA */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
                  <div className="w-20 h-3 bg-gray-200 rounded" />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-14 h-6 bg-gray-200 rounded-full" />
                <div className="w-14 h-6 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* TEXTO */}
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-5/6 h-4 bg-gray-200 rounded" />

            {/* IMAGEN */}
            <div className="w-full h-56 bg-gray-200 rounded-lg" />

            {/* ACCIONES */}
            <div className="flex justify-between items-center mt-2">
              <div className="w-20 h-6 bg-gray-200 rounded" />
              <div className="w-24 h-6 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
