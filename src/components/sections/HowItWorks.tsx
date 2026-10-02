'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, eyebrowIn } from '@/lib/gsap'
import { Img } from '@/components/ui/Img'
import { HOW, STEPS } from '@/data/landing'

/** Sticky intro on the left; on the right a progress line draws down and each step lights up as it passes */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        root.current!.querySelectorAll('.step').forEach((s) => s.classList.add('is-active'))
        return
      }
      root.current!.querySelectorAll('[data-split]').forEach((el) => splitReveal(el))
      eyebrowIn(root.current!.querySelector('.eyebrow')!)
      gsap.from('.how__intro .lead', {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.how__intro', start: 'top 75%' },
      })

      gsap.fromTo(
        '.steps__line span',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.steps', start: 'top 60%', end: 'bottom 60%', scrub: true },
        }
      )

      gsap.utils.toArray<HTMLElement>('.step').forEach((step) => {
        ScrollTrigger.create({ trigger: step, start: 'top 60%', end: 'bottom 60%', toggleClass: 'is-active' })
        gsap.from(step.querySelector('.step__node'), {
          scale: 0,
          rotate: -90,
          duration: 0.9,
          ease: 'back.out(2.2)',
          scrollTrigger: { trigger: step, start: 'top 80%' },
        })
        gsap.from(step.querySelector('.step__card'), {
          x: 90,
          rotate: 3,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 80%' },
        })
        gsap.fromTo(
          step.querySelector('.curtain'),
          { scaleX: 1, autoAlpha: 1 },
          {
            scaleX: 0,
            transformOrigin: '100% 50%',
            duration: 1.2,
            delay: 0.25,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: step, start: 'top 80%' },
          }
        )
        // image drifts inside its frame for depth
        gsap.fromTo(
          step.querySelector('.step__media img'),
          { yPercent: -8, scale: 1.15 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: step, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })
    },
    { scope: root }
  )

  return (
    <section className="how" id="how" ref={root}>
      <div className="container how__layout">
        <div className="how__intro">
          <p className="eyebrow eyebrow--muted">{HOW.eyebrow}</p>
          <h2 className="section-title" data-split>
            {HOW.lead} <em>{HOW.accent}</em>
          </h2>
          <p className="lead">{HOW.sub}</p>
        </div>

        <ol className="steps">
          <li className="steps__line" aria-hidden="true">
            <span />
          </li>
          {STEPS.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step__node">{i + 1}</span>
              <div className="step__card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div className="step__media">
                  <span className="curtain curtain--white" aria-hidden="true" />
                  <Img src={s.img} sizes="(max-width: 900px) 100vw, 40vw" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
