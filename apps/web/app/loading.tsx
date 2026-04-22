export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-gold-500/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold-500" />
        </div>
        <p className="font-display text-sm tracking-widest text-gold-500 uppercase animate-pulse">
          Amiora
        </p>
      </div>
    </div>
  )
}
