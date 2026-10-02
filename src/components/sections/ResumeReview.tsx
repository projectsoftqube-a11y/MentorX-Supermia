'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, eyebrowIn } from '@/lib/gsap'
import { ArrowRight } from 'lucide-react'
import { REVIEW } from '@/data/landing'

/** A phrase in the sample resume that the review points at */
function Hit({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <mark className="rv__hit" data-hit={i}>
      {children}
    </mark>
  )
}

/**
 * "Small details, big difference" - a resume under live review.
 * Desktop: the section pins; a highlight ring glides from issue to issue on the page, each fix card
 * slides in beside it, the step list tracks progress, and the match score climbs at the end.
 * Phones: every issue is highlighted at once and the fixes list below the page.
 */
export function ResumeReview() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const hits = gsap.utils.toArray<HTMLElement>('.rv__hit')
      const fixes = gsap.utils.toArray<HTMLElement>('.rv__fix')
      const steps = gsap.utils.toArray<HTMLElement>('.rv__step')
      const score = el.querySelector<HTMLElement>('.rv__score b')!
      const setActive = (n: number) => {
        hits.forEach((h, k) => {
          h.classList.toggle('is-hit', k <= n)
          h.classList.toggle('is-current', k === n)
        })
        fixes.forEach((f, k) => f.classList.toggle('is-current', k === n))
        steps.forEach((s, k) => {
          s.classList.toggle('is-done', k < n)
          s.classList.toggle('is-current', k === n)
        })
      }

      if (prefersReducedMotion()) {
        setActive(hits.length - 1)
        score.textContent = String(REVIEW.scoreTo)
        return
      }
      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      eyebrowIn(el.querySelector('.eyebrow')!)

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1081px)', () => {
        const paper = el.querySelector<HTMLElement>('.rv__paper')!
        const lens = el.querySelector<HTMLElement>('.rv__lens')!
        // lens geometry for each highlighted phrase, relative to the page (re-measured on refresh)
        const box = (i: number) => {
          // layout offsets (not getBoundingClientRect) so the page's tilt/entry animation can't skew them
          let x = 0
          let y = 0
          let n: HTMLElement | null = hits[i]
          while (n && n !== paper) {
            x += n.offsetLeft
            y += n.offsetTop
            n = n.offsetParent as HTMLElement | null
          }
          return { x: x + hits[i].offsetWidth / 2, y: y + hits[i].offsetHeight / 2, w: hits[i].offsetWidth + 26 }
        }
        gsap.set(fixes, { autoAlpha: 0, y: 50 })
        gsap.set(lens, { xPercent: -50, yPercent: -50 })
        const scoreProxy = { v: REVIEW.scoreFrom }
        score.textContent = String(REVIEW.scoreFrom)

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: `+=${hits.length * 70}%`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const t = self.progress * tl.duration()
              const reached = hits.filter((_, i) => t >= tl.labels[`h${i}`] - 0.02).length
              setActive(reached - 1)
            },
          },
        })
        tl.from(paper, { y: 80, rotate: 4, autoAlpha: 0, duration: 0.8, ease: 'power3.out' })
          .set(lens, { x: () => box(0).x, y: () => box(0).y, width: () => box(0).w })
          .from(lens, { scale: 0.4, autoAlpha: 0, duration: 0.4 })
        hits.forEach((_, i) => {
          tl.addLabel(`h${i}`)
          if (i > 0) tl.to(lens, { x: () => box(i).x, y: () => box(i).y, width: () => box(i).w, duration: 0.8 }, `h${i}`)
          if (i > 0) tl.to(fixes[i - 1], { autoAlpha: 0, y: -40, duration: 0.4, ease: 'power2.in' }, `h${i}`)
          tl.to(fixes[i], { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }, `h${i}+=0.25`)
            .fromTo('.rv__trackfill', { scaleX: i / hits.length }, { scaleX: (i + 1) / hits.length, duration: 0.6 }, `h${i}`)
            .to({}, { duration: 0.6 })
        })
        tl.addLabel('score')
          .to(scoreProxy, {
            v: REVIEW.scoreTo,
            duration: 0.9,
            ease: 'power2.out',
            onUpdate: () => {
              score.textContent = String(Math.round(scoreProxy.v))
            },
          })
          .fromTo('.rv__score', { scale: 0.9 }, { scale: 1.08, duration: 0.3, yoyo: true, repeat: 1 }, '<0.5')
          .to(lens, { autoAlpha: 0, duration: 0.3 }, '<')
          .to({}, { duration: 0.4 })
      })

      mm.add('(max-width: 1080px)', () => {
        setActive(hits.length - 1)
        gsap.from('.rv__paper', {
          y: 60,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.rv__paper', start: 'top 85%' },
        })
        gsap.from(fixes, {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.rv__fixes', start: 'top 85%' },
        })
        ScrollTrigger.create({
          trigger: '.rv__fixes',
          start: 'top 80%',
          once: true,
          onEnter: () => {
            const proxy = { v: REVIEW.scoreFrom }
            gsap.to(proxy, {
              v: REVIEW.scoreTo,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                score.textContent = String(Math.round(proxy.v))
              },
            })
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section className="rv" ref={root}>
      <div className="container rv__layout">
        {/* Full-width heading row */}
        <div className="rv__intro">
          <div>
            <p className="eyebrow eyebrow--muted">{REVIEW.eyebrow}</p>
            <h2 className="section-title" data-split>
              {REVIEW.lead} <em>{REVIEW.accent}</em>
            </h2>
          </div>
          <div className="rv__introside">
            <p className="lead">{REVIEW.sub}</p>
            <p className="rv__score">
              ATS match <b>{REVIEW.scoreFrom}</b>
              <span>%</span>
            </p>
          </div>
        </div>

        <div className="rv__body">
          {/* Left: the resume page */}
          <div className="rv__paper" aria-label="Sample resume being reviewed">
            <span className="rv__lens" aria-hidden="true" />
            <div className="rv__head">
              <p className="rv__name">Alex Morgan</p>
              <p className="rv__role">Product Designer · alex.morgan@email.com · Austin, TX</p>
            </div>
            <p className="rv__h">Summary</p>
            <p className="rv__p">
              Designer with four years of experience who <Hit i={0}>helped</Hit> teams ship simpler, faster products.
            </p>
            <p className="rv__h">Experience</p>
            <div className="rv__job">
              <p className="rv__jt">
                Senior Product Designer - Brightpath <span>2021 – Present</span>
              </p>
              <ul>
                <li>
                  Redesigned the onboarding flow, <Hit i={1}>improving activation</Hit>.
                </li>
                <li>
                  Worked closely with engineers to <Hit i={2}>recieve</Hit> and act on user feedback.
                </li>
              </ul>
            </div>
            <div className="rv__job">
              <p className="rv__jt">
                Product Designer - Loop Studio{' '}
                <span>
                  <Hit i={3}>Jan 2019 – 2021</Hit>
                </span>
              </p>
              <ul>
                <li>Built the first design system used across three product teams.</li>
              </ul>
            </div>
            <p className="rv__h">Skills</p>
            <p className="rv__skills">
              <span>Figma</span>
              <span>Prototyping</span>
              <span>User research</span>
              <Hit i={4}>
                <span className="rv__slot">+ add keyword</span>
              </Hit>
            </p>
          </div>

          {/* Right: one large fix at a time */}
          <div className="rv__fixes">
            {REVIEW.fixes.map((f, i) => (
              <article className="rv__fix" key={f.tag}>
                <p className="rv__fixtag">
                  <span>{i + 1}</span>
                  {f.tag}
                </p>
                <p className="rv__change">
                  <s>{f.before}</s>
                  <span aria-hidden="true">
                    <ArrowRight strokeWidth={2.4} />
                  </span>
                  <b>{f.after}</b>
                </p>
                <p className="rv__why">{f.why}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Full-width step tracker */}
        <div className="rv__track">
          <span className="rv__trackline" aria-hidden="true">
            <span className="rv__trackfill" />
          </span>
          <ol className="rv__steps">
            {REVIEW.fixes.map((f, i) => (
              <li className="rv__step" key={f.tag}>
                <span className="rv__stepnum">{i + 1}</span>
                {f.tag}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
