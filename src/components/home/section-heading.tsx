'use client'

import type { ComponentProps } from 'react'
import { ChapterHeading } from '@/components/home/chapter-heading'

/**
 * Page-level section heading: the same kinetic opener look as the home
 * chapters (glowing eyebrow, word-reveal title, drawn gradient rule) minus
 * the chapter number. A thin wrapper so the two headings can't drift.
 */
export function SectionHeading(props: ComponentProps<typeof ChapterHeading>) {
  return <ChapterHeading {...props} />
}
