export default function SkeletonEditarActividad() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center py-12 px-4 bg-white">
      <div className="w-full max-w-3xl flex flex-col gap-6 animate-pulse">
        
        {/* Título principal */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-6 w-40 bg-gray-300 rounded-md"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
        </div>

        {/* Contenedor formulario */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">

          {/* Campo Título */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-24 bg-gray-300 rounded-md"></div>
            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
          </div>

          {/* Campo Descripción */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-28 bg-gray-300 rounded-md"></div>
            <div className="h-32 w-full bg-gray-200 rounded-md"></div>
          </div>

          {/* Categorías */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-28 bg-gray-300 rounded-md"></div>
            <div className="flex flex-wrap gap-3 p-2 border border-gray-200 rounded-md">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-32 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Archivos actuales */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-36 bg-gray-300 rounded-md"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-gray-100 border rounded-md"
                >
                  <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                  <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Subir nuevos archivos */}
          <div className="flex flex-col gap-2">
            <div className="h-5 w-40 bg-gray-300 rounded-md"></div>
            <div className="h-32 w-full border-2 border-dashed border-gray-300 rounded-md bg-gray-100"></div>

            {/* Archivos nuevos preview */}
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-gray-100 border rounded-md"
                >
                  <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                  <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            <div className="h-10 w-28 bg-gray-300 rounded-md"></div>
            <div className="h-10 w-28 bg-gray-300 rounded-md"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
