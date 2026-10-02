'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { BtnArrow } from '@/components/ui/BtnArrow'
import { NAV_LINKS as LINKS, SITE } from '@/data/landing'

/** Glass pill nav: drops in on load, hides on scroll down, returns on scroll up */
export function Nav() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      const reduce = prefersReducedMotion()
      if (!reduce) gsap.from('.nav__inner', { yPercent: -160, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: 0.5 })

      const hide = gsap.to(root.current, { yPercent: -150, duration: 0.45, ease: 'power3.inOut', paused: true })
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (reduce) return
          if (self.direction === 1 && self.scroll() > 240) hide.play()
          else hide.reverse()
        },
      })
    },
    { scope: root }
  )

  return (
    <header className="nav" ref={root}>
      <div className="nav__inner">
        <a href="#top" className="nav__logo" aria-label="MentorX home">
          <Image src="/brand/mentorx-logo.png" alt="MentorX" width={949} height={240} priority style={{ width: 'auto' }} />
        </a>
        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <a href={SITE.appUrl} className="link-quiet">
            Sign in
          </a>
          <a href={SITE.appUrl} className="btn btn--primary btn--sm magnetic" data-cursor="Go">
            <span className="btn__label">Get started</span>
            <BtnArrow />
          </a>
          <button
            className="nav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className="mobile-menu" id="mobileMenu" hidden={!open} onClick={() => setOpen(false)}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a href={SITE.appUrl}>Sign in</a>
        <a href={SITE.appUrl} className="btn btn--primary">
          Get started
        </a>
      </div>
    </header>
  )
}
