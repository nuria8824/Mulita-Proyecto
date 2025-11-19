"use client";

export default function SkeletonMisionVision() {
  return (
    <section className="flex flex-col items-center w-full px-6 md:px-20 lg:px-40 py-16 gap-12 bg-white animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 w-full">

        {/* Misión skeleton */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full lg:w-1/2">
          {/* Título */}
          <div className="h-6 w-40 bg-gray-300 rounded"></div>

          {/* Texto */}
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>

          {/* Imagen */}
          <div className="w-full h-[250px] bg-gray-300 rounded-lg mt-4"></div>
        </div>

        {/* Visión skeleton */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full lg:w-1/2">

          {/* Imagen */}
          <div className="w-full h-[250px] bg-gray-300 rounded-lg"></div>

          {/* Título */}
          <div className="h-6 w-40 bg-gray-300 rounded mt-5"></div>

          {/* Texto */}
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>

        </div>

      </div>
    </section>
  );
}
