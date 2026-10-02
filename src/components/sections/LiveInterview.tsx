'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, whileVisible, eyebrowIn } from '@/lib/gsap'
import { Img } from '@/components/ui/Img'
import { LIVE } from '@/data/landing'

const RING_C = 2 * Math.PI * 52
const SCORE = Math.round(LIVE.feedback.bars.reduce((sum, b) => sum + b.value, 0) / LIVE.feedback.bars.length)
const MIC_BARS = 5

/** Copy split into words (so they can appear one by one); `**phrase**` marks words to highlight */
function Words({ text }: { text: string }) {
  const words = text
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .flatMap((part) => {
      const strong = part.startsWith('**')
      return part
        .replace(/\*\*/g, '')
        .split(' ')
        .filter(Boolean)
        .map((w) => ({ w, strong }))
    })
  return words.map(({ w, strong }, i) => (
    <span key={i}>
      {i > 0 && !/^[.,!?;:]/.test(w) ? ' ' : ''}
      <span className={strong ? 'st__w st__w--strong' : 'st__w'}>{w}</span>
    </span>
  ))
}

/** The AI interviewer: a small glowing voice orb */
function Orb() {
  return (
    <span className="st__orb" aria-hidden="true">
      <span className="st__halos">
        <i />
        <i />
      </span>
      <span className="st__core" />
    </span>
  )
}

/**
 * "Practice that feels like the real room" - one practice question told as four cards, read left to right:
 * it asks → you answer → it follows up → you get better (your score and one tip).
 * Cards rise in order, each message appears word by word, and the score fills in. No pinning.
 */
