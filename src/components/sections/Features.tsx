'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, fillRing, animateWaves, whileVisible } from '@/lib/gsap'
import { Img } from '@/components/ui/Img'
import { FEATURES, FEATURES_TITLE } from '@/data/landing'

const css = (vars: Record<string, string>) => vars as React.CSSProperties

/** The small product UI floating over each panel's photo */
function PanelUi({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="ui-card ui-card--float">
        <div className="ui-row">
          <div className="ring ring--sm" data-ring="84">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" className="ring__track" />
              <circle cx="60" cy="60" r="50" className="ring__fill" />
            </svg>
            <b>84</b>
          </div>
          <div>
            <p className="ui-strong">Strong match</p>
            <p className="ui-muted">Product Designer · Fintech</p>
          </div>
        </div>
        <div className="tags">
          <span className="tag tag--ok">Figma</span>
          <span className="tag tag--ok">User research</span>
          <span className="tag tag--ok">Prototyping</span>
          <span className="tag tag--miss">A/B testing</span>
          <span className="tag tag--miss">Design systems</span>
        </div>
      </div>
    )
  if (index === 1)
    return (
      <div className="ui-card ui-card--float ui-card--dark">
        <div className="orb">
          <Img src="/brand/mentorx-icon.png" width={80} height={80} sizes="40px" />
        </div>
        <div className="wave">
          {Array.from({ length: 11 }).map((_, i) => (
            <i key={i} />
          ))}
        </div>
        <p className="ui-muted ui-muted--light">“What would you do differently next time?”</p>
      </div>
    )
  if (index === 2)
    return (
      <div className="ui-card ui-card--float">
        <p className="ui-strong">Your report · 82/100</p>
        <div className="bars">
          {[
            ['Relevance', '86%', '#E2724A'],
            ['Communication', '78%', '#F59E0B'],
            ['Problem solving', '72%', '#168A63'],
            ['Technical depth', '84%', '#527A9E'],
          ].map(([label, w, c]) => (
            <div className="bar" key={label}>
              <span>{label}</span>
              <b style={css({ '--w': w, '--c': c })} />
            </div>
          ))}
        </div>
      </div>
    )
  return (
    <div className="ui-card ui-card--float">
      <div className="ui-row">
        <Img className="ui-avatar" src="/img/professional-blazer.jpg" width={104} height={104} sizes="52px" />
        <div>
          <p className="ui-strong">Your profile</p>
          <p className="ui-muted">Target: UX Researcher</p>
        </div>
      </div>
      <div className="checks">
        <span className="check is-on">Target role</span>
        <span className="check is-on">Skills</span>
        <span className="check is-on">Experience</span>
        <span className="check">Industry</span>
      </div>
    </div>
  )
}

/**
 * "Everything you need, in one place." On desktop the section pins and the four panels slide
 * horizontally; each panel's photo drifts inside its frame and its details pop in as it arrives.
 * Below 900px the panels stack and reveal one by one.
 */
export function Features() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>('.panel')
      if (prefersReducedMotion()) {
        panels.forEach((p) => p.querySelectorAll('[data-ring]').forEach((r) => fillRing(r, { duration: 0 })))
        return
      }

      root.current!.querySelectorAll('[data-split]').forEach((el) => splitReveal(el))
      panels.forEach((p) => p.classList.add('is-armed'))
      whileVisible(root.current!, animateWaves(root.current!))

      const reveal = (panel: HTMLElement) => {
        panel.classList.add('is-in')
        panel.querySelectorAll('[data-ring]').forEach((r) => fillRing(r))
      }

      const mm = gsap.matchMedia()

      mm.add('(min-width: 901px)', () => {
        const track = root.current!.querySelector<HTMLElement>('.features__track')!
        const distance = () => track.scrollWidth - window.innerWidth

        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none', // required for containerAnimation
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('.features__progress span', { scaleX: self.progress }),
          },
        })

        panels.forEach((panel, i) => {
          // The first panel is on screen before pinning starts, so it reveals on vertical scroll
          const st =
            i === 0
              ? { trigger: root.current, start: 'top 55%' }
              : { containerAnimation: scrollTween, trigger: panel, start: 'left 78%' }
          // wipe = a solid curtain shrinking away (transform only, no clip-path repaint)
          gsap.fromTo(
            panel.querySelector('.curtain'),
            { scaleX: 1, autoAlpha: 1 },
            { scaleX: 0, transformOrigin: '100% 50%', duration: 1.3, ease: 'expo.inOut', scrollTrigger: st }
          )
          gsap.from(panel.querySelector('.ui-card'), {
            y: 90,
            rotate: -8,
            autoAlpha: 0,
            duration: 1.2,
            ease: 'back.out(1.4)',
            delay: 0.2,
            scrollTrigger: st,
          })
          gsap.from(panel.querySelectorAll('.panel__copy > *'), {
            x: 70,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: st,
          })
          ScrollTrigger.create({ ...st, onEnter: () => reveal(panel) })

          // Photo drifts inside its frame as the panel travels across the screen
          if (i > 0) {
            gsap.fromTo(
              panel.querySelector('.panel__photo'),
              { xPercent: -8 },
              {
                xPercent: 6,
                ease: 'none',
                scrollTrigger: {
                  containerAnimation: scrollTween,
                  trigger: panel,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              }
            )
          }
        })
      })

      mm.add('(max-width: 900px)', () => {
        panels.forEach((panel) => {
          const st = { trigger: panel, start: 'top 80%' }
          gsap.from(panel, { y: 80, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: st })
          gsap.from(panel.querySelector('.ui-card'), {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            delay: 0.3,
            ease: 'expo.out',
            scrollTrigger: st,
          })
          ScrollTrigger.create({ ...st, onEnter: () => reveal(panel) })
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section className="features" id="features" ref={root}>
      <div className="features__pin">
        <div className="features__head container">
          <p className="eyebrow eyebrow--muted">{FEATURES_TITLE.eyebrow}</p>
          <h2 className="section-title" data-split>
            {FEATURES_TITLE.lead} <em>{FEATURES_TITLE.accent}</em>
          </h2>
        </div>

        <div className="features__track">
          {FEATURES.map((f, i) => (
            <article className={`panel panel--${f.tone}`} key={f.num}>
              <div className="panel__copy">
                <span className="panel__num">{f.num}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <ul className="ticks">
                  {f.ticks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="panel__visual">
                <div className="panel__photo-wrap">
                  <span className="curtain" aria-hidden="true" />
                  <Img className="panel__photo" src={f.img} alt={f.imgAlt} sizes="(max-width: 900px) 100vw, 40vw" />
                </div>
                <PanelUi index={i} />
              </div>
            </article>
          ))}
        </div>

        <div className="features__progress container" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
