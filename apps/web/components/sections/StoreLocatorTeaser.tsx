'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { fadeUp } from '@/lib/animations'

const CITIES = ['Delhi', 'Mumbai', 'Jaipur']

export function StoreLocatorTeaser({ storeCount = 3 }: { storeCount?: number }) {
  return (
    <motion.section
      className="bg-cream"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="section-x py-12 flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-deep-teal/10 rounded-full">
            <MapPin className="h-6 w-6 text-deep-teal" />
          </div>
          <div>
            <h3 className="font-display text-xl text-ink">Visit Us In Store</h3>
            <p className="text-sm text-ink-muted">Experience jewellery in person</p>
          </div>
          <span className="hidden sm:block bg-teal text-white text-xs px-3 py-1 rounded-full">
            {storeCount} Stores
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <span
              key={city}
              className="px-4 py-1.5 rounded-full border border-sand/40 text-sm text-sand hover:border-sand hover:bg-sand/10 transition-colors cursor-default"
            >
              {city}
            </span>
          ))}
        </div>

        <Link
          href="/stores"
          className="shrink-0 bg-deep-teal text-cream px-6 py-3 text-sm font-medium uppercase tracking-widest rounded-md hover:bg-teal transition-colors"
        >
          Find Nearest Store
        </Link>
      </div>
    </motion.section>
  )
}
