'use client'

import { useRef } from 'react'
import { gsap, useGSAP, SplitText, prefersReducedMotion, eyebrowIn } from '@/lib/gsap'
import { Img } from '@/components/ui/Img'
import { MANIFESTO } from '@/data/landing'

function Pill({ src }: { src: string }) {
  return (
    <span className="pill-img">
      <Img src={src} sizes="160px" />
    </span>
  )
}

const PILLS = ['/img/study-flatlay.jpg', '/img/practice-headphones.jpg', '/img/handshake-smile.jpg']

/** Big statement: words light up as you scroll, inline photo pills pop in, a terracotta highlight sweeps the last line */
export function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      eyebrowIn(root.current!.querySelector('.eyebrow')!)

      SplitText.create('.manifesto__text', {
        type: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.12, y: 12 },
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              stagger: 0.1,
              scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 55%', scrub: true },
            }
          ),
      })

      gsap.utils.toArray<HTMLElement>('.pill-img').forEach((pill) => {
        gsap.from(pill, {
          scale: 0,
          rotate: -16,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: pill, start: 'top 85%', end: 'top 55%', scrub: 1 },
        })
      })

      gsap.fromTo(
        '.manifesto__mark',
        { backgroundSize: '0% 100%' },
        {
          backgroundSize: '100% 100%',
          ease: 'none',
          scrollTrigger: { trigger: '.manifesto__mark', start: 'top 75%', end: 'top 45%', scrub: true },
        }
      )
    },
    { scope: root }
  )

  const [a, b, c, d] = MANIFESTO.parts
  return (
    <section className="manifesto" id="manifesto" ref={root}>
      <div className="container">
        <p className="eyebrow eyebrow--muted">{MANIFESTO.eyebrow}</p>
        <p className="manifesto__text">
          {a} <Pill src={PILLS[0]} /> {b} <Pill src={PILLS[1]} /> {c} <Pill src={PILLS[2]} />{' '}
          <span className="manifesto__mark">{d}</span>
        </p>
      </div>
    </section>
  )
}
