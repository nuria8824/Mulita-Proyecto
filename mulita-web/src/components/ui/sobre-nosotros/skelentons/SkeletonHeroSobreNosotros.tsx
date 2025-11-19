"use client";

export default function SkeletonHeroSobreNosotros() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-[167px] py-16 bg-white gap-10 animate-pulse">
      
      {/* Texto */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
        {/* Título */}
        <div className="h-10 w-64 bg-gray-300 rounded mb-4"></div>

        {/* Descripción */}
        <div className="h-4 w-80 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-72 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center md:justify-start">
          <div className="h-12 w-40 bg-gray-300 rounded"></div>
          <div className="h-12 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Imagen */}
      <div className="w-full md:w-[564px] h-[300px] bg-gray-300 rounded-lg"></div>
    </section>
  );
}
