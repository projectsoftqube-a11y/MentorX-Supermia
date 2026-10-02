'use client'

import { useId, useRef } from 'react'
import { Check, ClipboardList, FileText, Lock, Mic, Sparkles } from 'lucide-react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, whileVisible, eyebrowIn } from '@/lib/gsap'
import { BtnArrow } from '@/components/ui/BtnArrow'
import { HERO_DEMO, HOW, LIVE, SITE, STEPS } from '@/data/landing'

const PATHS = ['resume-check', 'mock-interview', 'report']

/* Step 1 · match */
const MATCH = 84
const MATCH_C = 2 * Math.PI * 52
const FOUND = ['Figma', 'User research', 'Prototyping']
const MISSING = ['A/B testing', 'Design systems']

/* Step 3 · score over three tries (chart viewBox 0 0 600 130) */
const TRIES = [62, 74, 86]
const chartY = (score: number) => Math.round((115 - (score - 50) * 2.1) * 10) / 10
const PTS = TRIES.map((s, i) => [40 + i * 260, chartY(s)] as const)
const LINE = `M${PTS[0][0]} ${PTS[0][1]} C 170 ${PTS[0][1]}, 170 ${PTS[1][1]}, ${PTS[1][0]} ${PTS[1][1]} S 430 ${PTS[2][1]}, ${PTS[2][0]} ${PTS[2][1]}`
const AREA = `${LINE} L ${PTS[2][0]} 130 L ${PTS[0][0]} 130 Z`

const DEMO = HERO_DEMO[0]

/** Words as spans, so an answer can appear word by word without the layout jumping */
const words = (text: string) =>
  text.split(' ').map((w, i) => (
    <span key={i}>
      {i > 0 ? ' ' : ''}
      <span className="sc__w">{w}</span>
    </span>
  ))

