"use client";

export default function SkeletonNoticias() {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-start px-4 md:px-16 lg:px-24 gap-10">
      {/* Encabezado Skeleton */}
      <div className="w-full text-center">
        <div className="mx-auto h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="mx-auto mt-2 h-4 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="mx-auto mt-3 w-20 border-t-4 border-gray-200 animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="relative shadow-lg rounded-lg border border-[#e1e4ed] overflow-hidden flex flex-col animate-pulse"
          >
            {/* Imagen */}
            <div className="w-full h-48 bg-gray-200" />

            {/* Texto */}
            <div className="p-4 flex flex-col gap-3">
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
