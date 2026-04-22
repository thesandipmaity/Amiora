import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#eee8df] flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="mb-10 text-center">
        <p className="font-display text-4xl tracking-[0.3em] text-deep-teal">AMIORA</p>
        <p className="text-[10px] tracking-[0.4em] uppercase text-ink-faint mt-1">Diamonds &amp; Fine Jewellery</p>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/5 border border-white p-8">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-ink-faint text-center">
        © {new Date().getFullYear()} AMIORA Diamonds. All rights reserved.
      </p>
    </div>
  )
}
