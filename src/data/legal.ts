/**
 * Privacy Policy and Terms & Conditions copy.
 * Draft wording based on how MentorX works today; have it reviewed by a lawyer before launch.
 * Paragraph strings support **bold**; `list` renders as bullet points.
 */

export type LegalBlock = { p: string } | { list: string[] }
export type LegalSection = { id: string; title: string; blocks: LegalBlock[] }
export type LegalDoc = {
  slug: string
  eyebrow: string
  title: string
  accent: string
  intro: string
  updated: string
  /** "The short version" card at the top */
  summary: string[]
  sections: LegalSection[]
}

const COMPANY = 'Botfinity Inc.'
const CONTACT = 'hello@supermia.ai'
const ADDRESS = '2451 W Grapevine Mills Cir #547, Grapevine, TX 76051, USA'

export const PRIVACY: LegalDoc = {
  slug: 'privacy-policy',
  eyebrow: 'Legal',
  title: 'Privacy',
  accent: 'Policy',
  intro: `How MentorX collects, uses and protects your information when you check your resume and practise interviews with us.`,
  updated: 'October 2, 2026',
  summary: [
    'We use your resume, job descriptions and interview answers only to give you scores and feedback.',
    'Your camera is optional. Voice answers are turned into a transcript for your report.',
    'We never sell your personal information.',
    'You can delete your interviews and resume analyses in the app at any time.',
  ],
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      blocks: [
        {
          p: `MentorX is an AI interview coach built by SuperMIA, a product of **${COMPANY}** ("we", "us", "our"), located at ${ADDRESS}. This policy explains how we handle personal information on this website and in the MentorX app.`,
        },
      ],
    },
    {
      id: 'information-we-collect',
      title: 'Information we collect',
      blocks: [
        { p: 'We collect information you give us and information created while you use MentorX:' },
        {
          list: [
            '**Account details:** your name, email address, phone number and password when you register through SuperMIA.',
            '**Career profile:** your target role, industry, years of experience and skills.',
            '**Resumes and job descriptions:** the files you upload (PDF, Word or text) and the job descriptions you paste.',
            '**Interview sessions:** your spoken answers, the transcript created from them, and, only if you turn it on, your camera feed during the session.',
            '**Results:** ATS scores, interview scores, feedback reports and your progress over time.',
            '**Technical data:** device and browser type, IP address and basic usage logs that keep the service secure and working.',
          ],
        },
      ],
    },
    {
      id: 'how-we-use',
      title: 'How we use your information',
      blocks: [
        {
          list: [
            'To score your resume against a job and show matched and missing keywords.',
            'To run mock interviews, create transcripts and generate your feedback reports.',
            'To track your readiness and practice progress on your dashboard.',
            'To run your account, including sign-in, security and support.',
            'To fix problems and improve how accurate and useful MentorX feedback is.',
            'To send you service messages about your account. Marketing emails are only sent if you agree, and you can unsubscribe at any time.',
          ],
        },
      ],
    },
    {
      id: 'ai-processing',
      title: 'AI processing',
      blocks: [
        {
          p: 'MentorX uses AI models to read your resume, ask interview questions and evaluate your answers. Your content is processed to produce your own results. Scores and feedback are generated automatically and are meant as practice guidance, not as a hiring decision about you.',
        },
      ],
    },
    {
      id: 'sharing',
      title: 'How we share information',
      blocks: [
        { p: '**We do not sell your personal information.** We share it only when needed to run MentorX:' },
        {
          list: [
            '**Service providers** who host our systems, process AI requests and power real-time voice and video sessions. They may use your data only to provide their service to us.',
            '**SuperMIA**, the platform your MentorX account is registered through.',
            '**Legal reasons**, if the law requires it or to protect the rights and safety of our users and the public.',
            '**Business changes**, if MentorX is part of a merger or acquisition. This policy will still apply to your information.',
          ],
        },
      ],
    },
    {
      id: 'retention',
      title: 'How long we keep it',
      blocks: [
        {
          p: 'We keep your information while your account is active so your history and progress stay available. You can delete individual interviews and resume analyses in the app at any time. If you close your account, we delete or anonymise your personal information unless we need to keep some of it to meet legal obligations.',
        },
      ],
    },
    {
      id: 'security',
      title: 'Security',
      blocks: [
        {
          p: 'We use encryption in transit, access controls and other safeguards to protect your information. No online service can be completely secure, so please use a strong password and keep your login details private.',
        },
      ],
    },
    {
      id: 'your-rights',
      title: 'Your choices and rights',
      blocks: [
        { p: 'Depending on where you live, you may have the right to:' },
        {
          list: [
            'Access the personal information we hold about you.',
            'Correct information that is wrong or incomplete.',
            'Delete your information or close your account.',
            'Download a copy of your information.',
            'Object to or limit some kinds of processing, and withdraw consent you have given.',
          ],
        },
        { p: `To make a request, email **${CONTACT}**. We will reply within 30 days.` },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and local storage',
      blocks: [
        {
          p: 'We use essential cookies and your browser’s local storage to keep you signed in and remember your settings. If we use analytics to understand how the website is used, you can block those cookies in your browser settings without affecting the core service.',
        },
      ],
    },
    {
      id: 'children',
      title: 'Children',
      blocks: [
        {
          p: 'MentorX is not intended for children under 16, and we do not knowingly collect their information. If you believe a child has given us personal information, contact us and we will delete it.',
        },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      blocks: [
        {
          p: 'We may update this policy as MentorX changes. When we do, we will update the date at the top of this page, and we will tell you in the app or by email if the changes are significant.',
        },
      ],
    },
  ],
}

