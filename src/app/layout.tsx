import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google'
import 'lenis/dist/lenis.css'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MentorX - Rehearse the interview. Land the role.',
  description:
    'MentorX is your AI career mentor: score your resume against the job, practise out loud with an AI interviewer, and get feedback you can act on.',
  icons: { icon: '/brand/favicon.png', apple: '/brand/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#0B3D2E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${instrument.variable}`}>
      {/* Browser extensions (e.g. ColorZilla) inject attributes on <body> before hydration */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
