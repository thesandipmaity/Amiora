import { Star } from 'lucide-react'
import { cn } from '@amiora/ui'

interface StarRatingProps {
  rating: number          // 0–5 (supports decimals)
  count?: number
  size?: 'sm' | 'md'
  className?: string
  showCount?: boolean
}

export function StarRating({
  rating,
  count,
  size = 'sm',
  className,
  showCount = true,
}: StarRatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= Math.floor(rating)
          const half   = !filled && i < rating

          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled
                  ? 'fill-gold text-gold'
                  : half
                  ? 'fill-gold/50 text-gold'
                  : 'fill-none text-ink-faint'
              )}
            />
          )
        })}
      </div>
      {showCount && count != null && (
        <span className="text-xs text-ink-muted">({count})</span>
      )}
    </div>
  )
}
