export interface SiteConfig {
  name: string
  firstName: string
  role: string
  tagline: string
  bio: string
  email: string
  location: string
  url: string
  availability: boolean
  resumePdfUrl?: string
  avatar?: string
  socials: {
    github: string
    linkedin: string
    twitter: string
    rss: string
    email: string
  }
  seo: {
    title: string
    description: string
    ogImage: string
    keywords: string[]
  }
}

export interface NavItem {
  label: string
  href: string
  description?: string
  /** Renders as a direct download link instead of a route link. */
  download?: boolean
}

export interface Profile {
  name: string
  role: string
  bio: string
  shortBio: string
  highlights: string[]
  interests: string[]
  philosophy: string
  careerHighlights: string[]
}

export interface Skill {
  name: string
  level: number // 0-100
  /** Start year of using this skill — years of experience are derived from it. */
  since: number
  technologies?: string[]
  relatedProjects?: string[]
  color?: string
}

export interface SkillCategory {
  name: string
  icon: string
  skills: Skill[]
}

export interface ExperienceItem {
  company: string
  role: string
  start: string
  end?: string
  current?: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export interface EducationItem {
  school: string
  degree: string
  field: string
  start: string
  end: string
  notes?: string
}

export interface Certification {
  name: string
  issuer: string
  year: string
  url?: string
  credentialId?: string
}

export interface Award {
  name: string
  issuer: string
  year: string
  description: string
}

export type ProjectCategory = 'frontend' | 'backend' | 'ai' | 'terminal' | 'full-stack'

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  category: ProjectCategory
  year: string
  tech: string[]
  image?: string
  video?: string
  github?: string
  demo?: string
  featured?: boolean
  architecture?: string
  challenges: string[]
  lessons: string[]
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar?: string
}
