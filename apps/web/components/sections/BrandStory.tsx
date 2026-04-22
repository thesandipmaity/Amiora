'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GoldDivider } from '@amiora/ui'

gsap.registerPlugin(ScrollTrigger)

export function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.brand-story-text',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section-padding py-24 bg-obsidian-900 text-ivory-100">
      <div className="mx-auto max-w-3xl text-center">
        <GoldDivider label="Our Story" className="opacity-40" />
        <h2 className="brand-story-text font-display text-5xl font-light">
          Crafted with <span className="gold-text">Passion</span>
        </h2>
        <p className="brand-story-text mt-6 text-base leading-relaxed text-ivory-200/60">
          At Amiora, every piece is a testament to the art of fine jewellery making. Our master
          craftsmen blend centuries-old traditions with contemporary design to create jewellery that
          tells your unique story. Each gem is hand-selected, each setting individually crafted.
        </p>
        <div className="brand-story-text mt-12 grid grid-cols-3 gap-8 border-t border-gold-500/20 pt-8">
          {[
            { value: '5000+', label: 'Pieces Crafted' },
            { value: '24K', label: 'Gold Standard' },
            { value: '100%', label: 'Certified Gems' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl font-light text-gold-400">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-ivory-200/40">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
