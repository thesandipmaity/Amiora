import { cn } from '@amiora/ui'

interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton',
        {
          'rounded-sm':   rounded === 'sm',
          'rounded-md':   rounded === 'md',
          'rounded-lg':   rounded === 'lg',
          'rounded-full': rounded === 'full',
        },
        className
      )}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full" rounded="lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  )
}

export function CollectionCardSkeleton() {
  return <Skeleton className="aspect-[3/4] w-full" rounded="lg" />
}
