"use client";

export default function SkeletonPerfil() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center animate-pulse">

      {/* Sección superior */}
      <div className="w-full flex flex-col items-center text-center p-[60px_170px] relative">

        {/* Contenedor info */}
        <div className="flex items-center justify-center gap-10 text-left text-2xl font-roboto">

          {/* Avatar */}
          <div className="w-[120px] h-[120px] rounded-full bg-gray-200 border border-gray-300" />

          {/* Textos */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-48 h-6 bg-gray-200 rounded" />
            <div className="w-64 h-4 bg-gray-200 rounded" />
            <div className="w-80 h-3 bg-gray-200 rounded mt-2" />
          </div>

          {/* Botones (placeholder) */}
          <div className="flex flex-col items-start gap-3">
            <div className="w-[160px] h-[48px] bg-gray-200 rounded-lg" />
            <div className="w-[160px] h-[48px] bg-gray-200 rounded-lg" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200" />
      </div>

      {/* Menú de secciones */}
      <div className="w-full max-w-[1200px] flex justify-end py-8 pr-[90px]">
        <div className="flex items-center gap-4 text-center">

          <div className="w-28 h-10 bg-gray-200 rounded shadow-sm" />
          <div className="w-28 h-10 bg-gray-200 rounded shadow-sm" />
          <div className="w-28 h-10 bg-gray-200 rounded shadow-sm" />

          <div className="w-32 h-10 bg-gray-200 rounded shadow-sm" />
        </div>
      </div>
    </div>
  );
}
