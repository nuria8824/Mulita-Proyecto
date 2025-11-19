export function SkeletonActividadesUsuario() {
  return (
    <div className="w-full flex flex-col items-center py-6 px-4 md:px-0">
      <h2 className="text-3xl font-bold mb-8 text-[#003c71] text-center animate-pulse">
        Cargando actividades...
      </h2>

      <div className="flex flex-col gap-8 max-w-2xl w-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full bg-white rounded-2xl shadow border border-gray-200 p-5 flex flex-col gap-4"
          >
            {/* Cabecera */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />

                <div className="flex flex-col gap-2">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Título */}
            <div className="w-40 h-5 bg-gray-200 rounded animate-pulse" />

            {/* Descripción */}
            <div className="flex flex-col gap-2">
              <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Imagen principal */}
            <div className="w-full h-60 bg-gray-200 rounded-xl animate-pulse" />

            {/* Categorías */}
            <div className="flex gap-2 mt-2">
              <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* Footer: likes + comentarios */}
            <div className="flex justify-between mt-3">
              <div className="w-10 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