export const TERMS: LegalDoc = {
  slug: 'terms-and-conditions',
  eyebrow: 'Legal',
  title: 'Terms &',
  accent: 'Conditions',
  intro: 'The rules for using MentorX. Please read them before you create an account or start practising.',
  updated: 'October 2, 2026',
  summary: [
    'MentorX is a practice tool. It helps you prepare, but it cannot guarantee a job offer.',
    'You own your resume and answers. You let us use them only to run the service for you.',
    'Use MentorX honestly and keep your account secure.',
    'These terms are governed by the laws of Texas, USA.',
  ],
  sections: [
    {
      id: 'agreement',
      title: 'Agreement to these terms',
      blocks: [
        {
          p: `These Terms & Conditions are an agreement between you and **${COMPANY}** ("we", "us", "our"), which provides MentorX through SuperMIA. By creating an account or using MentorX, you agree to these terms and to our Privacy Policy. If you do not agree, please do not use MentorX.`,
        },
      ],
    },
    {
      id: 'the-service',
      title: 'The service',
      blocks: [
        {
          p: 'MentorX helps you prepare for job interviews. You can check your resume against a job description, practise mock interviews with an AI interviewer, and get scores and feedback reports. We may add, change or remove features as the product develops.',
        },
      ],
    },
    {
      id: 'eligibility',
      title: 'Eligibility and your account',
      blocks: [
        {
          list: [
            'You must be at least 16 years old to use MentorX.',
            'Give accurate information when you register and keep it up to date.',
            'Keep your password safe. You are responsible for activity on your account.',
            'Tell us straight away if you think someone else has used your account.',
          ],
        },
      ],
    },
    {
      id: 'credits',
      title: 'Credits and payments',
      blocks: [
        {
          p: 'Some MentorX features use credits from your SuperMIA account. Any free credits, paid plans and prices are shown before you use or buy them. Unless the law requires otherwise or we say so at the time of purchase, payments are non-refundable.',
        },
      ],
    },
    {
      id: 'your-content',
      title: 'Your content',
      blocks: [
        {
          p: 'You keep ownership of everything you upload or say in MentorX, including resumes, job descriptions and interview answers ("your content"). You give us permission to store and process your content only to provide, secure and improve the service for you.',
        },
        {
          p: 'Only upload content you have the right to use, and avoid including sensitive personal information about other people.',
        },
      ],
    },
    {
      id: 'ai-feedback',
      title: 'AI feedback is guidance',
      blocks: [
        {
          p: 'Scores, ATS results and feedback are produced automatically by AI. They can be incomplete or wrong, and real employers and hiring systems may assess you differently. **MentorX does not guarantee interviews, job offers or any hiring outcome.** Use your own judgement before relying on any feedback.',
        },
      ],
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      blocks: [
        { p: 'When using MentorX, you agree not to:' },
        {
          list: [
            'Break any law or anyone else’s rights.',
            'Upload harmful, offensive or misleading content, or content you have no right to share.',
            'Try to access other users’ accounts or data.',
            'Reverse engineer, scrape, overload or disrupt the service.',
            'Use MentorX to build a competing product, or resell access without our permission.',
          ],
        },
      ],
    },
    {
      id: 'our-ip',
      title: 'Our intellectual property',
      blocks: [
        {
          p: 'MentorX, SuperMIA, their logos, software, design and content (other than your content) belong to us or our licensors. These terms give you a personal, non-transferable right to use MentorX. They do not transfer any ownership to you.',
        },
      ],
    },
    {
      id: 'termination',
      title: 'Suspension and closing your account',
      blocks: [
        {
          p: 'You can stop using MentorX and close your account at any time. We may suspend or close an account that breaks these terms or puts the service or other users at risk. Where reasonable, we will tell you first.',
        },
      ],
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and liability',
      blocks: [
        {
          p: 'MentorX is provided "as is" and "as available". To the fullest extent the law allows, we do not promise that it will always be available, error-free or suited to a particular purpose.',
        },
        {
          p: 'To the fullest extent the law allows, we are not liable for indirect, incidental or consequential losses, including lost job opportunities or income. Our total liability for any claim is limited to the amount you paid us for MentorX in the 12 months before the claim.',
        },
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing law',
      blocks: [
        {
          p: 'These terms are governed by the laws of the State of Texas, USA, without regard to its conflict-of-law rules. Any dispute will be handled by the courts located in Tarrant County, Texas, unless the law where you live gives you a different right.',
        },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to these terms',
      blocks: [
        {
          p: 'We may update these terms from time to time. We will update the date at the top of this page, and if a change is significant we will tell you in the app or by email. Continuing to use MentorX after a change means you accept the updated terms.',
        },
      ],
    },
  ],
}

export const LEGAL_CONTACT = { email: CONTACT, mailto: `mailto:${CONTACT}`, address: ADDRESS, company: COMPANY }
