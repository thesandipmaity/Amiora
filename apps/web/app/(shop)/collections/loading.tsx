export default function CollectionsLoading() {
  return (
    <div className="section-x py-10">
      <div className="skeleton h-8 w-48 rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
