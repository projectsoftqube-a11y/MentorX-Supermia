'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

/**
 * Custom cursor (dot + ring that grows with a label over interactive elements) and
 * magnetic pull for every `.magnetic` element. Pointer devices only.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion() || !contextSafe) return

      const el = root.current!
      const dot = el.querySelector('.cursor__dot')!
      const ring = el.querySelector('.cursor__ring')!
      const label = el.querySelector<HTMLElement>('.cursor__label')!
      const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' })
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' })
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })

      // Hidden until the pointer first moves (so it never sits parked in the corner), and while it's outside the window
      const onMove = contextSafe((e: PointerEvent) => {
        el.classList.add('is-ready')
        dotX(e.clientX)
        dotY(e.clientY)
        ringX(e.clientX)
        ringY(e.clientY)
      })
      const onOver = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, summary, [data-cursor]')
        // labelled targets (data-cursor) get the filled disc with text; plain links just a light outlined ring
        const labelled = Boolean(target?.dataset.cursor)
        el.classList.toggle('is-hover', labelled)
        el.classList.toggle('is-link', Boolean(target) && !labelled)
        label.textContent = target?.dataset.cursor ?? ''
      }
      const onLeave = () => el.classList.remove('is-ready')
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerover', onOver)
      document.documentElement.addEventListener('pointerleave', onLeave)

      // Magnetic buttons: pulled toward the pointer, spring back on leave
      const magnets = gsap.utils.toArray<HTMLElement>('.magnetic')
      const cleanups = magnets.map((m) => {
        const mx = gsap.quickTo(m, 'x', { duration: 0.5, ease: 'power3' })
        const my = gsap.quickTo(m, 'y', { duration: 0.5, ease: 'power3' })
        const move = contextSafe((e: PointerEvent) => {
          const r = m.getBoundingClientRect()
          mx((e.clientX - (r.left + r.width / 2)) * 0.3)
          my((e.clientY - (r.top + r.height / 2)) * 0.4)
        })
        const leave = contextSafe(() => {
          gsap.to(m, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
        })
        m.addEventListener('pointermove', move)
        m.addEventListener('pointerleave', leave)
        return () => {
          m.removeEventListener('pointermove', move)
          m.removeEventListener('pointerleave', leave)
        }
      })

      return () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerover', onOver)
        document.documentElement.removeEventListener('pointerleave', onLeave)
        cleanups.forEach((fn) => fn())
      }
    },
    { scope: root }
  )

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="cursor__ring">
        <span className="cursor__label" />
      </div>
      <div className="cursor__dot" />
    </div>
  )
}
