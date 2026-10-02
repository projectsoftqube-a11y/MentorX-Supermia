'use client'

import { useRef } from 'react'
import { gsap, useGSAP, splitReveal, prefersReducedMotion } from '@/lib/gsap'
import { Img } from '@/components/ui/Img'
import { AUDIENCE, PERSONAS } from '@/data/landing'

/**
 * "Made for every stage of your career" - on desktop the section pins and each persona card
 * slides up over the previous one, which shrinks back and dims (a stacked-card story).
 * Below 900px the cards simply stack and reveal.
 */
export function WhoItsFor() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = root.current!
      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      const cards = gsap.utils.toArray<HTMLElement>('.persona')
      const mm = gsap.matchMedia()

      mm.add('(min-width: 901px)', () => {
        // cards 2..n start below the viewport
        gsap.set(cards.slice(1), { yPercent: 115, rotate: 4 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${window.innerHeight * (cards.length - 1) * 0.9}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        cards.slice(1).forEach((card, i) => {
          const prev = cards[i]
          tl.to(card, { yPercent: 0, rotate: 0, ease: 'power2.out', duration: 1 })
            .to(prev, { scale: 0.92, yPercent: -3, ease: 'power2.out', duration: 1 }, '<')
            .to(prev.querySelector('.persona__dim'), { opacity: 0.35, ease: 'power2.out', duration: 1 }, '<')
            // text rises with the card so it has landed by the time the card settles
            .from(card.querySelectorAll('.persona__copy > *'), { y: 60, autoAlpha: 0, stagger: 0.06, duration: 0.55 }, '<0.2')
            .from(card.querySelector('.persona__media img'), { scale: 1.3, duration: 1 }, '<')
        })
        // counter in the corner follows the active card
        tl.eventCallback('onUpdate', () => {
          const idx = Math.min(cards.length - 1, Math.round(tl.progress() * (cards.length - 1)))
          el.querySelectorAll('.who__count b').forEach((b) => (b.textContent = String(idx + 1).padStart(2, '0')))
        })
      })

      mm.add('(max-width: 900px)', () => {
        cards.forEach((card) => {
          gsap.from(card, {
            y: 80,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          })
          gsap.fromTo(
            card.querySelector('.persona__media img'),
            { scale: 1.25 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section className="who" id="who" ref={root}>
      <div className="who__pin">
        <div className="container who__head">
          <div>
            <p className="eyebrow eyebrow--muted">{AUDIENCE.eyebrow}</p>
            <h2 className="section-title" data-split>
              {AUDIENCE.lead} <em>{AUDIENCE.accent}</em>
            </h2>
          </div>
          <p className="who__count" aria-hidden="true">
            <b>01</b> / {String(PERSONAS.length).padStart(2, '0')}
          </p>
        </div>

        <div className="container who__stage">
          {PERSONAS.map((p, i) => (
            <article className={`persona persona--${i + 1}`} key={p.tag} style={{ zIndex: i + 1 }}>
              <span className="persona__dim" aria-hidden="true" />
              <div className="persona__media">
                <Img src={p.img} alt={p.imgAlt} sizes="(max-width: 900px) 100vw, 50vw" width={1600} height={900} />
                <span className="persona__tag">{p.tag}</span>
              </div>
              <div className="persona__copy">
                <span className="persona__num">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <ul className="ticks">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
