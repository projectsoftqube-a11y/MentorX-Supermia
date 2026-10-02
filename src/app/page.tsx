'use client'

import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Cursor } from '@/components/layout/Cursor'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { Nav } from '@/components/layout/Nav'
import { Hero } from '@/components/sections/Hero'
import { RolesMarquee } from '@/components/sections/RolesMarquee'
import { Manifesto } from '@/components/sections/Manifesto'
import { Features } from '@/components/sections/Features'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { WhoItsFor } from '@/components/sections/WhoItsFor'
import { LiveInterview } from '@/components/sections/LiveInterview'
import { Numbers } from '@/components/sections/Numbers'
import { Moments } from '@/components/sections/Moments'
import { ResumeReview } from '@/components/sections/ResumeReview'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <SmoothScroll>
      <Cursor />
      <ScrollProgress />
      <Nav />

      {/* Sections are listed top to bottom, so their ScrollTriggers are created (and refreshed) in page order */}
      <main id="top">
        <Hero />
        <RolesMarquee />
        <Manifesto />
        <Features />
        <HowItWorks />
        <WhoItsFor />
        <LiveInterview />
        <Numbers />
        <Moments />
        <ResumeReview />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
