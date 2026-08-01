import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: 'Devina',
  firstName: 'Devina',
  role: 'Creative Developer & Full-Stack Engineer',
  tagline:
    'I craft premium, performant web experiences that feel as good as they look.',
  bio: 'Creative developer with 8+ years of experience shipping design-driven products — from real-time 3D experiences to enterprise design systems. I live at the intersection of engineering and design.',
  email: 'hello@devina.dev',
  location: 'Amsterdam, Netherlands',
  url: 'https://devina.dev',
  availability: true,
  resumePdfUrl: '#',
  socials: {
    github: 'https://github.com/devina',
    linkedin: 'https://linkedin.com/in/devina',
    twitter: 'https://twitter.com/devina_dev',
    rss: '/rss.xml',
    email: 'mailto:hello@devina.dev',
  },
  seo: {
    title: 'Devina — Creative Developer & Full-Stack Engineer',
    description:
      'Portfolio and blog of Devina — creative developer crafting premium web experiences with React, TypeScript, Three.js, and the TanStack ecosystem.',
    ogImage: '/og.png',
    keywords: [
      'creative developer',
      'full-stack engineer',
      'react',
      'typescript',
      'three.js',
      'tanstack',
      'portfolio',
      'blog',
    ],
  },
}
