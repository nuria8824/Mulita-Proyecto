export default function SkeletonProductos() {
  return (
    <div className="w-full max-w-7xl mx-auto animate-pulse">
      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm p-4"
          >
            {/* Imagen */}
            <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>

            {/* Título */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

            {/* Precio */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

            {/* Botón */}
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
