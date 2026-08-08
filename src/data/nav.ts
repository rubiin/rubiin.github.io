import type { NavItem } from '@/types'
import { siteConfig } from '@/data/site'

export const navItems: NavItem[] = [
  {
    label: 'About',
    href: '/#about',
    description: 'Biography, philosophy, and career highlights',
  },
  {
    label: 'Experience',
    href: '/#experience',
    description: 'Work history and achievements',
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
  // Deliberately last: it's an action (PDF download), not a page.
  {
    label: 'Resume',
    href: siteConfig.resumePdfUrl ?? '#',
    description: 'Download my résumé as a PDF',
    download: true,
  },
]
