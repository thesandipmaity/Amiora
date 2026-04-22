export default function ProductLoading() {
  return (
    <div className="section-x py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image gallery skeleton */}
        <div className="space-y-3">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton w-16 h-16 rounded-lg" />
            ))}
          </div>
        </div>
        {/* Product info skeleton */}
        <div className="space-y-4">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-8 w-4/5 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-10 w-48 rounded" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-full rounded-lg" />
            ))}
          </div>
          <div className="flex gap-3">
            <div className="skeleton h-12 flex-1 rounded-lg" />
            <div className="skeleton h-12 flex-1 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
