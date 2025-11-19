export default function SkeletonColeccionesUsuario() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="animate-pulse flex flex-col gap-4 p-6 rounded-2xl shadow-md border border-gray-200 bg-white"
        >
          {/* Fecha */}
          <div className="flex justify-between items-center w-full mb-2">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>

          {/* Título */}
          <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
}
