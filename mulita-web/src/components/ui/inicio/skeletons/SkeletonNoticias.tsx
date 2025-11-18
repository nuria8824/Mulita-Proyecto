export function SkeletonNoticias() {
  return (
    <section className="mt-24 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Título */}
        <div className="h-8 w-48 bg-gray-300 mx-auto rounded"></div>
        <div className="h-4 w-72 bg-gray-200 mx-auto rounded mt-3"></div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div 
              key={i} 
              className="rounded-xl border border-light bg-card p-5 space-y-4"
            >
              <div className="w-full aspect-video bg-gray-200 rounded-lg"></div>
              <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
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
