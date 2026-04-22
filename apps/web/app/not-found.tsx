import Link from 'next/link'
import { Button } from '@amiora/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 section-padding text-center">
      <p className="font-display text-8xl font-light text-gold-500">404</p>
      <h1 className="font-display text-3xl">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button variant="gold" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
