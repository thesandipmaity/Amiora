'use client'

import { useEffect } from 'react'
import { Button } from '@amiora/ui'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 section-padding">
      <h1 className="font-display text-4xl text-foreground">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-center">
        We encountered an unexpected error. Please try again or contact support.
      </p>
      <Button variant="gold" onClick={reset}>
        Try Again
      </Button>
    </div>
  )
}