/** Screen 1 · resume + job description in, match score and keywords out */
function ResumeScreen() {
  return (
    <div className="sc sc--resume">
      <div className="sc__col">
        <p className="sc__label">Your resume</p>
        <div className="sc__card sc__file">
          <span className="sc__fileicon">
            <FileText strokeWidth={2} />
          </span>
          <div className="sc__filemeta">
            <b>Alex_Morgan_Resume.pdf</b>
            <small>2 pages · uploaded</small>
          </div>
          <span className="sc__ok">
            <Check strokeWidth={3.2} />
          </span>
        </div>
        <p className="sc__label">The job</p>
        <div className="sc__card sc__jd">
          <p className="sc__jdtitle">
            <ClipboardList strokeWidth={2} /> {DEMO.role} · Fintech
          </p>
          {['96%', '82%', '90%', '70%', '54%'].map((w) => (
            <span className="sc__jdline" key={w} style={{ width: w }} />
          ))}
        </div>
      </div>

      <div className="sc__card sc__result">
        <div className="sc__gauge">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="52" className="sc__gtrack" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="sc__gfill"
              style={{ strokeDasharray: MATCH_C, strokeDashoffset: MATCH_C * (1 - MATCH / 100) }}
            />
          </svg>
          <b>
            <span className="sc__matchnum">{MATCH}</span>
            <small>%</small>
          </b>
        </div>
        <p className="sc__verdict">Strong match</p>
        <div className="sc__kw">
          <p>Found</p>
          <div>
            {FOUND.map((k) => (
              <span className="sc__chip sc__chip--ok" key={k}>
                {k}
              </span>
            ))}
          </div>
        </div>
        <div className="sc__kw">
          <p>Missing</p>
          <div>
            {MISSING.map((k) => (
              <span className="sc__chip sc__chip--miss" key={k}>
                + {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Screen 2 · pick a level, the interviewer asks, your answer becomes a transcript */
function PracticeScreen() {
  return (
    <div className="sc sc--practice">
      <div className="sc__levels">
        <span className="sc__levelpill" />
        {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
          <span key={l} className={l === 'Intermediate' ? 'is-on' : undefined}>
            {l}
          </span>
        ))}
      </div>
      <div className="sc__speaker">
        <span className="sc__orb">
          <i />
          <i />
          <b />
        </span>
        <div>
          <p className="sc__name">AI interviewer</p>
          <small>{DEMO.role} · Intermediate</small>
        </div>
        <span className="sc__wave">
          {Array.from({ length: 14 }).map((_, i) => (
            <i key={i} />
          ))}
        </span>
      </div>
      <p className="sc__q">“{DEMO.question}”</p>
      <p className="sc__a">
        <span className="sc__who">You</span>
        {words(DEMO.answer)}
      </p>
      <p className="sc__rec">
        <span className="sc__recbtn">
          <Mic strokeWidth={2.2} />
        </span>
        Recording · <b>00:42</b>
      </p>
    </div>
  )
}

/** Screen 3 · the report: score over tries, skills, and the one thing to fix */
function ReportScreen() {
  // each window renders its own copy of this chart, so the gradient needs a unique id
  const areaId = `scArea${useId().replace(/[^\w-]/g, '')}`
  return (
    <div className="sc sc--report">
      <div className="sc__card sc__chartcard">
        <div className="sc__chhead">
          <div>
            <small>Your score</small>
            <b className="sc__scorenum">{TRIES[TRIES.length - 1]}</b>
          </div>
          <span className="sc__delta">+{TRIES[TRIES.length - 1] - TRIES[0]} in 3 tries</span>
        </div>
        <svg className="sc__chart" viewBox="0 0 600 130" aria-hidden="true">
          <defs>
            <linearGradient id={areaId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#168a63" stopOpacity="0.26" />
              <stop offset="1" stopColor="#168a63" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 70, 110].map((y) => (
            <line key={y} x1="0" x2="600" y1={y} y2={y} className="sc__gridline" />
          ))}
          <path d={AREA} className="sc__area" fill={`url(#${areaId})`} />
          <path d={LINE} className="sc__line" />
          {PTS.map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="7" className="sc__dot" />
          ))}
        </svg>
        <div className="sc__tries">
          {TRIES.map((s, i) => (
            <span key={s}>
              Try {i + 1} · <b>{s}</b>
            </span>
          ))}
        </div>
      </div>
      <div className="sc__card sc__skills">
        {LIVE.feedback.bars.map((b) => (
          <div className="sc__bar" key={b.label}>
            <span>{b.label}</span>
            <b>
              <i style={{ transform: `scaleX(${b.value / 100})` }} />
            </b>
            <em>{b.value}</em>
          </div>
        ))}
      </div>
      <div className="sc__fix">
        <span className="sc__fixicon">
          <Sparkles strokeWidth={2} />
        </span>
        <div>
          <p className="sc__fixlabel">Fix this first</p>
          <p>{DEMO.tip}</p>
        </div>
      </div>
    </div>
  )
}

const SCREENS = [ResumeScreen, PracticeScreen, ReportScreen]

/** The app window: browser chrome + all three screens (desktop) or just one (`only`, phones) */
function AppWindow({ only }: { only?: number }) {
  const list = only === undefined ? SCREENS.map((_, i) => i) : [only]
  const first = list[0]
  return (
    <div className={`hw2__window${only === undefined ? '' : ' hw2__window--inline'}`} data-step={first} aria-hidden="true">
      <div className="hw2__chrome">
        <span className="hw2__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="hw2__url">
          <Lock strokeWidth={2.4} />
          <span className="hw2__host">app.mentorx.supermia.ai/</span>
          <b className="hw2__path">{PATHS[first]}</b>
        </span>
        <span className="hw2__count">
          Step <b className="hw2__countnum">{first + 1}</b> of {SCREENS.length}
        </span>
      </div>
      <div className="hw2__screens">
        {list.map((i) => {
          const Screen = SCREENS[i]
          return (
            <div className={`hw2__screen${i === first ? ' is-active' : ''}`} key={i} data-screen={i}>
              <Screen />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The little intro each screen plays when it comes into view */
function screenTimeline(screen: HTMLElement, i: number) {
  const q = gsap.utils.selector(screen)
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })

  if (i === 0) {
    const num = q('.sc__matchnum')[0]
    const match = { v: 0 }
    tl.from(q('.sc__file'), { x: -30, autoAlpha: 0, duration: 0.8 })
      .from(q('.sc__ok'), { scale: 0, rotate: -90, duration: 0.5, ease: 'back.out(3)' }, '-=0.35')
      .from(q('.sc__jdline'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.6, stagger: 0.06 }, '-=0.3')
      .fromTo(
        q('.sc__gfill'),
        { strokeDashoffset: MATCH_C },
        { strokeDashoffset: MATCH_C * (1 - MATCH / 100), duration: 1.4, ease: 'power3.out', immediateRender: false },
        0.3
      )
      .fromTo(
        match,
        { v: 0 },
        {
          v: MATCH,
          duration: 1.4,
          ease: 'power3.out',
          immediateRender: false,
          onUpdate: () => {
            num.textContent = String(Math.round(match.v))
          },
        },
        '<'
      )
      .from(q('.sc__verdict'), { y: 12, autoAlpha: 0, duration: 0.6 }, '-=0.6')
      .from(q('.sc__chip'), { scale: 0.6, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(2)' }, '-=0.4')
  }

  if (i === 1) {
    tl.fromTo(
      q('.sc__levelpill'),
      { xPercent: -100 },
      { xPercent: 0, duration: 0.9, ease: 'expo.inOut', immediateRender: false }
    )
      .from(q('.sc__speaker'), { y: 18, autoAlpha: 0, duration: 0.7 }, '-=0.3')
      .from(q('.sc__q'), { y: 18, autoAlpha: 0, duration: 0.7 }, '-=0.45')
      .from(q('.sc__a'), { y: 18, autoAlpha: 0, duration: 0.6 }, '+=0.2')
      .from(q('.sc__w'), { opacity: 0.08, duration: 0.3, stagger: 0.05, ease: 'none' }, '-=0.3')
      .from(q('.sc__rec'), { y: 12, autoAlpha: 0, duration: 0.6 }, '<')
  }

  if (i === 2) {
    const line = q('.sc__line')[0] as unknown as SVGPathElement
    const len = line.getTotalLength()
    const num = q('.sc__scorenum')[0]
    const score = { v: TRIES[0] }
    tl.fromTo(
      line,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', immediateRender: false }
    )
      .from(q('.sc__area'), { autoAlpha: 0, duration: 0.8, ease: 'power1.out' }, 0.5)
      .from(q('.sc__dot'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.55, ease: 'back.out(3)' }, 0)
      .fromTo(
        score,
        { v: TRIES[0] },
        {
          v: TRIES[TRIES.length - 1],
          duration: 1.4,
          ease: 'power2.inOut',
          immediateRender: false,
          onUpdate: () => {
            num.textContent = String(Math.round(score.v))
          },
        },
        0
      )
      .from(q('.sc__delta'), { scale: 0.5, autoAlpha: 0, duration: 0.6, ease: 'back.out(2.5)' }, '-=0.3')
      .from(q('.sc__bar i'), { scaleX: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0.6)
      .from(q('.sc__fix'), { y: 20, autoAlpha: 0, duration: 0.7 }, '-=0.5')
  }
  return tl
}

/**
 * "Ready in three simple steps" - a scroll story. Left: the three steps as large text blocks;
 * right: one app window that stays in view and switches to the matching screen as each step
 * reaches the middle of the screen. Phones show each step's screen right under its text.
 */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const steps = gsap.utils.toArray<HTMLElement>('.hw2__step')
      const win = el.querySelector<HTMLElement>('.hw2__sticky .hw2__window')!
      const screens = gsap.utils.toArray<HTMLElement>('.hw2__sticky .hw2__screen')
      const path = win.querySelector<HTMLElement>('.hw2__path')!
      const countNum = win.querySelector<HTMLElement>('.hw2__countnum')!
      const reduce = prefersReducedMotion()
      const tls = reduce ? [] : screens.map((s, i) => screenTimeline(s, i))

      let current = -1
      const setActive = (i: number) => {
        if (i === current) return
        current = i
        steps.forEach((s, k) => s.classList.toggle('is-active', k === i))
        screens.forEach((s, k) => s.classList.toggle('is-active', k === i))
        win.dataset.step = String(i)
        path.textContent = PATHS[i]
        countNum.textContent = String(i + 1)
        tls[i]?.restart()
      }

      // whichever step crosses the middle of the screen drives the window
      steps.forEach((step, i) =>
        ScrollTrigger.create({
          trigger: step,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      )
      // the first screen plays as soon as the window comes into view
      ScrollTrigger.create({ trigger: '.hw2', start: 'top 75%', once: true, onEnter: () => current < 0 && setActive(0) })

      if (reduce) return

      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      eyebrowIn(el.querySelector('.eyebrow')!)
      gsap.from(['.how__sub', '.how__cta'], {
        y: 26,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.how__head', start: 'top 75%' },
      })
      gsap.from('.hw2__sticky', {
        y: 80,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.hw2', start: 'top 80%' },
      })

      // progress line beside the steps fills as you read
      gsap.fromTo(
        '.hw2__progress i',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.hw2__steps', start: 'top 55%', end: 'bottom 55%', scrub: true },
        }
      )

      // interviewer voice bars loop while the section is on screen
      const wave = gsap.utils.toArray<HTMLElement>('.sc__wave i').map((bar, i) =>
        gsap.fromTo(
          bar,
          { scaleY: 0.3 },
          {
            scaleY: () => gsap.utils.random(0.3, 1),
            duration: () => gsap.utils.random(0.25, 0.55),
            ease: 'sine.inOut',
            repeat: -1,
            repeatRefresh: true,
            yoyo: true,
            delay: (i % 14) * 0.04,
          }
        )
      )
      whileVisible(el, wave)
      ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', toggleClass: 'is-onscreen' })

      // phones: each inline screen plays when it scrolls in
      gsap.utils.toArray<HTMLElement>('.hw2__inline .hw2__screen').forEach((screen) => {
        const tl = screenTimeline(screen, Number(screen.dataset.screen))
        ScrollTrigger.create({ trigger: screen, start: 'top 80%', onEnter: () => tl.restart() })
      })
    },
    { scope: root }
  )

  return (
    <section className="how" id="how" ref={root}>
      <div className="container">
        <header className="how__head">
          <div>
            <p className="eyebrow eyebrow--muted">{HOW.eyebrow}</p>
            <h2 className="section-title" data-split>
              {HOW.lead} <em>{HOW.accent}</em>
            </h2>
          </div>
          <div className="how__aside">
            <p className="lead how__sub">{HOW.sub}</p>
            <a href={SITE.appUrl} className="btn btn--primary btn--lg magnetic how__cta" data-cursor="Start">
              <span className="btn__label">Start your first practice</span>
              <BtnArrow />
            </a>
          </div>
        </header>

        <div className="hw2">
          <ol className="hw2__steps">
            <li className="hw2__progress" aria-hidden="true">
              <i />
            </li>
            {STEPS.map((s, i) => (
              <li className={`hw2__step${i === 0 ? ' is-active' : ''}`} key={s.title}>
                <span className="hw2__num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="ticks hw2__points">
                  {s.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <div className="hw2__inline">
                  <AppWindow only={i} />
                </div>
              </li>
            ))}
          </ol>

          <div className="hw2__visual">
            <div className="hw2__sticky">
              <AppWindow />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
