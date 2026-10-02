/**
 * All landing-page copy, lists and image paths in one place, so text can be edited without touching components.
 * Tone: warm, plain English, second person. Product facts only: no invented user numbers, testimonials or reviews.
 */

/** Company details and the links every sign-in / get-started / contact button points to */
export const SITE = {
  appUrl: 'https://app.mentorx.supermia.ai/',
  email: 'hello@supermia.ai',
  mailto: 'mailto:hello@supermia.ai',
  website: 'supermia.ai',
  websiteUrl: 'https://supermia.ai',
  office: ['2451 W Grapevine Mills Cir #547', 'Grapevine, TX 76051'],
}

export const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#who', label: "Who it's for" },
  { href: '#faq', label: 'FAQ' },
]

/* ---------------------------------- Hero ---------------------------------- */

export const HERO = {
  titleLead: 'Walk into your next interview',
  titleAccent: 'already prepared.',
  sub: 'Practise real interview questions out loud, make sure your resume gets past the filters, and find out exactly what to improve - whenever you have twenty minutes.',
  primaryCta: 'Start practising',
  secondaryCta: 'See how it works',
  perks: ['No scheduling, no mock partners', 'Voice-first, camera optional', 'Clear feedback in minutes'],
}

/** The hero's live call cycles through these: role + question + spoken answer + feedback */
export const HERO_DEMO = [
  {
    role: 'Product Designer',
    question: 'Tell me about a design decision you had to defend.',
    answer: 'We cut a feature users loved, so I showed the drop-off data and tested a simpler flow…',
    score: 86,
    tip: 'Lead with the result, then explain how you got there.',
  },
  {
    role: 'Data Analyst',
    question: 'How would you explain a messy dataset to a non-technical manager?',
    answer: 'I would start with the one number that matters, then show where the gaps come from…',
    score: 79,
    tip: 'Use one concrete example instead of three general ones.',
  },
  {
    role: 'Frontend Engineer',
    question: 'Walk me through how you would speed up a slow page.',
    answer: 'First I measure: Lighthouse and real-user data. Then I fix the biggest blocker first…',
    score: 91,
    tip: 'Great structure. Mention how you measured the impact.',
  },
]

/* --------------------------------- Marquee --------------------------------- */

export const ROLES_ROW_A = [
  'Product Designer',
  'Frontend Engineer',
  'Data Analyst',
  'Product Manager',
  'Marketing Manager',
  'UX Researcher',
]
export const ROLES_ROW_B = [
  'Business Analyst',
  'Backend Developer',
  'Customer Success',
  'DevOps Engineer',
  'Sales Executive',
  'HR Generalist',
]

/* -------------------------------- Manifesto -------------------------------- */

/** Rendered with three small inline photos between the sentences */
export const MANIFESTO = {
  eyebrow: 'The problem',
  parts: [
    'Interviews are hard to practise for.',
    'Friends are busy, question lists don’t talk back, and you rarely hear why you didn’t get the call.',
    'MentorX gives you a patient interviewer, honest feedback',
    'and a clear next step - every single time.',
  ],
}

/* -------------------------------- Features -------------------------------- */

export const FEATURES_TITLE = { eyebrow: 'What you get', lead: 'Everything you need,', accent: 'in one place.' }

export const FEATURES = [
  {
    tone: 'amber',
    num: '01',
    title: 'See your resume the way hiring software does.',
    text: 'Upload your resume and the job you want. In about a minute you get a match score, the keywords you’re missing, and simple fixes for wording and format.',
    ticks: ['A match score for that exact job', 'Missing keywords, listed clearly', 'Wording, typo and format fixes'],
    img: '/img/resume-review.jpg',
    imgAlt: 'Someone reading through a printed resume',
  },
  {
    tone: 'terra',
    num: '02',
    title: 'Practise out loud with an interviewer who never gets tired.',
    text: 'Choose your role and level, then just talk. The AI interviewer asks follow-up questions like a real panel would and keeps a transcript you can look back on.',
    ticks: ['Beginner, intermediate or advanced', 'Voice-first - your camera is optional', 'A live transcript of every answer'],
    img: '/img/practice-headphones.jpg',
    imgAlt: 'A man with headphones practising at his laptop',
  },
  {
    tone: 'green',
    num: '03',
    title: 'Know exactly what to work on next.',
    text: 'Every session ends with a clear report: your overall score, how you did across five skills, what went well, and the one or two things to fix first.',
    ticks: ['Scores for relevance, communication and more', 'What went well, in plain words', 'Specific things to improve'],
    img: '/img/smiling-laptop.jpg',
    imgAlt: 'A man smiling while reading feedback on his laptop',
  },
  {
    tone: 'blue',
    num: '04',
    title: 'Practice that fits where you’re heading.',
    text: 'Tell MentorX your target role, industry, experience and skills once. Every resume check and interview is shaped around it.',
    ticks: ['Your target role and industry', 'The skills you want to be tested on', 'A profile checklist so nothing is missed'],
    img: '/img/profile-office.jpg',
    imgAlt: 'A woman smiling at her computer in a bright office',
  },
]