export function LiveInterview() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      if (prefersReducedMotion()) return

      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      eyebrowIn(el.querySelector('.eyebrow')!)
      gsap.from(['.studio__sub', '.studio__session'], {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.studio__head', start: 'top 75%' },
      })

      // Backdrop grows from a rounded card to full bleed as it arrives
      gsap.fromTo(
        '.studio__bg',
        { scaleX: 0.92, scaleY: 0.96 },
        { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true } }
      )

      // Small ambient loops, only while on screen
      const mic = gsap.utils.toArray<HTMLElement>('.st__mic i').map((bar, i) =>
        gsap.fromTo(
          bar,
          { scaleY: 0.3 },
          {
            scaleY: () => gsap.utils.random(0.35, 1),
            duration: () => gsap.utils.random(0.2, 0.45),
            ease: 'sine.inOut',
            repeat: -1,
            repeatRefresh: true,
            yoyo: true,
            delay: i * 0.06,
          }
        )
      )
      const breathe = gsap.to('.st__core', { scale: 1.08, duration: 1.4, ease: 'sine.inOut', repeat: -1, yoyo: true })
      whileVisible(el, [...mic, breathe])
      // CSS loops (orb halos) rest off screen too
      ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', toggleClass: 'is-onscreen' })

      const cards = gsap.utils.toArray<HTMLElement>('.st__card')
      const mm = gsap.matchMedia()
      mm.add(
        { four: '(min-width: 1200px)', two: '(min-width: 640px) and (max-width: 1199px)' },
        (ctx) => {
          const { four, two } = ctx.conditions as { four: boolean; two: boolean }
          const cols = four ? 4 : two ? 2 : 1

          cards.forEach((card, i) => {
            // cards in the same row follow each other left to right
            const wait = (i % cols) * 0.18
            const st = { trigger: card, start: 'top 85%' }
            gsap.from(card, { y: 70, autoAlpha: 0, duration: 1.1, delay: wait, ease: 'expo.out', scrollTrigger: st })
            gsap.from(card.querySelectorAll('.st__w'), {
              opacity: 0.08,
              duration: 0.4,
              stagger: 0.03,
              delay: wait + 0.5,
              ease: 'power2.out',
              scrollTrigger: st,
            })
          })

          // the report: score ring + number + bars fill once its card arrives
          const report = el.querySelector<HTMLElement>('.st__card--report')!
          const wait = (3 % cols) * 0.18 + 0.5
          const st = { trigger: report, start: 'top 85%' }
          const scoreNum = report.querySelector<HTMLElement>('.st__scorenum')!
          const score = { v: 0 }
          gsap.fromTo(
            '.st__ringfill',
            { strokeDashoffset: RING_C },
            { strokeDashoffset: RING_C * (1 - SCORE / 100), duration: 1.4, delay: wait, ease: 'power3.out', scrollTrigger: st }
          )
          gsap.fromTo(
            score,
            { v: 0 },
            {
              v: SCORE,
              duration: 1.4,
              delay: wait,
              ease: 'power3.out',
              scrollTrigger: st,
              onUpdate: () => {
                scoreNum.textContent = String(Math.round(score.v))
              },
            }
          )
          gsap.from('.st__bar i', { scaleX: 0, duration: 1, stagger: 0.1, delay: wait + 0.2, ease: 'power3.out', scrollTrigger: st })
        }
      )
      return () => mm.revert()
    },
    { scope: root }
  )

  const [ask, answer, followUp, better] = LIVE.steps
  return (
    <section className="studio" id="live" ref={root}>
      <div className="studio__bg" aria-hidden="true" />

      <div className="container studio__inner">
        <header className="studio__head">
          <div>
            <p className="eyebrow eyebrow--light">{LIVE.eyebrow}</p>
            <h2 className="section-title studio__title" data-split>
              {LIVE.title.lead} <em>{LIVE.title.accent}</em>
            </h2>
          </div>
          <div className="studio__aside">
            <p className="studio__sub">{LIVE.sub}</p>
            <p className="studio__session">
              <span className="studio__rec">
                <i /> Live practice
              </span>
              {LIVE.meta}
            </p>
          </div>
        </header>

        <ol className="studio__flow">
          {/* 1 · it asks */}
          <li className="st__card">
            <span className="st__num">01</span>
            <h3 className="st__title">{ask.title}</h3>
            <p className="st__desc">{ask.text}</p>
            <div className="st__scene">
              <p className="st__speaker">
                <Orb />
                AI interviewer
              </p>
              <p className="st__bubble">
                <Words text={LIVE.question} />
              </p>
            </div>
          </li>

          {/* 2 · you answer */}
          <li className="st__card">
            <span className="st__num">02</span>
            <h3 className="st__title">{answer.title}</h3>
            <p className="st__desc">{answer.text}</p>
            <div className="st__scene">
              <p className="st__speaker st__speaker--you">
                <span className="st__mic" aria-hidden="true">
                  {Array.from({ length: MIC_BARS }).map((_, i) => (
                    <i key={i} />
                  ))}
                </span>
                You
                <span className="st__avatar">
                  <Img src="/img/candidate-call.jpg" alt="" sizes="40px" />
                </span>
              </p>
              <p className="st__bubble st__bubble--you">
                <Words text={LIVE.answer} />
              </p>
            </div>
          </li>

          {/* 3 · it follows up */}
          <li className="st__card">
            <span className="st__num">03</span>
            <h3 className="st__title">{followUp.title}</h3>
            <p className="st__desc">{followUp.text}</p>
            <div className="st__scene">
              <p className="st__speaker">
                <Orb />
                AI interviewer
              </p>
              <p className="st__bubble">
                <Words text={LIVE.followUp} />
              </p>
            </div>
          </li>

          {/* 4 · you get better */}
          <li className="st__card st__card--report">
            <span className="st__num">04</span>
            <h3 className="st__title">{better.title}</h3>
            <p className="st__desc">{better.text}</p>
            <div className="st__scene st__report">
              <div className="st__reptop">
                <div className="st__score">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle cx="60" cy="60" r="52" className="st__ringtrack" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      className="st__ringfill"
                      style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C * (1 - SCORE / 100) }}
                    />
                  </svg>
                  <b className="st__scorenum">{SCORE}</b>
                </div>
                <div>
                  <p className="st__replabel">{LIVE.feedback.title}</p>
                  <p className="st__rephead">{LIVE.feedback.headline}</p>
                </div>
              </div>
              <div className="st__bars">
                {LIVE.feedback.bars.map((b) => (
                  <div className="st__bar" key={b.label}>
                    <span>{b.label}</span>
                    <b>
                      <i style={{ transform: `scaleX(${b.value / 100})` }} />
                    </b>
                    <em>{b.value}</em>
                  </div>
                ))}
              </div>
              <p className="st__tip">
                <span>Coach tip</span>
                <Words text={LIVE.feedback.note} />
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}
