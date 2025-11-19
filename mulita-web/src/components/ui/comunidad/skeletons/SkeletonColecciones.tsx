export default function SkeletonColecciones() {
  return (
    <div className="animate-pulse space-y-2 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-2 border-b border-gray-200"
        >
          {/* Nombre */}
          <div className="h-3 w-32 bg-gray-300 rounded"></div>

          {/* Checkbox */}
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
}
