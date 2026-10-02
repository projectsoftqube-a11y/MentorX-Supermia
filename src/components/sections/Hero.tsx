'use client'

import { useRef } from 'react'
import { gsap, useGSAP, SplitText, ScrollTrigger, prefersReducedMotion, animateWaves, whileVisible } from '@/lib/gsap'
import { AudioLines, Captions, Check, Mic, PhoneOff, Play, Sparkles } from 'lucide-react'
import { Img } from '@/components/ui/Img'
import { BtnArrow } from '@/components/ui/BtnArrow'
import { HERO, HERO_DEMO, SITE } from '@/data/landing'

const RING_C = 2 * Math.PI * 34

/** Candidate bubbles floating around the headline (decorative, desktop only) */
const DECO = [
  { img: '/img/student-cowork.jpg', label: 'Data Analyst', score: 82, depth: 1.2 },
  { img: '/img/professional-blazer.jpg', label: 'Product Manager', score: 88, depth: 0.8 },
  { img: '/img/experienced-pro.jpg', label: 'Engineering Lead', score: 91, depth: 1 },
  { img: '/img/candidate-call.jpg', label: 'UX Designer', score: 79, depth: 1.4 },
]
const BAR_LABELS = ['Relevance', 'Communication', 'Structure']

/**
 * Centered, cinematic hero:
 * - headline block with a cursor spotlight
 * - a wide "live call" (AI interviewer | you) that starts tilted in 3D and flattens as you scroll
 * - the call plays a loop: question captioned → your answer captioned → score + coach tip
 * Everything animates transforms/opacity only, and loops pause while the hero is off-screen.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)

  // Scroll + pointer motion
  useGSAP(
    (_ctx, contextSafe) => {
      if (prefersReducedMotion()) return
      const el = root.current!

      const ambient = [
        ...animateWaves(el),
        ...gsap.utils.toArray<HTMLElement>('.hero__mesh span').map((b, i) =>
          gsap.to(b, {
            xPercent: gsap.utils.random(-18, 18),
            yPercent: gsap.utils.random(-14, 14),
            scale: gsap.utils.random(0.9, 1.15),
            duration: gsap.utils.random(9, 13),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.8,
          })
        ),
      ]
      ambient.push(
        ...gsap.utils.toArray<HTMLElement>('.deco__inner').map((d, i) =>
          gsap.to(d, {
            y: i % 2 ? 14 : -14,
            rotate: i % 2 ? 3 : -3,
            duration: 3 + i * 0.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })
        )
      )
      whileVisible(el, ambient)
      // bubbles drift up a little faster than the page as you scroll away
      gsap.utils.toArray<HTMLElement>('.deco').forEach((d) => {
        gsap.to(d, {
          yPercent: -90 * Number(d.dataset.depth || 1),
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      // The call flattens out of a 3D tilt and grows as it scrolls into view
      gsap.fromTo(
        '.call',
        { rotateX: 24, scale: 0.84, yPercent: 4 },
        {
          rotateX: 0,
          scale: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.call-wrap', start: 'top 92%', end: 'top 18%', scrub: true },
        }
      )
      // Headline block eases up and fades as you move on
      gsap.to('.hero2__head', {
        yPercent: -22,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: '.call-wrap', start: 'top 70%', end: 'top 5%', scrub: true },
      })
      // Floating cards drift at different speeds (yPercent, so pointer parallax on x/y never conflicts)
      gsap.utils.toArray<HTMLElement>('.float-card').forEach((card) => {
        gsap.fromTo(
          card,
          { yPercent: 40 * Number(card.dataset.depth || 1) },
          {
            yPercent: -40 * Number(card.dataset.depth || 1),
            ease: 'none',
            scrollTrigger: { trigger: '.call-wrap', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })

      if (!window.matchMedia('(pointer: fine)').matches || !contextSafe) return

      // Cursor spotlight + gentle parallax on the floating cards
      const spot = el.querySelector('.hero__spot')!
      const sx = gsap.quickTo(spot, 'x', { duration: 0.8, ease: 'power3' })
      const sy = gsap.quickTo(spot, 'y', { duration: 0.8, ease: 'power3' })
      const cards = gsap.utils.toArray<HTMLElement>('.float-card, .deco').map((c) => ({
        d: Number(c.dataset.depth || 1),
        x: gsap.quickTo(c, 'x', { duration: 1, ease: 'power3' }),
        y: gsap.quickTo(c, 'y', { duration: 1, ease: 'power3' }),
      }))
      const onMove = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        sx(e.clientX - r.left)
        sy(e.clientY - r.top)
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        cards.forEach((c) => {
          c.x(nx * 30 * c.d)
          c.y(ny * 22 * c.d)
        })
      })
      el.addEventListener('pointermove', onMove)
      return () => el.removeEventListener('pointermove', onMove)
    },
    { scope: root }
  )

  // Intro on load, then the live-call loop
  useGSAP(
    () => {
      const el = root.current!
      const role = el.querySelector<HTMLElement>('.call__role')!
      const qText = el.querySelector<HTMLElement>('.cap--ai .cap__text')!
      const aText = el.querySelector<HTMLElement>('.cap--you .cap__text')!
      const aiTile = el.querySelector<HTMLElement>('.tile--ai')!
      const youTile = el.querySelector<HTMLElement>('.tile--you')!
      const scoreNum = el.querySelector<HTMLElement>('.hv-score__num')!
      const ringFill = el.querySelector('.hv-score .ring__fill')!
      const bars = gsap.utils.toArray<HTMLElement>('.hv-score__bar i')
      const tip = el.querySelector<HTMLElement>('.hv-tip')!
      const tipText = el.querySelector<HTMLElement>('.hv-tip__text')!
      const timer = el.querySelector<HTMLElement>('.call__timer')!

      if (prefersReducedMotion()) {
        scoreNum.textContent = String(HERO_DEMO[0].score)
        gsap.set(ringFill, { strokeDashoffset: RING_C * (1 - HERO_DEMO[0].score / 100) })
        gsap.set(bars, { scaleX: 0.85 })
        return
      }

      // ---- Intro ---------------------------------------------------------------
      gsap.set(bars, { scaleX: 0 })
      gsap.set(tip, { autoAlpha: 0, y: 16 })

      // autoSplit re-splits (after the web font loads, on resize) by restoring the original markup, which
      // swaps in a fresh underline path - so the underline is looked up and drawn inside onSplit each time.
      // Returning the timeline lets SplitText carry its progress over, so a re-split never replays it.
      SplitText.create('.hero2__title', {
        type: 'lines,words',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) => {
          const scribble = el.querySelector<SVGPathElement>('.scribble path')!
          const len = scribble.getTotalLength()
          return gsap
            .timeline()
            .from(self.words, { yPercent: 120, rotate: 6, duration: 1.3, ease: 'expo.out', stagger: 0.05 }, 0.1)
            .fromTo(
              scribble,
              { strokeDasharray: len, strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
              1
            )
        },
      })

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero2__eyebrow', { y: 20, autoAlpha: 0, duration: 1 }, 0)
        .from('.hero2__sub', { y: 30, autoAlpha: 0, duration: 1.1 }, 0.6)
        .from('.hero2__ctas > *', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.75)
        .from('.hero2__perks li', { y: 16, autoAlpha: 0, duration: 0.9, stagger: 0.07 }, 0.9)
        .from('.call-wrap', { y: 140, autoAlpha: 0, duration: 1.6 }, 0.5)
        .from('.float-card:not(.hv-tip)', { scale: 0.8, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'back.out(1.6)' }, 1.3)
        .from('.deco__inner', { scale: 0, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: 'back.out(1.8)' }, 0.8)

      // ---- Call timer -------------------------------------------------------------
      const clock = { s: 0 }
      const clockTween = gsap.to(clock, {
        s: 3600,
        duration: 3600,
        ease: 'none',
        onUpdate: () => {
          const s = Math.floor(clock.s)
          timer.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
        },
      })

      // ---- Live call loop ---------------------------------------------------------
      const typeInto = (target: HTMLElement, text: string, perChar: number) => {
        const t = { n: 0 }
        return gsap.fromTo(
          t,
          { n: 0 },
          {
            n: text.length,
            duration: text.length * perChar,
            ease: 'none',
            onUpdate: () => {
              target.textContent = text.slice(0, Math.round(t.n))
            },
          }
        )
      }

      const loop = gsap.timeline({ repeat: -1, delay: 2.2 })
      HERO_DEMO.forEach((d) => {
        const score = { v: 0 }
        const widths = [Math.min(98, d.score + 6), Math.max(40, d.score - 8), Math.min(96, d.score + 2)]
        loop
          .call(() => {
            role.textContent = `${d.role} · Mock interview`
            qText.textContent = ''
            aText.textContent = ''
            scoreNum.textContent = '0'
            tipText.textContent = d.tip
            aiTile.classList.add('is-speaking')
            youTile.classList.remove('is-speaking')
          })
          .set(ringFill, { strokeDashoffset: RING_C })
          .add(typeInto(qText, d.question, 0.032))
          .call(
            () => {
              aiTile.classList.remove('is-speaking')
              youTile.classList.add('is-speaking')
            },
            [],
            '+=0.4'
          )
          .add(typeInto(aText, d.answer, 0.026), '+=0.3')
          .call(() => youTile.classList.remove('is-speaking'), [], '+=0.3')
          .to(ringFill, { strokeDashoffset: RING_C * (1 - d.score / 100), duration: 1.3, ease: 'power3.out' })
          .to(
            score,
            {
              v: d.score,
              duration: 1.3,
              ease: 'power3.out',
              onUpdate: () => {
                scoreNum.textContent = String(Math.round(score.v))
              },
            },
            '<'
          )
          .fromTo(
            bars,
            { scaleX: 0 },
            { scaleX: (k: number) => widths[k] / 100, duration: 1.1, stagger: 0.08, ease: 'power3.out' },
            '<'
          )
          .to(tip, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.5')
          .to({}, { duration: 2.6 })
          .to(tip, { y: -10, autoAlpha: 0, duration: 0.4, ease: 'power2.in' })
          .to(bars, { scaleX: 0, duration: 0.4, ease: 'power2.in' }, '<')
          .set(tip, { y: 16 })
      })

      // Loops only run while the hero is on screen
      whileVisible(el, [clockTween, loop])
      ScrollTrigger.refresh()
    },
    { scope: root }
  )

  return (
    <section className="hero2" id="hero" ref={root}>
      <div className="hero__mesh" aria-hidden="true">
        <span className="m1" />
        <span className="m2" />
        <span className="m3" />
      </div>
      <div className="hero__lines" aria-hidden="true" />
      <div className="hero__spot" aria-hidden="true" />

      {/* Headline block */}
      <div className="container hero2__head">
        <div className="hero2__deco" aria-hidden="true">
          {DECO.map((d, i) => (
            <div className={`deco deco--${i + 1}`} data-depth={d.depth} key={d.label}>
              <div className="deco__inner">
                <span className="deco__img">
                  <Img src={d.img} width={160} height={160} sizes="80px" />
                </span>
                <span className="deco__tag">
                  {d.label} <b>{d.score}</b>
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="eyebrow hero2__eyebrow">
          <span className="eyebrow__dot" aria-hidden="true" />
          {HERO.eyebrow.map((item) => (
            <span className="hero2__tag" key={item}>
              {item}
            </span>
          ))}
        </p>
        <h1 className="hero2__title">
          {HERO.titleLead}{' '}
          <span className="hero__accent">
            <em>{HERO.titleAccent}</em>
            <svg className="scribble" viewBox="0 0 220 28" preserveAspectRatio="none" aria-hidden="true">
              <path d="M4 18 C 50 6, 120 4, 216 14 M 30 24 C 90 16, 150 15, 206 20" />
            </svg>
          </span>
        </h1>

        <p className="hero2__sub">{HERO.sub}</p>

        <div className="hero2__ctas">
          <a href={SITE.appUrl} className="btn btn--primary btn--lg magnetic" data-cursor="Start">
            <span className="btn__label">{HERO.primaryCta}</span>
            <BtnArrow />
          </a>
          <a href="#how" className="btn btn--ghost btn--lg magnetic" data-cursor="Watch">
            <span className="btn__play" aria-hidden="true">
              <Play fill="currentColor" strokeWidth={2} />
            </span>
            <span className="btn__label">{HERO.secondaryCta}</span>
          </a>
        </div>

        <ul className="hero2__perks">
          {HERO.perks.map((p) => (
            <li key={p}>
              <span className="perk__tick" aria-hidden="true">
                <Check strokeWidth={3.2} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Live call */}
      <div
        className="call-wrap"
        role="img"
        aria-label="Preview of a MentorX practice interview: the AI interviewer asks a question, you answer, and you get a score and a coaching tip"
      >
        <div className="call">
          <div className="call__top">
            <span className="call__live">
              <i /> Live · <b className="call__timer">00:00</b>
            </span>
            <span className="call__role">{HERO_DEMO[0].role} · Mock interview</span>
            <span className="call__level">Intermediate</span>
          </div>

          <div className="call__grid">
            <div className="tile tile--ai is-speaking">
              <div className="tile__orb">
                <span className="ring-a" />
                <span className="ring-b" />
                <Img src="/brand/mentorx-icon.png" width={120} height={120} sizes="64px" />
              </div>
              <p className="tile__name">AI interviewer</p>
              <div className="cap cap--ai">
                <span className="cap__who">Interviewer</span>
                <p className="cap__text">{HERO_DEMO[0].question}</p>
              </div>
            </div>

            <div className="tile tile--you">
              <Img
                src="/img/hero-candidate.jpg"
                alt=""
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                width={1600}
                height={900}
              />
              <span className="tile__tag">You</span>
              <div className="cap cap--you">
                <span className="cap__who">
                  You
                  <span className="wave wave--light cap__wave">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <i key={i} />
                    ))}
                  </span>
                </span>
                <p className="cap__text">{HERO_DEMO[0].answer}</p>
              </div>
            </div>
          </div>

          <div className="call__dock" aria-hidden="true">
            <span className="dock__btn">
              <Mic />
            </span>
            <span className="dock__btn">
              <AudioLines />
            </span>
            <span className="dock__btn dock__btn--cc">
              <Captions />
            </span>
            <span className="dock__end">
              <PhoneOff />
              End
            </span>
          </div>
        </div>

        {/* Floating cards around the call */}
        <div className="float-card chip-ats" data-depth="1.3">
          <span className="chip-ats__ring">84</span>
          <div>
            <p className="ui-strong">Resume match</p>
            <p className="ui-muted">7 keywords found · 2 missing</p>
          </div>
        </div>

        <div className="float-card hv-score" data-depth="0.9">
          <div className="hv-score__top">
            <div className="ring ring--sm hv-score__ring">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" className="ring__track" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="ring__fill"
                  style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C }}
                />
              </svg>
              <b className="hv-score__num">0</b>
            </div>
            <div>
              <p className="ui-strong">Answer score</p>
              <p className="ui-muted">After every answer</p>
            </div>
          </div>
          {BAR_LABELS.map((label) => (
            <div className="hv-score__bar" key={label}>
              <span>{label}</span>
              <b>
                <i />
              </b>
            </div>
          ))}
        </div>

        <div className="float-card hv-tip" data-depth="1.6">
          <span className="hv-tip__icon" aria-hidden="true">
            <Sparkles fill="currentColor" strokeWidth={1.5} />
          </span>
          <div>
            <p className="hv-tip__label">Coach tip</p>
            <p className="hv-tip__text">{HERO_DEMO[0].tip}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
