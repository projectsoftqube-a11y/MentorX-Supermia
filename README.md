# MentorX - Landing page

Animated marketing site for MentorX, built with **Next.js 15 (App Router)**, **GSAP 3.13** (ScrollTrigger + SplitText via `@gsap/react`) and **Lenis** smooth scrolling. Same brand tokens as the MentorX app (forest, terracotta, cream, sage · Plus Jakarta Sans + Instrument Serif).

## Getting started

Requires Node 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command                           | What it does                                        |
| --------------------------------- | --------------------------------------------------- |
| `npm run dev`                     | Development server                                  |
| `npm run build` / `npm start`     | Production build / serve it                         |
| `npm run typecheck`               | TypeScript, no emit                                 |
| `npm run lint`                    | ESLint (`next/core-web-vitals` + `next/typescript`) |
| `npm run format` / `format:check` | Prettier (config in `.prettierrc.json`)             |
| `npm run check`                   | typecheck + lint + format check                     |

Tip: to build without touching a running dev server, use `NEXT_DIST_DIR=.next-verify npm run build`.

## Structure

```
src/
  app/
    layout.tsx        fonts (next/font), metadata, Lenis CSS
    page.tsx          composes the page
    globals.css       design tokens + all section styles (responsive to 370px)
  components/
    layout/           SmoothScroll (Lenis + GSAP ticker), Nav, Cursor, ScrollProgress, Footer
    sections/         Hero, RolesMarquee, Manifesto, Features, HowItWorks, WhoItsFor,
                      LiveInterview, Numbers, Moments, ResumeReview, Faq, FinalCta
    ui/Img.tsx        next/image wrapper
  data/landing.ts     all copy, lists and image paths (edit text here)
  lib/gsap.ts         plugin setup + helpers (splitReveal, countUp, fillRing, animateWaves, whileVisible)
public/
  brand/              MentorX logos and icons
  img/                Unsplash photography
```

## Sections and motion

| Section            | What moves                                                                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero               | Rotating eyebrow word, masked headline + drawn underline, floating candidate bubbles, cursor spotlight, live call (captions type, score + coach tip) that flattens out of a 3D tilt on scroll |
| Roles marquee      | Infinite rows; speed and direction follow scroll velocity                                                                                                                                     |
| Manifesto          | Words light up with scroll; photo pills pop in; highlight sweeps                                                                                                                              |
| Features           | Pinned horizontal scroll with curtain photo reveals and drifting photos                                                                                                                       |
| How it works       | Progress line draws, steps light up, curtain image reveals                                                                                                                                    |
| Who it's for       | Pinned stacked persona cards                                                                                                                                                                  |
| Live interview     | Pinned "interview stage": voice orb, conversation in four corners, step pills + timer                                                                                                         |
| Numbers            | Bento: skill pentagon draws, difficulty bars rise, resume checks tick, live clock                                                                                                             |
| Moments            | Expanding journey strip that auto-advances (hover to explore)                                                                                                                                 |
| Resume review      | Pinned: a ring glides between issues on a sample resume, fix cards slide in, ATS score climbs                                                                                                 |
| FAQ / CTA / Footer | GSAP accordion, circle-grow reveal with floating photos, wordmark letters rise                                                                                                                |

## Performance notes (60fps)

- Only transforms, opacity and stroke offsets are animated in scroll-driven work; photo reveals use transform "curtains" instead of `clip-path`.
- No animated `filter`, and `backdrop-filter` is limited to the nav.
- Infinite loops (waves, marquee, orb, clock, demo loops) pause while their section is off-screen (`whileVisible`).
- `ScrollTrigger.config({ ignoreMobileResize: true })` avoids re-measuring when mobile address bars show/hide.
- `prefers-reduced-motion` turns off smooth scrolling and decorative motion; all content stays visible.

Photography: [Unsplash](https://unsplash.com).
