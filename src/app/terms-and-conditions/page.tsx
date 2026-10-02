import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'
import { TERMS } from '@/data/legal'

export const metadata: Metadata = {
  title: 'Terms & Conditions - MentorX',
  description: 'The terms for using MentorX, the AI interview coach by SuperMIA.',
}

export default function TermsPage() {
  return <LegalPage doc={TERMS} />
}
