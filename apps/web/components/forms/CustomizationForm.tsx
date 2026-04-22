'use client'

import { useState } from 'react'
import { useForm }    from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }          from 'zod'
import { toast }      from 'sonner'
import { motion }     from 'framer-motion'
import { Loader2, Upload, CheckCircle, Pencil, Search, Sparkles } from 'lucide-react'
import { stagger, fadeUp } from '@/lib/animations'

const HOW_IT_WORKS = [
  { icon: <Pencil className="h-6 w-6" />, title: 'Submit Your Idea', desc: 'Describe your dream piece. Share reference images, inspiration, metal preferences.' },
  { icon: <Search className="h-6 w-6" />,  title: 'We Review',        desc: 'Our design team studies your request and contacts you within 48 hours with a proposal.' },
  { icon: <Sparkles className="h-6 w-6" />, title: 'Confirm & Create', desc: 'Approve the design, we craft it with full quality certification. Delivery in 3–4 weeks.' },
]

const schema = z.object({
  description:          z.string().min(20, 'Please describe in at least 20 characters'),
  contact_preference:   z.enum(['call', 'whatsapp', 'email']),
  contact_value:        z.string().min(5, 'Contact info required'),
})
type FormData = z.infer<typeof schema>

export function CustomizationPageClient() {
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { contact_preference: 'call' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await fetch('/api/requests/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSubmitted(true)
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="section-x py-24 text-center space-y-6 max-w-lg mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <CheckCircle className="mx-auto h-16 w-16 text-teal" />
        </motion.div>
        <h1 className="font-display text-display-2xl text-ink">Request Submitted!</h1>
        <p className="text-ink-muted">Our design team will review your idea and contact you within 48 hours.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-deep-teal section-x py-20 text-center space-y-4">
        <p className="text-2xs uppercase tracking-widest2 text-light-teal">Bespoke Jewellery</p>
        <h1 className="font-display text-display-2xl text-white">Design Your Dream Piece</h1>
        <p className="text-base text-cream/70 max-w-xl mx-auto">
          Tell us your vision and we&apos;ll bring it to life — exactly the way you imagined.
        </p>
      </div>

      {/* How it works */}
      <motion.div
        className="section-x py-16 bg-surface"
        variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
      >
        <motion.h2 variants={fadeUp} className="font-display text-display-xl text-ink text-center mb-12">How It Works</motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                {step.icon}
              </div>
              <div className="text-2xs text-teal uppercase tracking-widest">Step {i + 1}</div>
              <h3 className="font-display text-lg text-ink">{step.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Form */}
      <div className="section-x py-16 max-w-2xl mx-auto">
        <h2 className="font-display text-display-xl text-ink mb-8 text-center">Submit Your Idea</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-2">Describe Your Idea</label>
            <textarea
              {...register('description')}
              rows={5}
              placeholder="E.g., I want a 18K rose gold solitaire ring with a 0.5ct round diamond, minimalist band, for my engagement…"
              className={`${inputCls} resize-none`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Image upload placeholder */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-2">Reference Images (optional)</label>
            <div className="border-2 border-dashed border-divider rounded-xl p-8 text-center hover:border-teal/50 transition-colors cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-ink-faint mb-2" />
              <p className="text-sm text-ink-muted">Click to upload or drag images here</p>
              <p className="text-xs text-ink-faint mt-1">Up to 5 images · JPG, PNG · Max 10MB each</p>
            </div>
          </div>

          {/* Contact preference */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-2">Preferred Contact Method</label>
            <div className="grid grid-cols-3 gap-3">
              {(['call', 'whatsapp', 'email'] as const).map((pref) => (
                <label key={pref} className="flex items-center gap-2 p-3 rounded-xl border cursor-pointer hover:border-teal/50 transition-all">
                  <input {...register('contact_preference')} type="radio" value={pref} className="accent-teal" />
                  <span className="text-sm capitalize text-ink">{pref === 'whatsapp' ? 'WhatsApp' : pref}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-2">Your Contact (Phone / Email)</label>
            <input {...register('contact_value')} placeholder="Phone number or email" className={inputCls} />
            {errors.contact_value && <p className="text-xs text-red-500 mt-1">{errors.contact_value.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-deep-teal text-cream text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-teal disabled:opacity-50 transition-colors"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Customization Request
          </button>
        </form>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2.5 text-sm bg-bg border border-divider rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-colors'
