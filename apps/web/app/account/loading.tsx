export default function AccountLoading() {
  return (
    <div className="space-y-4 max-w-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-10 w-full rounded-lg" />
        </div>
      ))}
      <div className="skeleton h-10 w-32 rounded-lg mt-4" />
    </div>
  )
}
