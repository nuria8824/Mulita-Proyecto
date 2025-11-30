export default function ComentarioSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-b border-gray-100 pb-2 flex gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>

          <div className="flex-1 space-y-2">
            {/* Nombre */}
            <div className="h-3 w-32 bg-gray-300 rounded"></div>
            {/* Contenido */}
            <div className="h-3 w-full bg-gray-300 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
