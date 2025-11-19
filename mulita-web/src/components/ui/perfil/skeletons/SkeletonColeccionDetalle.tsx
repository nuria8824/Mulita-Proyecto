export default function SkeletonColeccionDetalle() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Título */}
      <div className="h-7 w-64 bg-gray-300 rounded animate-pulse mb-6"></div>

      {/* Lista de actividades skeleton */}
      <div className="flex flex-col gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full bg-white rounded-2xl shadow border border-gray-200 p-5 animate-pulse flex flex-col gap-4"
          >
            {/* Cabecera */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>

                {/* Nombre + fecha */}
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  <div className="h-3 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>

              {/* Categorías + menú */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
                <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Título */}
            <div className="h-5 w-1/2 bg-gray-300 rounded"></div>

            {/* Descripción */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="h-3 w-full bg-gray-300 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
              <div className="h-3 w-4/6 bg-gray-300 rounded"></div>
            </div>

            {/* Archivos (simulados) */}
            <div className="h-4 w-40 bg-gray-300 rounded"></div>

            {/* Galería 3 imágenes */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="aspect-square w-full bg-gray-300 rounded"></div>
              <div className="aspect-square w-full bg-gray-300 rounded"></div>
              <div className="aspect-square w-full bg-gray-300 rounded"></div>
            </div>

            {/* Zona de comentarios */}
            <div className="h-4 w-24 bg-gray-300 rounded mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
