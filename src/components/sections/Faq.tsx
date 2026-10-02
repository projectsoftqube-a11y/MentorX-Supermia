'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, splitReveal, prefersReducedMotion, eyebrowIn } from '@/lib/gsap'
import { ArrowRight, ArrowUp, Check, Mail, MessageCircleQuestion } from 'lucide-react'
import { Img } from '@/components/ui/Img'
import { FAQS, SITE } from '@/data/landing'

type Msg = { id: number; from: 'coach' | 'you'; text: string }

const GREETING = 'Hi! I’m your MentorX coach. Tap any question and I’ll answer right away.'
const TYPING_MS = 900

/**
 * FAQ as a conversation with the coach: questions are chips on the left; tapping one sends it to the
 * chat, the coach "types" and answers. The first question asks itself when the chat scrolls into view.
 */
export function Faq() {
  const root = useRef<HTMLElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, from: 'coach', text: GREETING }])
  const [typing, setTyping] = useState(false)
  const [asked, setAsked] = useState<number[]>([])

  const ask = (index: number) => {
    if (typing) return
    const { q, a } = FAQS[index]
    setAsked((list) => (list.includes(index) ? list : [...list, index]))
    setMessages((list) => [...list, { id: nextId.current++, from: 'you', text: q }])
    if (prefersReducedMotion()) {
      setMessages((list) => [...list, { id: nextId.current++, from: 'coach', text: a }])
      return
    }
    setTyping(true)
    timer.current = setTimeout(() => {
      setTyping(false)
      setMessages((list) => [...list, { id: nextId.current++, from: 'coach', text: a }])
    }, TYPING_MS)
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  // Keep the newest message in view (inside the chat only, never the page)
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [messages, typing])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const el = root.current!
      el.querySelectorAll('[data-split]').forEach((t) => splitReveal(t))
      eyebrowIn(el.querySelector('.eyebrow')!)
      gsap.from('.faq .lead', {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.faq__intro', start: 'top 75%' },
      })
      gsap.from('.faq__chip', {
        x: -40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.faq__chips', start: 'top 85%' },
      })
      gsap.from('.chat', {
        y: 90,
        rotate: 2.5,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.chat', start: 'top 85%' },
      })
      // the first question asks itself once the chat is in view
      ScrollTrigger.create({
        trigger: '.chat',
        start: 'top 60%',
        once: true,
        onEnter: () => {
          gsap.delayedCall(0.9, () => ask(0))
        },
      })
    },
    { scope: root }
  )

  return (
    <section className="faq" id="faq" ref={root}>
      <div className="container faq__layout">
        <div className="faq__intro">
          <p className="eyebrow eyebrow--muted">FAQ</p>
          <h2 className="section-title" data-split>
            Questions, <em>answered.</em>
          </h2>
          <p className="lead">Tap a question and your coach answers it - just like the real thing, only faster.</p>

          <div className="faq__chips" role="list">
            {FAQS.map((item, i) => (
              <button
                type="button"
                role="listitem"
                key={item.q}
                className={`faq__chip${asked.includes(i) ? ' is-asked' : ''}`}
                onClick={() => ask(i)}
                disabled={typing}
                data-cursor="Ask"
              >
                <span className="faq__chipmark" aria-hidden="true">
                  {asked.includes(i) ? <Check strokeWidth={3} /> : <MessageCircleQuestion strokeWidth={2.2} />}
                </span>
                <span className="faq__chiptext">{item.q}</span>
                <span className="faq__arrow" aria-hidden="true">
                  <ArrowRight strokeWidth={2.4} />
                </span>
              </button>
            ))}
          </div>

          <a className="faq__support" href={SITE.mailto} data-cursor="Email">
            <span className="faq__supporticon" aria-hidden="true">
              <Mail strokeWidth={2.2} />
            </span>
            <span>
              <b>Still need help? Contact support</b>
              <span className="faq__supportmail">{SITE.email}</span>
            </span>
            <span className="faq__arrow" aria-hidden="true">
              <ArrowRight strokeWidth={2.4} />
            </span>
          </a>
        </div>

        <div className="chat">
          <div className="chat__head">
            <span className="chat__avatar">
              <Img src="/brand/mentorx-icon.png" width={80} height={80} sizes="40px" />
            </span>
            <div>
              <p className="chat__name">MentorX coach</p>
              <p className="chat__status">
                <i /> {typing ? 'Typing…' : 'Online'}
              </p>
            </div>
            <span className="chat__count">
              {asked.length}/{FAQS.length} answered
            </span>
          </div>

          <div className="chat__log" ref={logRef} aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={`msg msg--${m.from}`}>
                {m.from === 'coach' && (
                  <span className="msg__avatar" aria-hidden="true">
                    <Img src="/brand/mentorx-icon.png" width={56} height={56} sizes="28px" />
                  </span>
                )}
                <p className="msg__bubble">{m.text}</p>
              </div>
            ))}
            {typing && (
              <div className="msg msg--coach" aria-label="The coach is typing">
                <span className="msg__avatar" aria-hidden="true">
                  <Img src="/brand/mentorx-icon.png" width={56} height={56} sizes="28px" />
                </span>
                <p className="msg__bubble msg__typing">
                  <i />
                  <i />
                  <i />
                </p>
              </div>
            )}
          </div>

          <div className="chat__input" aria-hidden="true">
            <span>Pick a question to ask…</span>
            <span className="chat__send">
              <ArrowUp strokeWidth={2.6} />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
