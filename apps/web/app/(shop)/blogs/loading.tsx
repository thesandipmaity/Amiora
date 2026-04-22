export default function BlogsLoading() {
  return (
    <div className="section-x py-10">
      <div className="skeleton h-8 w-48 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton aspect-video rounded-xl" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
            <div className="skeleton h-4 w-3/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
