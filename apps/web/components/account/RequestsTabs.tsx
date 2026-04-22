'use client'

import { useState } from 'react'

const STATUS_STYLE: Record<string, string> = {
  pending:       'bg-yellow-50 text-yellow-700',
  reviewing:     'bg-blue-50 text-blue-700',
  possible:      'bg-green-50 text-green-700',
  not_possible:  'bg-red-50 text-red-500',
  confirmed:     'bg-teal/10 text-teal',
  completed:     'bg-green-100 text-green-700',
  cancelled:     'bg-red-50 text-red-500',
}

interface CustomizationRequest {
  id: string; description: string; status: string; admin_reply: string | null; created_at: string
}
interface CallbackRequest {
  id: string; name: string; phone: string; preferred_time: string | null; status: string; created_at: string
}
interface DemoRequest {
  id: string; type: string; status: string; notes: string | null; created_at: string
}

interface Props {
  customizations: CustomizationRequest[]
  callbacks:      CallbackRequest[]
  demos:          DemoRequest[]
}

const TABS = ['Customization', 'Callbacks', 'Demo Requests']

export function RequestsTabs({ customizations, callbacks, demos }: Props) {
  const [tab, setTab] = useState(0)

  return (
    <div>
      <div className="flex gap-0 border-b border-divider mb-6">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-5 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
              tab === i ? 'border-teal text-teal font-medium' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {t}
            <span className="ml-1.5 text-2xs">
              ({[customizations.length, callbacks.length, demos.length][i]})
            </span>
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="space-y-4">
          {customizations.length === 0 ? <Empty label="No customization requests yet." /> : customizations.map((r) => (
            <RequestCard key={r.id} date={r.created_at} status={r.status} title="Customization Request">
              <p className="text-sm text-ink-muted">{r.description}</p>
              {r.admin_reply && (
                <div className="mt-3 p-3 bg-teal/5 rounded-lg border-l-2 border-teal">
                  <p className="text-xs uppercase tracking-widest text-teal mb-1">Admin Reply</p>
                  <p className="text-sm text-ink">{r.admin_reply}</p>
                </div>
              )}
            </RequestCard>
          ))}
        </div>
      )}

      {tab === 1 && (
        <div className="space-y-4">
          {callbacks.length === 0 ? <Empty label="No callback requests yet." /> : callbacks.map((r) => (
            <RequestCard key={r.id} date={r.created_at} status={r.status} title={`Callback for ${r.name}`}>
              <p className="text-sm text-ink-muted">Phone: {r.phone}</p>
              {r.preferred_time && <p className="text-xs text-ink-faint mt-1">Preferred: {r.preferred_time}</p>}
            </RequestCard>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className="space-y-4">
          {demos.length === 0 ? <Empty label="No demo requests yet." /> : demos.map((r) => (
            <RequestCard key={r.id} date={r.created_at} status={r.status} title={`Demo Request — ${r.type}`}>
              {r.notes && <p className="text-sm text-ink-muted">{r.notes}</p>}
            </RequestCard>
          ))}
        </div>
      )}
    </div>
  )
}

function RequestCard({ title, date, status, children }: { title: string; date: string; status: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <p className="font-medium text-ink">{title}</p>
        <span className={`text-2xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${STATUS_STYLE[status] ?? 'bg-surface-2 text-ink-muted'}`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>
      {children}
      <p className="text-xs text-ink-faint">{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>
  )
}

function Empty({ label }: { label: string }) {
  return <p className="py-10 text-center text-ink-muted text-sm">{label}</p>
}
