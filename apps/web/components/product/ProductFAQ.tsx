'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@amiora/ui'

interface FaqItem {
  question: string
  answer:   string
}

export function ProductFAQ({ faqs }: { faqs: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  if (!faqs.length) return null

  return (
    <section className="section-x py-12 border-t border-divider">
      <h2 className="font-display text-display-xl text-ink mb-6">Frequently Asked Questions</h2>
      <div className="max-w-2xl space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-divider rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface/60 transition-colors"
            >
              <span className="font-medium text-sm text-ink">{faq.question}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-teal shrink-0 transition-transform duration-300',
                  openIdx === i && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                openIdx === i ? 'max-h-96' : 'max-h-0'
              )}
            >
              <p className="px-5 pb-5 text-sm text-ink-muted leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
