export default function Loading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 bg-gray-200 rounded-lg" />
        <div className="h-9 w-32 bg-gray-200 rounded-lg" />
      </div>
      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-200 pb-0">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-100 rounded" />
        ))}
      </div>
      {/* Rows */}
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <div className="h-4 w-4 bg-gray-100 rounded" />
            <div className="flex-1 h-4 bg-gray-100 rounded" />
            <div className="h-4 w-28 bg-gray-100 rounded" />
            <div className="h-5 w-14 bg-gray-100 rounded-full" />
            <div className="h-7 w-16 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
