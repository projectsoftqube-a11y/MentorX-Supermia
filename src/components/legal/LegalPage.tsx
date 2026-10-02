'use client'

import { useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, FileText, Mail, MapPin, ShieldCheck } from 'lucide-react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion } from '@/lib/gsap'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Cursor } from '@/components/layout/Cursor'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { BtnArrow } from '@/components/ui/BtnArrow'
import { LEGAL_CONTACT, PRIVACY, TERMS, type LegalBlock, type LegalDoc } from '@/data/legal'

/** Renders **bold** inside a paragraph */
function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
  )
}

function Block({ block }: { block: LegalBlock }) {
  if ('list' in block)
    return (
      <ul className="lg__list">
        {block.list.map((item) => (
          <li key={item}>{rich(item)}</li>
        ))}
      </ul>
    )
  return <p>{rich(block.p)}</p>
}

const words = (doc: LegalDoc) =>
  [doc.intro, ...doc.summary, ...doc.sections.flatMap((s) => s.blocks.flatMap((b) => ('list' in b ? b.list : [b.p])))]
    .join(' ')
    .split(/\s+/).length

/**
 * Shared layout for the Privacy Policy and Terms & Conditions: hero, a sticky contents list that
 * highlights the section being read, a "short version" card, numbered sections and a contact card.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const root = useRef<HTMLElement>(null)
  const other = doc.slug === PRIVACY.slug ? TERMS : PRIVACY
  const minutes = Math.max(1, Math.round(words(doc) / 220))

  useGSAP(
    () => {
      const el = root.current!
      const links = gsap.utils.toArray<HTMLElement>('.lg__toc a')
      const setActive = (id: string) => links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`))
      gsap.utils.toArray<HTMLElement>('.lg__section').forEach((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(section.id),
        })
      )
      setActive(doc.sections[0].id)

      if (prefersReducedMotion()) return
      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t, {}, false))
      gsap.from(['.lg__crumbs', '.lg__eyebrow', '.lg__intro', '.lg__meta > *'], {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.07,
        ease: 'expo.out',
        delay: 0.15,
      })
      gsap.from(['.lg__summary', '.lg__aside'], { y: 50, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', delay: 0.35 })
      gsap.utils.toArray<HTMLElement>('.lg__section, .lg__contact').forEach((s) =>
        gsap.from(s, { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%' } })
      )
    },
    { scope: root }
  )

  return (
    <SmoothScroll>
      <Cursor />
      <ScrollProgress />
      <Nav base="/" />

      <main id="top" className="lg" ref={root}>
        <header className="lg__hero">
          <div className="container">
            <nav className="lg__crumbs" aria-label="Breadcrumb">
              <Link href="/">
                <ArrowLeft aria-hidden="true" /> Home
              </Link>
              <span aria-hidden="true">/</span>
              <span>{doc.eyebrow}</span>
            </nav>
            <p className="eyebrow eyebrow--muted lg__eyebrow">{doc.eyebrow}</p>
            <h1 className="lg__title" data-split>
              {doc.title} <em>{doc.accent}</em>
            </h1>
            <p className="lg__intro">{doc.intro}</p>
            <ul className="lg__meta">
              <li>
                <CalendarDays aria-hidden="true" /> Last updated {doc.updated}
              </li>
              <li>
                <Clock aria-hidden="true" /> {minutes} min read
              </li>
              <li>
                <Link href={`/${other.slug}`}>
                  <FileText aria-hidden="true" /> Read our {other.title} {other.accent}
                </Link>
              </li>
            </ul>
          </div>
        </header>

        <div className="container lg__body">
          <aside className="lg__aside" aria-label="On this page">
            <p className="lg__asidelabel">On this page</p>
            <ol className="lg__toc">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className="lg__doc">
            <section className="lg__summary" aria-labelledby="lg-summary">
              <p className="lg__summarylabel" id="lg-summary">
                <ShieldCheck aria-hidden="true" /> The short version
              </p>
              <ul>
                {doc.summary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>

            {doc.sections.map((s, i) => (
              <section className="lg__section" id={s.id} key={s.id}>
                <h2>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
                {s.blocks.map((b, k) => (
                  <Block block={b} key={k} />
                ))}
              </section>
            ))}

            <section className="lg__contact">
              <div>
                <h2>Questions about this page?</h2>
                <p>We’re happy to help. Email us and a real person will get back to you.</p>
                <p className="lg__address">
                  <MapPin aria-hidden="true" />
                  {LEGAL_CONTACT.company} · {LEGAL_CONTACT.address}
                </p>
              </div>
              <a href={LEGAL_CONTACT.mailto} className="btn btn--cream btn--lg magnetic" data-cursor="Email">
                <Mail className="lg__mailicon" aria-hidden="true" />
                <span className="btn__label">{LEGAL_CONTACT.email}</span>
                <BtnArrow />
              </a>
            </section>
          </article>
        </div>
      </main>

      <Footer base="/" />
    </SmoothScroll>
  )
}
