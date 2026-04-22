'use client'

import { useRef, useTransition } from 'react'
import { useRouter }             from 'next/navigation'
import { Search, X, Loader2 }   from 'lucide-react'

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router          = useRouter()
  const inputRef        = useRef<HTMLInputElement>(null)
  const [pending, start] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputRef.current?.value.trim() ?? ''
    if (!q) return
    start(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`)
    })
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = ''
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <span className="absolute left-4 text-ink-faint pointer-events-none">
        {pending
          ? <Loader2 className="h-4 w-4 animate-spin text-teal" />
          : <Search className="h-4 w-4" />}
      </span>

      <input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus={!defaultValue}
        placeholder="Search jewellery…"
        className="w-full h-12 pl-11 pr-12 rounded-full border border-divider bg-bg text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all"
      />

      {defaultValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-14 text-ink-faint hover:text-ink transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <button
        type="submit"
        disabled={pending}
        className="absolute right-2 h-8 px-4 rounded-full bg-deep-teal text-cream text-xs font-medium tracking-wide hover:bg-teal transition-colors disabled:opacity-60"
      >
        Search
      </button>
    </form>
  )
}
