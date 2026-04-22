export default function Loading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-24 bg-gray-200 rounded-lg" />
        <div className="h-9 w-32 bg-gray-100 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-gray-50 last:border-0">
            <div className="h-4 w-28 bg-gray-100 rounded" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 bg-gray-100 rounded" />
              <div className="h-3 w-24 bg-gray-50 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-5 w-20 bg-gray-100 rounded-full" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
