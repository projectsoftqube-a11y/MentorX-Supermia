'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, whileVisible } from '@/lib/gsap'
import { ROLES_ROW_A as ROW_A, ROLES_ROW_B as ROW_B } from '@/data/landing'

function Track({ items }: { items: string[] }) {
  return (
    <div className="marquee__track">
      {items.map((t) => (
        <span key={t} className="marquee__item">
          <span>{t}</span>
          <i>✦</i>
        </span>
      ))}
    </div>
  )
}

/** Two endless rows moving in opposite directions; scrolling speeds them up and flips their direction */
export function RolesMarquee() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const rows = gsap.utils.toArray<HTMLElement>('.marquee')
      const loops = rows.map((row) => {
        const dir = Number(row.dataset.direction || 1)
        // Each row holds two identical tracks; moving both by -100% of one track loops seamlessly
        return gsap.fromTo(
          row.querySelectorAll('.marquee__track'),
          { xPercent: dir === 1 ? 0 : -100 },
          { xPercent: dir === 1 ? -100 : 0, duration: 28, ease: 'none', repeat: -1 }
        )
      })

      // One proxy drives both rows' speed: scrolling kicks it up, then it eases back to normal
      const speed = { ts: 1 }
      const apply = () => loops.forEach((loop) => loop.timeScale(speed.ts))
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 300)
          speed.ts = boost * self.direction
          apply()
          gsap.to(speed, { ts: self.direction, duration: 1.2, ease: 'power2.out', overwrite: true, onUpdate: apply })
        },
      })
      whileVisible(root.current!, loops)

      // The whole band leans a little more as it passes
      gsap.fromTo(
        root.current,
        { rotate: -4 },
        {
          rotate: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    },
    { scope: root }
  )

  return (
    <section className="marquee-band" ref={root} aria-label="Roles you can practise for">
      <div className="marquee" data-direction="1">
        <Track items={ROW_A} />
        <Track items={ROW_A} />
      </div>
      <div className="marquee marquee--outline" data-direction="-1">
        <Track items={ROW_B} />
        <Track items={ROW_B} />
      </div>
    </section>
  )
}
