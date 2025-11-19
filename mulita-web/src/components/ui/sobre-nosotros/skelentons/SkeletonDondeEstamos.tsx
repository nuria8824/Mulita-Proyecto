"use client";

export default function SkeletonDondeEstamos() {
  return (
    <section className="w-full flex flex-col items-center px-6 md:px-20 lg:px-40 py-16 animate-pulse">
      {/* Encabezado */}
      <div className="text-center w-full max-w-lg">
        <div className="h-8 w-48 bg-gray-300 rounded mx-auto mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded mx-auto"></div>
        <div className="w-16 h-1 bg-gray-300 mx-auto mt-5 rounded-full"></div>
      </div>

      {/* Galería */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-[1100px]">
        
        {/* Columna 1 */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[1/1] bg-gray-300 rounded-lg"></div>
          <div className="aspect-[1/1] bg-gray-300 rounded-lg"></div>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[354/477] bg-gray-300 rounded-lg"></div>
          <div className="aspect-[354/231] bg-gray-300 rounded-lg"></div>
        </div>

        {/* Columna 3 */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[354/231] bg-gray-300 rounded-lg"></div>
          <div className="aspect-[354/469] bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </section>
  );
}
