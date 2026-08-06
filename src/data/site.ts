import type { SiteConfig } from '@/types'
import { YEARS_OF_EXPERIENCE } from '@/lib/constants'

export const siteConfig: SiteConfig = {
  name: 'Rubin Bhandari',
  firstName: 'Rubin',
  role: 'Software Engineer',
  tagline: 'Turning caffeine boosts to code breakthrough.',
  bio: `Full-stack developer with ${YEARS_OF_EXPERIENCE}+ years of experience crafting robust web applications and API systems with JavaScript and Golang.`,

  email: 'roobin.bhandari@gmail.com',
  location: 'Nepal',
  url: 'https://rubiin.is-a.dev',
  availability: true,
  // Same-origin so the browser honors the `download` attribute and forces
  // the file download instead of opening the PDF inline.
  resumePdfUrl: '/resume.pdf',
  avatar: 'https://github.com/rubiin.png',
  socials: {
    github: 'https://github.com/rubiin',
    linkedin: 'https://www.linkedin.com/in/rubiin',
    twitter: 'https://x.com/RubinCodes',
    rss: '/rss.xml',
    email: 'mailto:roobin.bhandari@gmail.com',
  },
  seo: {
    title: 'Rubin Bhandari — Software Engineer',
    description:
      'Experienced full-stack developer proficient in JavaScript and Golang, specializing in crafting robust web applications and API systems for seamless user interactions.',
    ogImage: '/og.png',
    keywords: [
      'software engineer',
      'full-stack',
      'javascript',
      'typescript',
      'golang',
      'nestjs',
      'node.js',
      'docker',
      'postgresql',
      'portfolio',
      'blog',
    ],
  },
}
