'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@/lib/animations'

const MATERIALS = [
  {
    key:   'gold',
    emoji: '✦',
    title: 'Gold Jewellery',
    sub:   '22K · 18K · 14K · 9K',
    body:  'From timeless yellow gold to romantic rose gold and modern white gold — every variant BIS hallmarked and certified.',
    href:  '/shop?metal=gold',
    bg:    'bg-[#FBF6EC]',
    accent:'text-gold',
  },
  {
    key:   'silver',
    emoji: '◆',
    title: 'Silver Jewellery',
    sub:   '92.5 Sterling',
    body:  'Pure 925 sterling silver jewellery that complements everyday wear with understated elegance and lasting shine.',
    href:  '/shop?metal=silver',
    bg:    'bg-surface-2',
    accent:'text-ink-muted',
  },
  {
    key:   'diamond',
    emoji: '💎',
    title: 'Diamond Jewellery',
    sub:   'Certified · Multiple Cuts',
    body:  'Round Brilliant, Princess, Emerald, Oval and more. Every diamond independently certified with full traceability.',
    href:  '/shop?diamond=true',
    bg:    'bg-light-teal/20',
    accent:'text-teal',
  },
]

export function MaterialShowcase() {
  return (
    <motion.section
      className="section-y bg-surface"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <div className="section-x">
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-2xs uppercase tracking-widest2 text-teal mb-3">Our Materials</p>
          <h2 className="font-display text-display-2xl text-ink">Crafted from the Finest</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {MATERIALS.map((mat) => (
            <motion.div
              key={mat.key}
              variants={fadeUp}
              className={`${mat.bg} rounded-2xl p-8 flex flex-col gap-4`}
            >
              <div className={`text-3xl ${mat.accent}`}>{mat.emoji}</div>
              <div>
                <h3 className="font-display text-xl text-ink">{mat.title}</h3>
                <p className={`text-xs uppercase tracking-widest mt-1 ${mat.accent}`}>{mat.sub}</p>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">{mat.body}</p>
              <Link
                href={mat.href}
                className="mt-auto text-sm font-medium text-teal hover:text-deep-teal transition-colors"
              >
                Shop {mat.title.split(' ')[0]} →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
