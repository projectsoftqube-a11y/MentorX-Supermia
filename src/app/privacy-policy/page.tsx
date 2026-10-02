import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'
import { PRIVACY } from '@/data/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy - MentorX',
  description: 'How MentorX collects, uses and protects your information.',
}

export default function PrivacyPolicyPage() {
  return <LegalPage doc={PRIVACY} />
}
