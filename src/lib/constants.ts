import type { ProjectCategory } from '@/types'

export const PROJECT_CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'ai', label: 'AI' },
  { value: 'devops', label: 'DevOps' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'full-stack', label: 'Full Stack' },
]

export const CATEGORY_LABELS: Record<ProjectCategory, string> = Object.fromEntries(
  PROJECT_CATEGORIES.map(({ value, label }) => [value, label]),
) as Record<ProjectCategory, string>

export const PROJECTS_PER_PAGE = 6
export const POSTS_PER_PAGE = 6

/** Year Rubin started professionally — drives the always-current experience count. */
export const CAREER_START_YEAR = 2017

/** Years of experience, computed from the start year so it never goes stale. */
export const YEARS_OF_EXPERIENCE = new Date().getFullYear() - CAREER_START_YEAR

export const GISCUS_REPO = 'rubiin/rubiin.github.io'
export const GISCUS_REPO_ID = 'R_kgDOK_PORTFOLIO'
export const GISCUS_CATEGORY = 'Announcements'
export const GISCUS_CATEGORY_ID = 'DIC_kwDOK_PORTFOLIO'
