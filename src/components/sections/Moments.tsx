'use client'

import { useRef } from 'react'
import { gsap, useGSAP, splitReveal, prefersReducedMotion, whileVisible } from '@/lib/gsap'
import { Img } from '@/components/ui/Img'
import { MOMENTS, MOMENTS_COPY } from '@/data/landing'

const AUTO_ADVANCE_S = 3.6

/**
 * "With you for every step" - an expanding journey strip.
 * Desktop: five tall photo panels; the open one shows its time, title and line of copy.
 * It advances on its own while visible; hovering (or focusing) a panel opens it and pauses the cycle.
 * Phones: the panels stack as cards with everything visible.
 */
export function Moments() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current!
      const panels = gsap.utils.toArray<HTMLElement>('.jr__panel')
      const progressBars = gsap.utils.toArray<HTMLElement>('.jr__progress i')
      if (!contextSafe) return

      let active = 0
      let paused = false
      const open = (i: number) => {
        active = i
        panels.forEach((p, k) => {
          p.classList.toggle('is-open', k === i)
        })
      }
      open(0)

      if (prefersReducedMotion()) return

      root.current!.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      gsap.from('.moments .lead', {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.moments__head', start: 'top 75%' },
      })
      gsap.from(panels, {
        y: 120,
        autoAlpha: 0,
        duration: 1.3,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.jr', start: 'top 85%' },
      })

      // Auto-advance with a progress line on the open panel
      const cycle = gsap.timeline({ repeat: -1, paused: true })
      panels.forEach((_, i) => {
        cycle
          .addLabel(`p${i}`)
          .call(() => {
            if (!paused) open(i)
          })
          .fromTo(progressBars[i], { scaleX: 0 }, { scaleX: 1, duration: AUTO_ADVANCE_S, ease: 'none' })
          .set(progressBars[i], { scaleX: 0 })
      })
      whileVisible(el.querySelector('.jr')!, [cycle])

      const enter = contextSafe((i: number) => {
        paused = true
        cycle.pause()
        open(i)
      })
      const leave = contextSafe(() => {
        paused = false
        // resume the cycle from the panel the visitor left open
        cycle.seek(`p${active}`).resume()
      })

      const offs = panels.map((p, i) => {
        const onEnter = () => enter(i)
        p.addEventListener('pointerenter', onEnter)
        p.addEventListener('focus', onEnter)
        p.addEventListener('pointerleave', leave)
        p.addEventListener('blur', leave)
        return () => {
          p.removeEventListener('pointerenter', onEnter)
          p.removeEventListener('focus', onEnter)
          p.removeEventListener('pointerleave', leave)
          p.removeEventListener('blur', leave)
        }
      })
      return () => offs.forEach((off) => off())
    },
    { scope: root }
  )

  return (
    <section className="moments" ref={root}>
      <div className="container">
        <div className="moments__head">
          <h2 className="section-title" data-split>
            {MOMENTS_COPY.lead} <em>{MOMENTS_COPY.accent}</em>
          </h2>
          <p className="lead">{MOMENTS_COPY.sub}</p>
        </div>

        <div className="jr">
          {MOMENTS.map((m, i) => (
            <article className={`jr__panel${i === 0 ? ' is-open' : ''}`} key={m.src} tabIndex={0}>
              <Img className="jr__img" src={m.src} alt={m.alt} sizes="(max-width: 900px) 100vw, 50vw" />
              <div className="jr__shade" />
              <span className="jr__num">0{i + 1}</span>
              <span className="jr__vlabel" aria-hidden="true">
                {m.caption}
              </span>
              <div className="jr__body">
                <span className="jr__time">{m.time}</span>
                <h3>{m.caption}</h3>
                <p>{m.text}</p>
              </div>
              <span className="jr__progress" aria-hidden="true">
                <i />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