/* ------------------------------- How it works ------------------------------- */

export const HOW = {
  eyebrow: 'How it works',
  lead: 'Ready in',
  accent: 'three simple steps.',
  sub: 'No calendars, no awkward favours. Open MentorX whenever you have a spare twenty minutes.',
}

export const STEPS = [
  {
    title: 'Add your resume and the job',
    text: 'Upload a PDF, Word or text file and paste the job description. You’ll see your match score right away.',
    img: '/img/study-flatlay.jpg',
  },
  {
    title: 'Practise a mock interview',
    text: 'Pick a level and answer out loud. The interviewer asks follow-ups, just like the real thing.',
    img: '/img/mic-practice.jpg',
  },
  {
    title: 'Review, improve, repeat',
    text: 'Read your report, fix one thing, and run it again. Watching your score climb is the best confidence boost.',
    img: '/img/smiling-laptop.jpg',
  },
]

/* ------------------------------- Who it's for ------------------------------- */

export const AUDIENCE = {
  eyebrow: 'Who it’s for',
  lead: 'Made for every',
  accent: 'stage of your career.',
}

export const PERSONAS = [
  {
    tag: 'Students & new graduates',
    title: 'Turn projects into confident answers.',
    text: 'Practise talking about coursework, internships and side projects so your first big interview feels familiar, not frightening.',
    points: ['Beginner-level questions to start', 'Help explaining projects clearly', 'A resume that matches entry-level roles'],
    img: '/img/student-cowork.jpg',
    imgAlt: 'A smiling student working on his laptop in a busy co-working space',
  },
  {
    tag: 'Career switchers',
    title: 'Show how your experience transfers.',
    text: 'Learn the language of a new field, spot the keywords recruiters look for, and practise telling your story with confidence.',
    points: ['Keyword gaps for the new field', 'Practice explaining your “why”', 'Feedback on how you connect the dots'],
    img: '/img/career-switch.jpg',
    imgAlt: 'A woman focused on her laptop by a bright window',
  },
  {
    tag: 'Experienced professionals',
    title: 'Sharpen the stories that win senior roles.',
    text: 'Rehearse leadership, decision-making and big-picture questions at an advanced level, and polish your resume for the next step up.',
    points: ['Advanced-level follow-up questions', 'Leadership and behavioural practice', 'A resume tuned to senior roles'],
    img: '/img/experienced-pro.jpg',
    imgAlt: 'A smiling professional in a suit working on his laptop in a bright office',
  },
]

/* ------------------------------ Live interview ------------------------------ */

/** The live-interview section: steps, call captions and the feedback card */
export const LIVE = {
  eyebrow: 'A real-feeling interview',
  title: { lead: 'Practice that feels like', accent: 'the real room.' },
  steps: [
    { title: 'It asks', text: 'A calm AI voice asks real questions for your role and level.' },
    { title: 'You answer', text: 'Speak naturally - your words appear as a live transcript.' },
    { title: 'It follows up', text: 'Like a real panel, it digs into what you just said.' },
    { title: 'You get better', text: 'Every answer is scored, with one clear thing to improve.' },
  ],
  meta: 'Marketing Manager · Intermediate',
  question: 'Tell me about a time you had to meet a really tight deadline.',
  answer:
    'Our launch moved up two weeks, so I split the work into **must-haves** and **nice-to-haves**, and we **shipped the core on time**.',
  followUp: 'Good. What would you do differently next time?',
  feedback: {
    title: 'Answer feedback',
    headline: 'Communication +14%',
    note: 'Clear structure and a concrete result. Next time, add one number.',
    bars: [
      { label: 'Relevance', value: 88 },
      { label: 'Communication', value: 82 },
      { label: 'Structure', value: 90 },
    ],
  },
}

/* --------------------------------- Numbers --------------------------------- */

