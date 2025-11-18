export function SkeletonHero() {
  return (
    <section className="relative animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 items-center gap-10 pt-16 md:pt-24">
          
          {/* Texto */}
          <div className="order-2 md:order-1 space-y-4">
            <div className="h-2 w-16 bg-gray-300 rounded-full"></div>
            <div className="h-10 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>

            <div className="mt-6 flex gap-4">
              <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Imagen */}
          <div className="order-2 relative flex items-center justify-center">
            <div className="w-80 h-80 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
