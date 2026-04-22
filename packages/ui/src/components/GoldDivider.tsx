import * as React from 'react'
import { cn } from '../lib/utils'

interface GoldDividerProps {
  className?: string
  label?: string
}

export function GoldDivider({ className, label }: GoldDividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-4 my-8', className)}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        <span className="text-gold-500 font-display text-sm tracking-widest uppercase">{label}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'h-px w-full bg-gradient-to-r from-transparent via-gold-500/60 to-transparent my-8',
        className
      )}
    />
  )
}
