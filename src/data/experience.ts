import type { ExperienceItem } from '@/types'

export const experience: ExperienceItem[] = [
  {
    company: 'Nebula Labs',
    role: 'Senior Creative Developer',
    start: '2023',
    end: 'Present',
    current: true,
    description:
      'Lead frontend engineer on a 3D-first product configurator and design-system team serving a global furniture brand.',
    achievements: [
      'Architected a WebGL product configurator using react-three-fiber that raised engagement by 34%',
      'Built a 40-component tokenized design system adopted by 6 product teams',
      'Cut page-load time by 58% through route splitting and image optimization',
      'Mentored four engineers and introduced a weekly frontend guild',
    ],
    technologies: ['React 19', 'Three.js', 'Tailwind CSS', 'TanStack Router', 'TypeScript'],
  },
  {
    company: 'Vector Studio',
    role: 'Full-Stack Engineer',
    start: '2020',
    end: '2023',
    description:
      'Built data-heavy dashboards and internal tooling for a logistics analytics startup, then led a replatform to a modern React stack.',
    achievements: [
      'Replatformed a legacy Angular app to React + TanStack Query, improving LCP by 47%',
      'Designed a Postgres schema powering 2M monthly dashboard sessions',
      'Introduced CI with GitHub Actions, cutting release time from 2 hours to 12 minutes',
      'Championed TypeScript adoption across the codebase',
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Docker', 'Vitest'],
  },
  {
    company: 'Pixel & Co',
    role: 'Frontend Developer',
    start: '2018',
    end: '2020',
    description:
      'Delivered award-nominated marketing sites and interactive experiences for brands and agencies.',
    achievements: [
      'Shipped 25+ production marketing sites with a focus on motion and performance',
      'Built a reusable animation library now used across the agency',
      'Won two agency awards for web experience design',
    ],
    technologies: ['JavaScript', 'React', 'GSAP', 'SCSS', 'Webpack'],
  },
  {
    company: 'Open Source & Freelance',
    role: 'Independent Developer',
    start: '2016',
    end: '2018',
    description:
      'Built products for clients across e-commerce, education, and hospitality while contributing to open source.',
    achievements: [
      'Launched three profitable side projects serving 10k+ users',
      'Contributed to React and TanStack ecosystem libraries',
      'Grew a personal GitHub following to 4k+ stars across repos',
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Heroku'],
  },
]
