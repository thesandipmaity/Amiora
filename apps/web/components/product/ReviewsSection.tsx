'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { StarRating } from '@/components/ui/StarRating'
import { fadeUp } from '@/lib/animations'

interface Review {
  id: string
  reviewer_name: string
  rating: number
  title: string | null
  body: string | null
  created_at: string
  is_verified_purchase: boolean
}

interface ReviewsSectionProps {
  reviews:    Review[]
  total:      number
  avgRating:  number
}

export function ReviewsSection({ reviews, total, avgRating }: ReviewsSectionProps) {
  const [filter, setFilter] = useState<'all' | '5' | '4' | 'verified'>('all')

  const distrib = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }))

  const filtered = reviews.filter((r) => {
    if (filter === '5')        return Math.round(r.rating) === 5
    if (filter === '4')        return Math.round(r.rating) === 4
    if (filter === 'verified') return r.is_verified_purchase
    return true
  })

  return (
    <section className="section-x py-14 border-t border-divider">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2 className="font-display text-display-xl text-ink mb-8">Customer Reviews</h2>

        {total === 0 ? (
          <p className="text-ink-muted">Be the first to review this product.</p>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
            {/* Aggregate */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-display text-5xl text-deep-teal">{avgRating.toFixed(1)}</p>
                <StarRating rating={avgRating} size="md" showCount={false} className="justify-center my-2" />
                <p className="text-sm text-ink-muted">{total} reviews</p>
              </div>
              {distrib.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-right text-ink-muted">{star}</span>
                  <div className="flex-1 h-1.5 bg-divider rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-5 text-ink-faint">{count}</span>
                </div>
              ))}
            </div>

            {/* Reviews list */}
            <div>
              {/* Filter tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {(['all', '5', '4', 'verified'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      filter === f
                        ? 'bg-teal text-white border-teal'
                        : 'border-divider text-ink-muted hover:border-teal'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'verified' ? '✓ Verified' : `${f}★`}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {filtered.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-divider last:border-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="font-medium text-ink">{review.reviewer_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} size="sm" showCount={false} />
                          {review.is_verified_purchase && (
                            <span className="text-2xs text-teal">✓ Verified</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-ink-faint shrink-0">
                        {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    {review.title && <p className="font-medium text-sm text-ink mb-1">{review.title}</p>}
                    {review.body  && <p className="text-sm text-ink-muted leading-relaxed">{review.body}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}
