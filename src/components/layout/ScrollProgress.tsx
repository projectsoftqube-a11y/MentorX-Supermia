'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/** Thin gradient bar at the top that tracks page progress */
export function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
  })

  return (
    <div className="progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  )
}
