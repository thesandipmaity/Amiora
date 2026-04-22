import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title:   string
  value:   string | number
  icon:    LucideIcon
  change?: number
  sub?:    string
  color?:  'teal' | 'gold' | 'sand' | 'deep-teal'
}

const colors: Record<string, string> = {
  teal:       'bg-teal/10 text-teal',
  gold:       'bg-gold/10 text-gold',
  sand:       'bg-sand/10 text-sand',
  'deep-teal':'bg-deep-teal/10 text-deep-teal',
}

export function StatCard({ title, value, icon: Icon, change, sub, color = 'teal' }: StatCardProps) {
  const positive = change !== undefined && change >= 0
  return (
    <div className="bg-white rounded-xl p-5 border border-divider shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
            {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="mt-4 text-2xl font-display font-medium text-ink">{value}</p>
      <p className="text-sm text-ink-muted mt-0.5">{title}</p>
      {sub && <p className="text-xs text-ink-faint mt-1">{sub}</p>}
    </div>
  )
}
