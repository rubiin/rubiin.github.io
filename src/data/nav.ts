import type { NavItem } from '@/types'
import { siteConfig } from '@/data/site'

export const navItems: NavItem[] = [
  {
    label: 'About',
    href: '/#about',
    description: 'Biography, philosophy, and career highlights',
  },
  {
    label: 'Skills',
    href: '/#skills',
    description: 'Technologies and proficiencies',
  },
  {
    label: 'Projects',
    href: '/projects',
    description: 'Selected work across the stack',
  },
  {
    label: 'Blog',
    href: '/blog',
    description: 'Writing on engineering and design',
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Get in touch',
  },
  // Deliberately last: it's an action (PDF download), not a page.
  {
    label: 'Resume',
    href: siteConfig.resumePdfUrl ?? '#',
    description: 'Download my résumé as a PDF',
    download: true,
  },
]
