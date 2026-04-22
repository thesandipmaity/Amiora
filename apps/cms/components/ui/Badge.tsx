import { type ReactNode } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'

const variants: Record<Variant, string> = {
  default: 'bg-surface text-ink-muted',
  success: 'bg-green-50  text-green-700  border-green-200',
  warning: 'bg-amber-50  text-amber-700  border-amber-200',
  error:   'bg-red-50    text-red-700    border-red-200',
  info:    'bg-blue-50   text-blue-700   border-blue-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-200',
}

export function Badge({ children, variant = 'default', className = '' }: { children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    pending:           'warning',
    confirmed:         'info',
    processing:        'info',
    shipped:           'purple',
    delivered:         'success',
    cancelled:         'error',
    active:            'success',
    inactive:          'default',
    approved:          'success',
    rejected:          'error',
    booked_for_pickup: 'info',
    called:            'success',
    completed:         'success',
  }
  return <Badge variant={map[status] ?? 'default'}>{status.replace(/_/g, ' ')}</Badge>
}