export const NUMBERS = {
  eyebrow: 'Why it works',
  lead: 'Built around how interviews',
  accent: 'really work.',
  skills: {
    value: 5,
    label: 'skills scored in every report',
    items: ['Relevance', 'Communication', 'Problem solving', 'Technical depth', 'Behaviour'],
  },
  levels: { value: 3, label: 'difficulty levels, from first job to senior', items: ['Beginner', 'Intermediate', 'Advanced'] },
  checks: { value: 4, label: 'resume checks against the job you want', items: ['Keywords', 'Content', 'Format', 'Readiness'] },
  always: { label: 'practice whenever it suits you', note: 'It’s 2 AM and you can’t sleep? Run one more round.' },
}

/* --------------------------------- Moments --------------------------------- */

export const MOMENTS_COPY = {
  lead: 'With you for',
  accent: 'every step.',
  sub: 'The night before. The waiting room. The handshake. Walk in knowing you’ve already said it out loud.',
}

export const MOMENTS = [
  {
    src: '/img/study-flatlay.jpg',
    alt: 'Notes, a laptop and books spread out for study',
    caption: 'The night before',
    time: 'Sun · 9:40 PM',
    text: 'One last practice round, then sleep. Your coach tips are saved for the morning.',
  },
  {
    src: '/img/waiting-room.jpg',
    alt: 'A candidate waiting with her papers before an interview',
    caption: 'The waiting room',
    time: 'Mon · 9:52 AM',
    text: 'Skim the three answers you practised most. You’ve already said them out loud.',
  },
  {
    src: '/img/interview-room.jpg',
    alt: 'An interviewer talking with a candidate across a desk',
    caption: 'In the room',
    time: 'Mon · 10:00 AM',
    text: 'Follow-up questions don’t throw you. You’ve heard ones just like them before.',
  },
  {
    src: '/img/handshake-smile.jpg',
    alt: 'Two women smiling and shaking hands across a table',
    caption: 'The handshake',
    time: 'Mon · 10:45 AM',
    text: 'You leave knowing you showed your best - not your nerves.',
  },
  {
    src: '/img/confident-man.jpg',
    alt: 'A confident man smiling with his arms crossed',
    caption: 'Your first day',
    time: 'Two weeks later',
    text: 'The practice paid off. Now go and meet the team.',
  },
]

/* ------------------------------- Resume review ------------------------------- */

export const REVIEW = {
  eyebrow: 'The little things',
  lead: 'Small details,',
  accent: 'big difference.',
  sub: 'Watch MentorX review a resume the way a sharp recruiter would - and fix what they’d notice first.',
  scoreFrom: 64,
  scoreTo: 86,
  /** Each fix points at the `data-hit` index of a phrase in the sample resume */
  fixes: [
    { tag: 'Weak verb', before: 'helped', after: 'led', why: 'Strong verbs show ownership.' },
    {
      tag: 'Add a number',
      before: 'improving activation',
      after: 'lifting activation by 18%',
      why: 'Numbers make results believable.',
    },
    { tag: 'Typo', before: 'recieve', after: 'receive', why: 'Small slips cost a recruiter’s attention.' },
    { tag: 'Format', before: 'Jan 2019 – 2021', after: 'Jan 2019 – Mar 2021', why: 'Keep every date in the same style.' },
    {
      tag: 'Missing keyword',
      before: 'not listed',
      after: 'A/B testing',
      why: 'The job asks for it; your resume doesn’t say it yet.',
    },
  ],
}

/* ----------------------------------- FAQ ----------------------------------- */

export const FAQS = [
  {
    q: 'What exactly is MentorX?',
    a: 'MentorX is an AI interview coach. It checks your resume against the job you want, runs spoken mock interviews with an AI interviewer, and gives you a clear report after every session so you know what to improve.',
  },
  {
    q: 'Can I practise for any job?',
    a: 'Yes. Add the job title and paste the job description, and MentorX shapes both the resume check and the interview questions around it.',
  },
  {
    q: 'Do I need a camera?',
    a: 'No. Interviews are voice-first. You can switch your camera on to see yourself, but you can practise with audio only.',
  },
  {
    q: 'Which resume files can I upload?',
    a: 'PDF, Word (DOCX) and plain text files up to 10 MB. You can also reuse a resume you’ve already checked.',
  },
  {
    q: 'How long until my report is ready?',
    a: 'Usually a minute or two after you finish. The report updates on its own as soon as it’s ready, so you don’t need to refresh.',
  },
]

/* ----------------------------------- CTA ----------------------------------- */

export const CTA = {
  eyebrow: 'Ready when you are',
  lead: 'Your next interview could be',
  accent: 'your best one.',
  sub: 'Add your resume, pick a role and start your first practice interview in minutes.',
  button: 'Start practising',
}
