'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, countUp, eyebrowIn, whileVisible } from '@/lib/gsap'
import { Check } from 'lucide-react'
import { NUMBERS } from '@/data/landing'

/* Pentagon skill chart geometry (viewBox 0 0 200 200) */
const SCORES = [0.86, 0.78, 0.72, 0.84, 0.68]
/** Rounded to 2 decimals so server and browser render identical SVG attributes (avoids hydration mismatches) */
const r2 = (n: number) => Math.round(n * 100) / 100
const point = (i: number, r: number) => {
  const a = (-90 + i * 72) * (Math.PI / 180)
  return [r2(100 + Math.cos(a) * r), r2(100 + Math.sin(a) * r)]
}
const polygon = (r: (i: number) => number) =>
  Array.from({ length: 5 }, (_, i) =>
    point(i, r(i))
      .map((n) => n.toFixed(1))
      .join(',')
  ).join(' ')

/**
 * "Built around how interviews really work": four bento cards, each a count-up number with its own
 * mini visual - a skill pentagon that draws in, rising difficulty bars, resume checks ticking off,
 * and a live clock for "24/7".
 */
export function Numbers() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const counts = el.querySelectorAll('.count')
      if (prefersReducedMotion()) {
        countUp(counts, { duration: 0 })
        return
      }
      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      eyebrowIn(el.querySelector('.eyebrow')!)

      const st = { trigger: '.nb', start: 'top 78%' }
      gsap.from('.nb__card', { y: 80, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: st })
      ScrollTrigger.create({ ...st, once: true, onEnter: () => countUp(counts, { duration: 1.8 }) })

      // 1 · pentagon: grid fades in, the score shape draws then fills, dots pop
      const shape = el.querySelector<SVGPolygonElement>('.radar__shape')!
      const len = shape.getTotalLength()
      gsap.set(shape, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 })
      gsap
        .timeline({ scrollTrigger: st, delay: 0.3 })
        .from('.radar__grid', {
          scale: 0.6,
          autoAlpha: 0,
          transformOrigin: '50% 50%',
          duration: 0.8,
          stagger: 0.08,
          ease: 'expo.out',
        })
        .to(shape, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, '-=0.3')
        .to(shape, { fillOpacity: 0.28, duration: 0.6 }, '-=0.3')
        .from('.radar__dot', { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.08, ease: 'back.out(3)' }, '-=0.6')

      // 2 · difficulty bars rise one after another
      gsap.from('.lv__bar i', { scaleY: 0, duration: 1, stagger: 0.15, ease: 'expo.out', scrollTrigger: st, delay: 0.4 })

      // 3 · resume checks tick off in order
      gsap.from('.ck__row', {
        x: -24,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: st,
        delay: 0.4,
      })
      gsap.from('.ck__tick', {
        scale: 0,
        rotate: -90,
        duration: 0.6,
        stagger: 0.18,
        ease: 'back.out(3)',
        scrollTrigger: st,
        delay: 0.7,
      })

      // 4 · the clock keeps time (only while on screen)
      const hand = gsap.to('.clk__hand', { rotate: 360, svgOrigin: '100 100', duration: 14, ease: 'none', repeat: -1 })
      const minute = gsap.to('.clk__min', { rotate: 360, svgOrigin: '100 100', duration: 3.5, ease: 'none', repeat: -1 })
      whileVisible(el, [hand, minute])
    },
    { scope: root }
  )

  const { skills, levels, checks, always } = NUMBERS
  return (
    <section className="numbers" ref={root}>
      <div className="container">
        <div className="numbers__head">
          <p className="eyebrow eyebrow--muted">{NUMBERS.eyebrow}</p>
          <h2 className="section-title" data-split>
            {NUMBERS.lead} <em>{NUMBERS.accent}</em>
          </h2>
        </div>

        <div className="nb">
          {/* 1 · skills */}
          <article className="nb__card nb__card--skills">
            <div className="nb__top">
              <b className="nb__num count" data-to={skills.value}>
                0
              </b>
              <p className="nb__label">{skills.label}</p>
            </div>
            <svg className="radar" viewBox="-116 -22 432 246" role="img" aria-label={`Skills scored: ${skills.items.join(', ')}`}>
              {[1, 0.66, 0.33].map((k) => (
                <polygon key={k} className="radar__grid" points={polygon(() => 80 * k)} />
              ))}
              {Array.from({ length: 5 }, (_, i) => {
                const [x, y] = point(i, 80)
                return <line key={i} className="radar__axis" x1="100" y1="100" x2={x} y2={y} />
              })}
              <polygon className="radar__shape" points={polygon((i) => 80 * SCORES[i])} />
              {SCORES.map((s, i) => {
                const [x, y] = point(i, 80 * s)
                return <circle key={i} className="radar__dot" cx={x} cy={y} r="4.5" />
              })}
              {skills.items.map((label, i) => {
                const [x, y] = point(i, 100)
                return (
                  <text
                    key={label}
                    className="radar__label"
                    x={x}
                    y={y + 4}
                    textAnchor={x > 105 ? 'start' : x < 95 ? 'end' : 'middle'}
                  >
                    {label}
                  </text>
                )
              })}
            </svg>
          </article>

          {/* 2 · levels */}
          <article className="nb__card nb__card--levels">
            <div className="nb__top">
              <b className="nb__num count" data-to={levels.value}>
                0
              </b>
              <p className="nb__label">{levels.label}</p>
            </div>
            <div className="lv">
              {levels.items.map((label, i) => (
                <div className="lv__col" key={label}>
                  <span className="lv__bar" style={{ height: `${34 + i * 33}%` }}>
                    <i />
                  </span>
                  <span className="lv__label">{label}</span>
                </div>
              ))}
            </div>
          </article>

          {/* 3 · resume checks */}
          <article className="nb__card nb__card--checks">
            <div className="nb__top">
              <b className="nb__num count" data-to={checks.value}>
                0
              </b>
              <p className="nb__label">{checks.label}</p>
            </div>
            <ul className="ck">
              {checks.items.map((item, i) => (
                <li className="ck__row" key={item}>
                  <span className="ck__tick" aria-hidden="true">
                    <Check strokeWidth={3.2} />
                  </span>
                  {item}
                  <span className="ck__bar" style={{ width: `${[92, 78, 85, 70][i]}%` }} />
                </li>
              ))}
            </ul>
          </article>

          {/* 4 · always on */}
          <article className="nb__card nb__card--always">
            <div className="nb__top">
              <b className="nb__num">24/7</b>
              <p className="nb__label">{always.label}</p>
            </div>
            <svg className="clk" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="86" className="clk__face" />
              {Array.from({ length: 24 }, (_, i) => {
                const a = (i / 24) * Math.PI * 2
                const r1 = i % 6 === 0 ? 70 : 76
                return (
                  <line
                    key={i}
                    className={i % 6 === 0 ? 'clk__tick clk__tick--major' : 'clk__tick'}
                    x1={r2(100 + Math.sin(a) * r1)}
                    y1={r2(100 - Math.cos(a) * r1)}
                    x2={r2(100 + Math.sin(a) * 80)}
                    y2={r2(100 - Math.cos(a) * 80)}
                  />
                )
              })}
              <line className="clk__min" x1="100" y1="100" x2="100" y2="34" />
              <line className="clk__hand" x1="100" y1="100" x2="100" y2="52" />
              <circle cx="100" cy="100" r="6" className="clk__pin" />
            </svg>
            <p className="nb__note">{always.note}</p>
          </article>
        </div>
      </div>
    </section>
  )
}
