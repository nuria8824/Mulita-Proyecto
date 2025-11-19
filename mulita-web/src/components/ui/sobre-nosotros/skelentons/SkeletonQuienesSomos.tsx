"use client";

export default function SkeletonQuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="w-full flex flex-col items-center px-6 md:px-20 lg:px-40 py-16 bg-white animate-pulse"
    >
      {/* Título */}
      <div className="flex flex-col items-center text-center">
        <div className="h-8 w-56 bg-gray-300 rounded"></div>

        {/* Descripción 1 */}
        <div className="max-w-md mt-6 space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Línea amarilla */}
      <div className="w-20 h-1 bg-gray-300 rounded my-12"></div>

      <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-center w-full">

        {/* Bloque 1 */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full sm:w-[90%] md:w-[45%] max-w-[541px]">
          {/* Imagen */}
          <div className="w-full h-[250px] md:h-[350px] bg-gray-300"></div>

          <div className="flex flex-col p-4 gap-3">
            {/* Título */}
            <div className="h-5 w-40 bg-gray-300 rounded"></div>

            {/* Texto */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Bloque 2 */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full sm:w-[90%] md:w-[45%] max-w-[541px]">
          {/* Imagen */}
          <div className="w-full h-[250px] md:h-[350px] bg-gray-300"></div>

          <div className="flex flex-col p-4 gap-3">
            {/* Título */}
            <div className="h-5 w-40 bg-gray-300 rounded"></div>

            {/* Texto */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
