export function SkeletonProductos() {
  return (
    <section className="mt-24 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Título */}
        <div className="text-center mb-12">
          <div className="h-8 w-48 bg-gray-300 mx-auto rounded"></div>
          <div className="h-4 w-72 bg-gray-200 mx-auto rounded mt-4"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,280px))] gap-6 justify-center">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-xl border border-light bg-card p-5 space-y-4">

              {/* Imagen */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                <div className="absolute top-3 right-3 h-6 w-16 bg-gray-300 rounded"></div>
                <div className="w-full h-full bg-gray-200"></div>
              </div>

              {/* Texto */}
              <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>

              {/* Botones */}
              <div className="flex gap-2 pt-2">
                <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="h-10 w-40 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </section>
  );
}
