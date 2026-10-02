'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap, useGSAP, prefersReducedMotion, whileVisible } from '@/lib/gsap'
import { ArrowUp } from 'lucide-react'
import { Img } from '@/components/ui/Img'
import { HERO_DEMO, SITE } from '@/data/landing'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Resume check' },
      { href: '#live', label: 'Mock interviews' },
      { href: '#features', label: 'Feedback reports' },
      { href: '#how', label: 'How it works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '#who', label: 'Who it’s for' },
      { href: '#faq', label: 'FAQ' },
      { href: SITE.mailto, label: 'Contact us' },
      { href: SITE.mailto, label: 'Get support' },
      { href: SITE.appUrl, label: 'Sign in' },
    ],
  },
]

const WORD = ['M', 'e', 'n', 't', 'o', 'r', 'X']
const RING_C = 2 * Math.PI * 22

/**
 * Footer: rises from underneath the page (parallax), a rotating "next practice question" card,
 * a full-width wordmark whose letters lift toward the cursor, and a back-to-top button whose ring
 * shows how far down the page you are.
 */
export function Footer({ base = '' }: { base?: string }) {
  const root = useRef<HTMLElement>(null)

  // Fit the wordmark exactly to the container width (font metrics differ per screen, so measure them)
  useEffect(() => {
    const word = root.current?.querySelector<HTMLElement>('.ft__word')
    if (!word) return
    const fit = () => {
      const cs = getComputedStyle(word)
      const avail = word.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      if (!avail) return
      word.style.fontSize = '100px'
      const letters = Array.from(word.children) as HTMLElement[]
      const total = letters.reduce((w, l) => w + l.getBoundingClientRect().width, 0)
      let size = Math.floor(100 * (avail / total) * 0.985)
      word.style.fontSize = `${size}px`
      // safety net: never let the last letter spill out
      while (word.scrollWidth > word.clientWidth + 1 && size > 12) {
        size -= 2
        word.style.fontSize = `${size}px`
      }
    }
    fit()
    // re-fit once the web font has swapped in (its letters are wider than the fallback's)
    document.fonts?.ready.then(fit)
    // a font-size change resizes the box, which re-runs fit once more and settles on the same size
    const ro = new ResizeObserver(() => fit())
    ro.observe(word)
    return () => ro.disconnect()
  }, [])

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current!
      if (prefersReducedMotion()) return

      // Content slides up from "under" the page as the footer scrolls in
      gsap.fromTo(
        '.ft__inner',
        { yPercent: -28 },
        { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true } }
      )
      gsap.from('.ft__word span', {
        yPercent: 105,
        duration: 1.3,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ft__word', start: 'top 98%' },
      })
      gsap.from(['.ft__brand > *', '.ft__col', '.ft__q'], {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 75%' },
      })

      // Back-to-top ring follows page progress
      gsap.fromTo(
        '.ft__top .ring__fill',
        { strokeDashoffset: RING_C },
        { strokeDashoffset: 0, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }
      )

      // "Next practice question" rotates while the footer is visible
      const qText = el.querySelector<HTMLElement>('.ft__qtext')!
      const qRole = el.querySelector<HTMLElement>('.ft__qrole')!
      let idx = 0
      const swap = gsap.timeline({ repeat: -1, repeatDelay: 3.2, paused: true })
      swap
        .to([qText, qRole], { yPercent: -40, autoAlpha: 0, duration: 0.4, ease: 'power2.in' })
        .call(() => {
          idx = (idx + 1) % HERO_DEMO.length
          qText.textContent = `“${HERO_DEMO[idx].question}”`
          qRole.textContent = HERO_DEMO[idx].role
        })
        .fromTo([qText, qRole], { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
      whileVisible(el, [swap])

      // Wordmark letters lift toward the pointer
      if (!window.matchMedia('(pointer: fine)').matches || !contextSafe) return
      const word = el.querySelector<HTMLElement>('.ft__word')!
      const letters = gsap.utils.toArray<HTMLElement>('.ft__word span').map((l) => ({
        el: l,
        y: gsap.quickTo(l, 'y', { duration: 0.6, ease: 'power3' }),
      }))
      const onMove = contextSafe((e: PointerEvent) => {
        letters.forEach((l) => {
          const r = l.el.getBoundingClientRect()
          const d = Math.abs(e.clientX - (r.left + r.width / 2)) / r.width
          l.y(-Math.max(0, 1 - d / 2.2) * r.height * 0.14)
        })
      })
      const onLeave = contextSafe(() => letters.forEach((l) => l.y(0)))
      word.addEventListener('pointermove', onMove)
      word.addEventListener('pointerleave', onLeave)
      return () => {
        word.removeEventListener('pointermove', onMove)
        word.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: root }
  )

  return (
    <footer className="ft" ref={root}>
      <div className="ft__inner">
        <div className="container">
          <div className="ft__grid">
            <div className="ft__brand">
              <Img
                src="/brand/mentorx-logo-dark.png"
                alt="MentorX"
                width={949}
                height={240}
                sizes="170px"
                style={{ width: 'auto' }}
              />
              <p className="ft__tag">Walk into your next interview already prepared.</p>
              <p className="ft__status">
                <i /> Practice room open · 24/7
              </p>
            </div>

            {COLUMNS.map((col) => (
              <nav className="ft__col" key={col.title} aria-label={col.title}>
                <h4>{col.title}</h4>
                {col.links.map((l) => (
                  <a key={l.label} href={l.href.startsWith('#') ? base + l.href : l.href}>
                    <span>{l.label}</span>
                  </a>
                ))}
              </nav>
            ))}

            <div className="ft__col ft__office">
              <h4>Office</h4>
              <address>
                {SITE.office.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <a href={SITE.websiteUrl} target="_blank" rel="noopener noreferrer">
                <span>{SITE.website}</span>
              </a>
              <a href={SITE.mailto}>
                <span>{SITE.email}</span>
              </a>
            </div>

            <div className="ft__q">
              <p className="ft__qlabel">
                Your next practice question · <span className="ft__qrole">{HERO_DEMO[0].role}</span>
              </p>
              <p className="ft__qtext">“{HERO_DEMO[0].question}”</p>
            </div>
          </div>

          <p className="ft__word" aria-hidden="true">
            {WORD.map((ch, i) => (
              <span key={i} className={ch === 'X' ? 'x' : undefined}>
                {ch}
              </span>
            ))}
          </p>

          <div className="ft__bottom">
            <p className="ft__copy">© 2026 MentorX. All rights reserved.</p>
            <div className="ft__legal">
              <nav className="ft__policies" aria-label="Legal">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
              </nav>
              <span className="ft__divider" aria-hidden="true" />
              <p className="ft__by">
                by{' '}
                <a href={SITE.websiteUrl} target="_blank" rel="noopener noreferrer">
                  SuperMIA
                </a>{' '}
                · Botfinity Inc.
              </p>
            </div>
            <a href="#top" className="ft__top" aria-label="Back to top" data-cursor="Top">
              <svg className="ft__ring" viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="22" className="ring__track" />
                <circle
                  cx="26"
                  cy="26"
                  r="22"
                  className="ring__fill"
                  style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C }}
                />
              </svg>
              <ArrowUp className="ft__arrow" strokeWidth={2.5} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
