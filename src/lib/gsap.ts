'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// Register once, in the browser only (GSAP must never run during SSR)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
  // Mobile browsers resize the viewport as the address bar shows/hides; re-measuring on every one of
  // those causes visible jank mid-scroll, so ignore them (real orientation/size changes still refresh)
  ScrollTrigger.config({ ignoreMobileResize: true })
  gsap.config({ force3D: true })
}

export { gsap, ScrollTrigger, SplitText, useGSAP }

/** True when the visitor asked the OS for less motion */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Masked line-by-line headline reveal used by every section title (`[data-split]`).
 * autoSplit re-splits after fonts load / on resize; returning the tween lets GSAP keep it in sync.
 */
export function splitReveal(el: Element, vars: gsap.TweenVars = {}, trigger?: ScrollTrigger.Vars | false) {
  return SplitText.create(el, {
    type: 'lines,words',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.words, {
        yPercent: 115,
        rotate: 4,
        skewX: -8,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.05,
        ...vars,
        scrollTrigger: trigger === false ? undefined : { trigger: el, start: 'top 85%', ...trigger },
      })
    },
  })
}

/** Animates `.count[data-to]` numbers from 0 */
export function countUp(targets: Element[] | NodeListOf<Element>, vars: gsap.TweenVars = {}) {
  Array.from(targets).forEach((el) => {
    const to = Number((el as HTMLElement).dataset.to || 0)
    const obj = { v: 0 }
    gsap.to(obj, {
      v: to,
      duration: 1.6,
      ease: 'power3.out',
      ...vars,
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v))
      },
    })
  })
}

/** Fills an SVG progress ring (`[data-ring]` with a `.ring__fill` circle, r = 50) */
export function fillRing(ring: Element, vars: gsap.TweenVars = {}) {
  const pct = Number((ring as HTMLElement).dataset.ring || 0)
  const c = 2 * Math.PI * 50
  const fill = ring.querySelector('.ring__fill')
  if (!fill) return
  gsap.fromTo(
    fill,
    { strokeDashoffset: c },
    { strokeDashoffset: c * (1 - pct / 100), duration: 1.8, ease: 'power3.out', ...vars }
  )
}

/**
 * Equalizer-style bars (`.wave i`) bouncing at random heights.
 * Animates scaleY (compositor-only) rather than height, which would trigger layout every frame.
 * Returns the tweens so callers can pause them while off-screen.
 */
export function animateWaves(scope: Element) {
  return Array.from(scope.querySelectorAll('.wave i')).map((bar, i) =>
    gsap.to(bar, {
      scaleY: () => gsap.utils.random(0.25, 1),
      duration: () => gsap.utils.random(0.35, 0.7),
      ease: 'sine.inOut',
      repeat: -1,
      repeatRefresh: true,
      yoyo: true,
      delay: i * 0.05,
    })
  )
}

/** Plays looping animations only while `trigger` is on screen (saves CPU/GPU for the visible section) */
export function whileVisible(trigger: Element, animations: (gsap.core.Animation | undefined)[]) {
  const list = animations.filter(Boolean) as gsap.core.Animation[]
  return ScrollTrigger.create({
    trigger,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => list.forEach((a) => (self.isActive ? a.resume() : a.pause())),
    onRefresh: (self) => list.forEach((a) => (self.isActive ? a.resume() : a.pause())),
  })
}

/** Eyebrow labels: a short line draws in, then the text slides in after it */
export function eyebrowIn(el: Element, trigger: Element | string = el) {
  return gsap.from(el, {
    x: -24,
    autoAlpha: 0,
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: { trigger, start: 'top 85%' },
  })
}
