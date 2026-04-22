export default function ShopLoading() {
  return (
    <div className="section-x py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter sidebar skeleton */}
        <div className="hidden lg:block space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-4 w-24 rounded" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="skeleton h-8 w-full rounded" />
              ))}
            </div>
          ))}
        </div>
        {/* Product grid skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton aspect-square rounded-xl" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
