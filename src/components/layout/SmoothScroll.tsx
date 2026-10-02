'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const instance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      // scrollable boxes (e.g. the FAQ chat) scroll first; once they can't, the page scrolls
      allowNestedScroll: true,
    })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  // Layout settles after fonts and images load: re-measure every trigger once more
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  // Arriving from another page with a hash (e.g. /#faq): pinned sections move things around while the
  // page sets up, so jump to the section once layout has settled (once per visit)
  const arrived = useRef(false)
  useEffect(() => {
    const id = window.location.hash
    if (arrived.current || !id || id === '#') return
    if (!prefersReducedMotion() && !lenis) return // wait for Lenis so it doesn't snap back
    arrived.current = true
    const go = () => {
      ScrollTrigger.refresh()
      const target = document.querySelector<HTMLElement>(id)
      if (!target) return
      if (lenis) lenis.scrollTo(target, { offset: -20, immediate: true })
      else target.scrollIntoView()
    }
    const timer = window.setTimeout(() => {
      if (document.readyState === 'complete') go()
      else window.addEventListener('load', go, { once: true })
    }, 300)
    return () => window.clearTimeout(timer)
  }, [lenis])

  // In-page anchors glide with Lenis (and still work without it)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')!
      // Bare "#" placeholder links aren't a valid selector: just stay put
      if (id === '#') {
        e.preventDefault()
        return
      }
      const target = id === '#top' ? 0 : document.querySelector<HTMLElement>(id)
      if (target === null) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.4 })
      else if (typeof target === 'number') window.scrollTo({ top: 0, behavior: 'smooth' })
      else target.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
