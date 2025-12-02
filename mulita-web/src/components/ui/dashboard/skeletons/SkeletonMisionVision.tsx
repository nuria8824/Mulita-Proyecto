"use client";

export default function SkeletonMisionVision() {
  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center py-12 px-4 text-[#003c71] animate-pulse">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        
        {/* Título */}
        <div className="mx-auto">
          <div className="h-6 w-64 bg-gray-300 rounded"></div>
        </div>

        <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">

          {/* Bloque 1 */}
          <div>
            <div className="h-5 w-32 bg-gray-300 rounded mb-4"></div>

            <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>

            <div className="h-5 w-28 bg-gray-300 rounded mt-4 mb-2"></div>
            <div className="h-24 w-full bg-gray-200 rounded"></div>

            <div className="h-5 w-20 bg-gray-300 rounded mt-4 mb-2"></div>
            <div className="w-full h-48 bg-gray-200 rounded mb-2"></div>

            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          {/* Bloque 2 */}
          <div className="border-t border-gray-300 pt-6">
            <div className="h-5 w-40 bg-gray-300 rounded mb-4"></div>

            <div className="h-5 w-24 bg-gray-300 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>

            <div className="h-5 w-28 bg-gray-300 rounded mt-4 mb-2"></div>
            <div className="h-24 w-full bg-gray-200 rounded"></div>

            <div className="h-5 w-20 bg-gray-300 rounded mt-4 mb-2"></div>
            <div className="w-full h-48 bg-gray-200 rounded mb-2"></div>

            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          <div className="flex w-full gap-4 pt-4">
            <div className="w-1/2 h-12 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-12 bg-gray-300 rounded"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
