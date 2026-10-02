'use client'

import { useRef } from 'react'
import { ArrowDown, BookOpen, FileText } from 'lucide-react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, whileVisible, eyebrowIn } from '@/lib/gsap'
import { BtnArrow } from '@/components/ui/BtnArrow'
import { Img } from '@/components/ui/Img'
import { BROCHURE } from '@/data/landing'

/**
 * Downloadable brochure. On the right, a 3D brochure built in HTML/CSS (so it stays crisp and on-brand):
 * it turns toward you and its pages fan out as it scrolls in, the cover peeks open once to show the
 * contents page, opens fully on hover, and tilts toward the cursor.
 */
export function Brochure() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current!
      const stage = el.querySelector<HTMLElement>('.br__stage')!
      if (prefersReducedMotion()) return

      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      eyebrowIn(el.querySelector('.eyebrow')!)
      gsap.from(['.br__sub', '.br__toc li', '.br__actions', '.br__meta'], {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.br__copy', start: 'top 75%' },
      })

      // The brochure turns toward you and its pages fan out as it scrolls into view
      gsap
        .timeline({ scrollTrigger: { trigger: stage, start: 'top 95%', end: 'center 55%', scrub: 1 } })
        .fromTo('.br__float', { rotateY: -40, rotateX: 18, y: 120 }, { rotateY: -16, rotateX: 6, y: 0, ease: 'none' })
        .fromTo('.br__sheet--1', { x: 0, z: -3, rotateZ: 0 }, { x: 22, z: -3, rotateZ: 3.5, ease: 'none' }, 0)
        .fromTo('.br__sheet--2', { x: 0, z: -6, rotateZ: 0 }, { x: 44, z: -6, rotateZ: 7, ease: 'none' }, 0)

      // Floating labels pop in, then bob gently while on screen
      gsap.from('.br__chip', {
        scale: 0.6,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: stage, start: 'top 70%' },
      })
      const bobs = gsap.utils
        .toArray<HTMLElement>('.br__chip')
        .map((c, i) => gsap.to(c, { y: i % 2 ? 12 : -12, duration: 2.6 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }))
      whileVisible(el, bobs)

      // The cover peeks open once, so people see there's a guide inside
      ScrollTrigger.create({
        trigger: stage,
        start: 'top 50%',
        once: true,
        onEnter: () => {
          stage.classList.add('is-open')
          gsap.delayedCall(1.9, () => {
            if (!stage.matches(':hover')) stage.classList.remove('is-open')
          })
        },
      })

      // Pointer: tilt toward the cursor, open the cover while hovering
      if (!window.matchMedia('(pointer: fine)').matches || !contextSafe) return
      const rx = gsap.quickTo('.br__tilt', 'rotateX', { duration: 0.8, ease: 'power3' })
      const ry = gsap.quickTo('.br__tilt', 'rotateY', { duration: 0.8, ease: 'power3' })
      const move = contextSafe((e: PointerEvent) => {
        const r = stage.getBoundingClientRect()
        ry(((e.clientX - r.left) / r.width - 0.5) * 16)
        rx(-((e.clientY - r.top) / r.height - 0.5) * 10)
      })
      const enter = () => stage.classList.add('is-open')
      const leave = contextSafe(() => {
        rx(0)
        ry(0)
        stage.classList.remove('is-open')
      })
      stage.addEventListener('pointermove', move)
      stage.addEventListener('pointerenter', enter)
      stage.addEventListener('pointerleave', leave)
      return () => {
        stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerenter', enter)
        stage.removeEventListener('pointerleave', leave)
      }
    },
    { scope: root }
  )

  return (
    <section className="brochure" id="brochure" ref={root}>
      <div className="container">
        <div className="br__panel">
          <div className="br__copy">
            <p className="eyebrow eyebrow--muted">{BROCHURE.eyebrow}</p>
            <h2 className="section-title" data-split>
              {BROCHURE.lead} <em>{BROCHURE.accent}</em>
            </h2>
            <p className="lead br__sub">{BROCHURE.sub}</p>

            <ol className="br__toc">
              {BROCHURE.chapters.map((c, i) => (
                <li key={c.title}>
                  <span className="br__tocnum">0{i + 1}</span>
                  <div>
                    <b>{c.title}</b>
                    <p>{c.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="br__actions">
              <a
                href={BROCHURE.href}
                download={BROCHURE.fileName}
                className="btn btn--primary btn--lg magnetic"
                data-cursor="Get it"
              >
                <span className="btn__label">Download the brochure</span>
                <BtnArrow icon={ArrowDown} down />
              </a>
              <a
                href={BROCHURE.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--lg magnetic"
                data-cursor="Read"
              >
                <span className="btn__play btn__play--icon" aria-hidden="true">
                  <BookOpen strokeWidth={2.2} />
                </span>
                <span className="btn__label">Read it online</span>
              </a>
            </div>
            <p className="br__meta">
              <FileText strokeWidth={2} aria-hidden="true" />
              {BROCHURE.meta} · free, no sign-up
            </p>
          </div>

          {/* The 3D brochure (decorative: the real content is the list on the left) */}
          <div className="br__stage" aria-hidden="true">
            <span className="br__glow" />
            <div className="br__float">
              <div className="br__tilt">
                <div className="br__book">
                  <div className="br__sheet br__sheet--2" />
                  <div className="br__sheet br__sheet--1" />

                  {/* the brochure's real pages: an inside page, revealed when the cover opens */}
                  <div className="br__inside">
                    <Img src="/brochure/inside.jpg" width={900} height={1274} sizes="(max-width: 1000px) 300px, 380px" />
                  </div>

                  <div className="br__cover">
                    <div className="br__coverfront">
                      <Img src="/brochure/cover.jpg" width={900} height={1274} sizes="(max-width: 1000px) 300px, 380px" />
                    </div>
                    <div className="br__coverback" />
                  </div>
                </div>
              </div>
            </div>
            <span className="br__shadow" />
            <span className="br__chip br__chip--a">
              <FileText strokeWidth={2.2} /> Free PDF
            </span>
            <span className="br__chip br__chip--b">8 pages · AI interview prep</span>
          </div>
        </div>
      </div>
    </section>
  )
}
