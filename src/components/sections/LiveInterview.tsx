'use client'

import { useRef } from 'react'
import { gsap, useGSAP, splitReveal, prefersReducedMotion, whileVisible, eyebrowIn } from '@/lib/gsap'
import { Img } from '@/components/ui/Img'
import { LIVE } from '@/data/landing'

const BARS = 40
const strip = (t: string) => t.replace(/\*\*/g, '')

/** What the caption bar shows, and who is speaking, at each step */
const CAPTIONS = [
  { who: 'Interviewer', speaker: 'ai', text: LIVE.question },
  { who: 'You', speaker: 'you', text: strip(LIVE.answer) },
  { who: 'Interviewer', speaker: 'ai', text: LIVE.followUp },
  { who: 'Coach', speaker: 'coach', text: LIVE.feedback.note },
]

/**
 * "Practice that feels like the real room" - a split screen:
 * left, a large video call (AI interviewer, your camera, live caption bar);
 * right, the four steps with a progress line. Desktop pins and scroll walks through the steps:
 * the active step lights up, the call switches speaker, the caption types the matching line,
 * and the feedback card slides over the call at the end. Phones show the same pieces stacked.
 */
export function LiveInterview() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const steps = gsap.utils.toArray<HTMLElement>('.lv2__step')
      const call = el.querySelector<HTMLElement>('.lv2__call')!
      const capWho = el.querySelector<HTMLElement>('.lv2__capwho')!
      const capText = el.querySelector<HTMLElement>('.lv2__captext')!
      const timer = el.querySelector<HTMLElement>('.lv2__timer')!
      const fb = el.querySelector<HTMLElement>('.lv2__fb')!

      // phones: the feedback card sits under the call and stays visible
      const stackedFb = window.matchMedia('(max-width: 640px)').matches
      let current = -1
      let typer: gsap.core.Tween | null = null
      const setStep = (i: number, animate = true) => {
        if (i === current) return
        current = i
        steps.forEach((s, k) => {
          s.classList.toggle('is-active', k === i)
          s.classList.toggle('is-done', k < i)
        })
        const c = CAPTIONS[i]
        call.dataset.speaker = c.speaker
        capWho.textContent = c.who
        typer?.kill()
        if (!animate) {
          capText.textContent = c.text
          return
        }
        const t = { n: 0 }
        typer = gsap.to(t, {
          n: c.text.length,
          duration: Math.min(1.8, c.text.length * 0.022),
          ease: 'none',
          onUpdate: () => {
            capText.textContent = c.text.slice(0, Math.round(t.n))
          },
        })
        if (!stackedFb)
          gsap.to(
            fb,
            i === 3 ? { autoAlpha: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' } : { autoAlpha: 0, y: 40, duration: 0.35 }
          )
        if (i === 3)
          gsap.fromTo(
            '.lv2__fbbar i',
            { scaleX: 0 },
            {
              scaleX: (k: number) => LIVE.feedback.bars[k].value / 100,
              duration: 0.9,
              stagger: 0.1,
              ease: 'power3.out',
              delay: 0.2,
            }
          )
      }

      if (prefersReducedMotion()) {
        setStep(3, false)
        gsap.set(fb, { autoAlpha: 1, y: 0 })
        gsap.set('.lv2__fbbar i', { scaleX: (k: number) => LIVE.feedback.bars[k].value / 100 })
        return
      }

      if (!stackedFb) gsap.set(fb, { autoAlpha: 0, y: 40 })
      setStep(0, false)
      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      eyebrowIn(el.querySelector('.eyebrow')!)

      // voice bars on the interviewer tile + your mic meter
      const voice = gsap.utils.toArray<HTMLElement>('.lv2__bars i').map((bar, i) =>
        gsap.fromTo(
          bar,
          { scaleY: 0.25 },
          {
            scaleY: () => gsap.utils.random(0.3, 1),
            duration: () => gsap.utils.random(0.3, 0.6),
            ease: 'sine.inOut',
            repeat: -1,
            repeatRefresh: true,
            yoyo: true,
            delay: (i % 8) * 0.05,
          }
        )
      )
      const clock = { s: 74 }
      const clockTween = gsap.to(clock, {
        s: 74 + 3600,
        duration: 3600,
        ease: 'none',
        onUpdate: () => {
          const s = Math.floor(clock.s)
          timer.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
        },
      })
      whileVisible(el, [...voice, clockTween])

      // backdrop grows from a rounded card to full width (scale only)
      gsap.fromTo(
        '.live__bg',
        { scaleX: 0.92, scaleY: 0.94 },
        { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true } }
      )

      const mm = gsap.matchMedia()
      mm.add('(min-width: 1081px)', () => {
        gsap.from('.lv2__call', {
          y: 80,
          rotate: -2,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 70%' },
        })
        gsap.from(steps, {
          x: 50,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 60%' },
        })
        gsap.fromTo(
          '.lv2__progress span',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: '+=260%',
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => setStep(Math.min(3, Math.floor(self.progress * 4.001))),
            },
          }
        )
      })
      mm.add('(max-width: 1080px)', () => {
        steps.forEach((s, i) =>
          gsap.from(s, {
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: s, start: 'top 85%', onEnter: () => setStep(i) },
          })
        )
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section className="live" id="live" ref={root}>
      <div className="live__bg" aria-hidden="true" />
      <div className="container lv2">
        <div className="lv2__head">
          <p className="eyebrow eyebrow--light">{LIVE.eyebrow}</p>
          <h2 className="section-title lv2__title" data-split>
            {LIVE.title.lead} <em>{LIVE.title.accent}</em>
          </h2>
        </div>

        {/* Left: the call */}
        <div className="lv2__call" data-speaker="ai" aria-label="Preview of a live practice interview">
          <div className="lv2__top">
            <span className="lv2__live">
              <i /> Live · <b className="lv2__timer">01:14</b>
            </span>
            <span className="lv2__meta">{LIVE.meta}</span>
          </div>
          <div className="lv2__stage">
            <div className="lv2__ai">
              <div className="lv2__orb">
                <span className="lv2__ripple" />
                <span className="lv2__ripple lv2__ripple--2" />
                <Img src="/brand/mentorx-icon.png" width={160} height={160} sizes="80px" />
              </div>
              <p className="lv2__name">AI interviewer</p>
              <div className="lv2__bars" aria-hidden="true">
                {Array.from({ length: BARS }).map((_, i) => (
                  <i key={i} />
                ))}
              </div>
            </div>
            <div className="lv2__you">
              <Img src="/img/candidate-call.jpg" alt="" sizes="360px" />
              <span className="lv2__youtag">You</span>
            </div>
            <div className="lv2__fb">
              <p className="lv2__fblabel">{LIVE.feedback.title}</p>
              <p className="lv2__fbhead">{LIVE.feedback.headline}</p>
              {LIVE.feedback.bars.map((b) => (
                <div className="lv2__fbbar" key={b.label}>
                  <span>{b.label}</span>
                  <b>
                    <i />
                  </b>
                  <em>{b.value}</em>
                </div>
              ))}
            </div>
          </div>
          <div className="lv2__cap">
            <span className="lv2__capwho">Interviewer</span>
            <p className="lv2__captext">{LIVE.question}</p>
          </div>
        </div>

        {/* Right: the steps */}
        <ol className="lv2__steps">
          <li className="lv2__progress" aria-hidden="true">
            <span />
          </li>
          {LIVE.steps.map((s, i) => (
            <li className="lv2__step" key={s.title}>
              <span className="lv2__num">0{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
