'use client'

import { useRef } from 'react'
import { CalendarCheck, Check, Clock, Mic, Sparkles } from 'lucide-react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, whileVisible } from '@/lib/gsap'
import { BtnArrow } from '@/components/ui/BtnArrow'
import { Img } from '@/components/ui/Img'
import { CTA, HERO, HERO_DEMO, SITE } from '@/data/landing'

const DETAILS = [
  { Icon: Clock, text: 'About 20 minutes · whenever suits you' },
  { Icon: Mic, text: 'Voice-first · camera optional' },
  { Icon: Sparkles, text: 'Feedback report straight after' },
]

/**
 * Closing call to action, framed as an interview invitation: headline + start button on the left,
 * a calendar-style invite on the right (the role cycles, the card tilts toward the cursor,
 * "Accept invite" opens the app). The forest panel grows into place as it scrolls in.
 */
export function FinalCta() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current!
      if (prefersReducedMotion()) return

      // panel grows from a smaller card as it arrives
      gsap.fromTo(
        '.cta__panel',
        { scale: 0.93 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: true },
        }
      )
      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t, { duration: 1.3 }, { start: 'top 80%' }))
      gsap.from(['.cta .eyebrow', '.cta__sub', '.cta__actions', '.cta__perks li'], {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.cta__copy', start: 'top 80%' },
      })

      // the invite slides in, then its rows follow
      const st = { trigger: '.invite', start: 'top 85%' }
      gsap.from('.invite', { y: 90, rotate: 4, autoAlpha: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: st })
      gsap.from('.invite__row, .invite__people, .invite__accept', {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.35,
        ease: 'expo.out',
        scrollTrigger: st,
      })

      // the role on the invite cycles through the demo roles
      const role = el.querySelector<HTMLElement>('.invite__role')!
      let idx = 0
      const cycle = gsap.timeline({ repeat: -1, paused: true })
      cycle
        // the first role stays readable before the first swap
        .to(role, { yPercent: -60, autoAlpha: 0, duration: 0.35, ease: 'power2.in', delay: 2.4 })
        .call(() => {
          idx = (idx + 1) % HERO_DEMO.length
          role.textContent = HERO_DEMO[idx].role
        })
        .fromTo(
          role,
          { yPercent: 60, autoAlpha: 0 },
          // immediateRender off: otherwise the role is hidden from the moment the timeline is built
          { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }
        )
      whileVisible(el, [cycle])
      // CSS loops (rings, accept pulse) rest while off screen
      ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', toggleClass: 'is-onscreen' })

      // the invite tilts toward the pointer
      if (!window.matchMedia('(pointer: fine)').matches || !contextSafe) return
      const card = el.querySelector<HTMLElement>('.invite__tilt')!
      const rx = gsap.quickTo(card, 'rotateX', { duration: 0.8, ease: 'power3' })
      const ry = gsap.quickTo(card, 'rotateY', { duration: 0.8, ease: 'power3' })
      const panel = el.querySelector<HTMLElement>('.cta__panel')!
      const move = contextSafe((e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        ry(gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / r.width) * 8)
        rx(-gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / r.height) * 6)
      })
      const leave = contextSafe(() => {
        rx(0)
        ry(0)
      })
      panel.addEventListener('pointermove', move)
      panel.addEventListener('pointerleave', leave)
      return () => {
        panel.removeEventListener('pointermove', move)
        panel.removeEventListener('pointerleave', leave)
      }
    },
    { scope: root }
  )

  return (
    <section className="cta" id="cta" ref={root}>
      <div className="container">
        <div className="cta__panel">
          <div className="cta__rings" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <div className="cta__copy">
            <p className="eyebrow eyebrow--light">
              <span className="eyebrow__dot" aria-hidden="true" />
              {CTA.eyebrow}
            </p>
            <h2 className="cta__title" data-split>
              {CTA.lead} <em>{CTA.accent}</em>
            </h2>
            <p className="cta__sub">{CTA.sub}</p>
            <div className="cta__actions">
              <a href={SITE.appUrl} className="btn btn--cream btn--lg magnetic" data-cursor="Let's go">
                <span className="btn__label">{CTA.button}</span>
                <BtnArrow />
              </a>
              <a href={SITE.appUrl} className="cta__signin">
                Already practising? <b>Sign in</b>
              </a>
            </div>
            <ul className="cta__perks">
              {HERO.perks.map((p) => (
                <li key={p}>
                  <span aria-hidden="true">
                    <Check strokeWidth={3.2} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* The invitation */}
          <div className="invite">
            <div className="invite__tilt">
              <div className="invite__head">
                <span className="invite__tag">
                  <CalendarCheck strokeWidth={2.2} aria-hidden="true" /> Interview invitation
                </span>
                <span className="invite__status">
                  <i aria-hidden="true" /> Room open
                </span>
              </div>

              <div className="invite__row invite__main">
                <div className="invite__date" aria-hidden="true">
                  <span>Open</span>
                  <b>24/7</b>
                </div>
                <div>
                  <p className="invite__kind">Mock interview</p>
                  <p className="invite__rolewrap">
                    <span className="invite__role">{HERO_DEMO[0].role}</span>
                  </p>
                </div>
              </div>

              <ul className="invite__details">
                {DETAILS.map(({ Icon, text }) => (
                  <li className="invite__row" key={text}>
                    <Icon strokeWidth={2} aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>

              <div className="invite__people">
                <span className="invite__orb" aria-hidden="true" />
                <span className="invite__you">
                  <Img src="/img/candidate-call.jpg" alt="" sizes="40px" />
                </span>
                <p>
                  <b>AI interviewer</b> and <b>you</b>
                </p>
              </div>

              <a href={SITE.appUrl} className="invite__accept" data-cursor="Accept">
                <Check strokeWidth={3} aria-hidden="true" />
                Accept invite
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
