'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm }    from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }          from 'zod'
import { toast }      from 'sonner'
import { Loader2, X, Phone } from 'lucide-react'

const schema = z.object({
  name:           z.string().min(2, 'Name required'),
  phone:          z.string().min(10, 'Valid phone required'),
  preferred_time: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface CallbackModalProps {
  trigger?: React.ReactNode
  open?:    boolean
  onOpenChange?: (open: boolean) => void
}

export function CallbackModal({ trigger, open: controlledOpen, onOpenChange }: CallbackModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isOpen    = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await fetch('/api/requests/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      toast.success('Callback requested! We\'ll call you soon.')
      reset()
      setIsOpen(false)
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 animate-fade-up">
          <div className="bg-bg rounded-2xl p-8 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className="font-display text-xl text-ink">Request a Callback</Dialog.Title>
                <Dialog.Description className="text-sm text-ink-muted mt-1">
                  We&apos;ll call you within 2 hours during business hours.
                </Dialog.Description>
              </div>
              <Dialog.Close className="p-2 text-ink-faint hover:text-ink transition-colors rounded-lg hover:bg-surface">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Your Name" error={errors.name?.message}>
                <input {...register('name')} placeholder="Full name" className={inputCls} />
              </Field>
              <Field label="Phone Number" error={errors.phone?.message}>
                <input {...register('phone')} placeholder="+91 XXXXX XXXXX" className={inputCls} />
              </Field>
              <Field label="Preferred Time (optional)">
                <select {...register('preferred_time')} className={inputCls}>
                  <option value="">Any time</option>
                  <option>10am – 12pm</option>
                  <option>12pm – 2pm</option>
                  <option>2pm – 5pm</option>
                  <option>5pm – 8pm</option>
                </select>
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-deep-teal text-cream text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-teal disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
                Request Callback
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const inputCls = 'w-full px-3 py-2.5 text-sm bg-bg border border-divider rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-colors'
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-ink-muted mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
