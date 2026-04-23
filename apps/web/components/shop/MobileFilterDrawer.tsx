'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'

export function MobileFilterDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm border border-divider rounded-md text-ink-muted hover:border-teal hover:text-teal transition-colors"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-[min(20rem,100vw)] bg-bg p-6 overflow-y-auto transition-transform duration-300 ease-premium ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <FilterSidebar onClose={() => setOpen(false)} />
      </div>
    </>
  )
}
