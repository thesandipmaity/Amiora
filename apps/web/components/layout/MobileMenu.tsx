'use client'

import Link from 'next/link'
import { X, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

const LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Shop All',    href: '/shop' },
  { label: 'Rings',       href: '/categories/rings' },
  { label: 'Necklaces',   href: '/categories/necklaces' },
  { label: 'Earrings',    href: '/categories/earrings' },
  { label: 'Bangles',     href: '/categories/bangles' },
  { label: 'About Us',    href: '/about' },
  { label: 'Blogs',       href: '/blogs' },
  { label: 'Stores',      href: '/stores' },
  { label: 'Customization', href: '/customization' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-[80vw] max-w-sm bg-bg flex flex-col transition-transform duration-300 ease-premium ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-divider">
          <span className="font-display text-xl text-deep-teal tracking-widest">AMIORA</span>
          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-deep-teal transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between px-6 py-3.5 text-base text-ink hover:bg-surface hover:text-deep-teal transition-colors group"
            >
              {link.label}
              <ChevronRight className="h-4 w-4 text-ink-faint group-hover:text-teal transition-colors" />
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-divider px-6 py-6 space-y-3">
          <Link
            href="/account"
            onClick={onClose}
            className="block text-center w-full py-3 text-sm font-medium bg-deep-teal text-cream rounded-md hover:bg-teal transition-colors"
          >
            Sign In / Register
          </Link>
          <Link
            href="/customization"
            onClick={onClose}
            className="block text-center w-full py-3 text-sm border border-deep-teal text-deep-teal rounded-md hover:bg-surface transition-colors"
          >
            Custom Jewellery
          </Link>
        </div>
      </div>
    </>
  )
}
