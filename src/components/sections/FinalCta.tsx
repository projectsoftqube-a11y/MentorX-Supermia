'use client'

import { useRef } from 'react'
import { gsap, useGSAP, splitReveal, prefersReducedMotion } from '@/lib/gsap'
import { Img } from '@/components/ui/Img'
import { CTA, SITE } from '@/data/landing'

/** A forest circle grows from a dot to fill the screen, then the headline rises; small photos orbit slowly */
export function FinalCta() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('.cta__circle', { scale: 1 })
        return
      }
      gsap.fromTo(
        '.cta__circle',
        { scale: 0.06 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: 1 },
        }
      )
      root.current!.querySelectorAll('[data-split]').forEach((el) => splitReveal(el, { duration: 1.3 }, { start: 'top 70%' }))
      gsap.from(['.cta .eyebrow', '.cta__sub', '.cta .btn'], {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.cta__inner', start: 'top 70%' },
      })
      // floating photo bubbles drift in from the edges, then bob gently
      gsap.utils.toArray<HTMLElement>('.cta__bubble').forEach((b, i) => {
        gsap.from(b, {
          scale: 0,
          autoAlpha: 0,
          duration: 1.2,
          delay: 0.3 + i * 0.12,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: '.cta__inner', start: 'top 70%' },
        })
        gsap.to(b, { y: i % 2 ? 18 : -18, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })
    },
    { scope: root }
  )

  return (
    <section className="cta" id="cta" ref={root}>
      <div className="cta__circle" aria-hidden="true" />
      <div className="cta__bubbles" aria-hidden="true">
        {['/img/student-cowork.jpg', '/img/professional-blazer.jpg', '/img/experienced-pro.jpg', '/img/candidate-call.jpg'].map(
          (src, i) => (
            <span key={src} className={`cta__bubble cta__bubble--${i + 1}`}>
              <Img src={src} sizes="140px" />
            </span>
          )
        )}
      </div>
      <div className="container cta__inner">
        <p className="eyebrow eyebrow--light">{CTA.eyebrow}</p>
        <h2 className="cta__title" data-split>
          {CTA.lead} <em>{CTA.accent}</em>
        </h2>
        <p className="cta__sub">{CTA.sub}</p>
        <a href={SITE.appUrl} className="btn btn--cream btn--xl magnetic" data-cursor="Let's go">
          <span className="btn__label">{CTA.button}</span>
          <span className="btn__icon" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  )
}
