import { createServerFn } from '@tanstack/react-start'
import { allPosts } from 'content-collections'
import type { Post } from 'content-collections'

export type PostSummary = {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  category: string
  featured: boolean
  /** Relative popularity, used by the blog's "popular" sort. */
  views: number
  coverImage?: string
  readingTime: number
}

function toSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    category: post.category,
    featured: post.featured,
    views: post.views,
    coverImage: post.coverImage,
    readingTime: post.readingTime,
  }
}

// All published posts, newest first.
export const getPosts = createServerFn().handler(async () => {
  return allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(toSummary)
})

// A single post by slug, or null when missing/draft.
export const getPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const post = allPosts.find((p) => p.slug === slug && !p.draft)
    return post ?? null
  })

// Tag frequency across published posts.
export const getPostTags = createServerFn().handler(async () => {
  const counts = new Map<string, number>()
  for (const post of allPosts) {
    if (post.draft) continue
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
})

// Category frequency across published posts.
export const getPostCategories = createServerFn().handler(async () => {
  const counts = new Map<string, number>()
  for (const post of allPosts) {
    if (post.draft) continue
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
})

// Prev/next neighbors only — no need to serialize the whole posts list.
export const getPostNeighbors = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const all = allPosts.filter((post) => !post.draft).sort((a, b) => (a.date < b.date ? 1 : -1))
    const idx = all.findIndex((p) => p.slug === slug)
    if (idx === -1) return { newer: null, older: null }
    const newer = idx > 0 ? toSummary(all[idx - 1]!) : null
    const older = idx < all.length - 1 ? toSummary(all[idx + 1]!) : null
    return { newer, older }
  })

// Related posts: same category first, then shared tags, then newest.
export const getRelatedPosts = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const current = allPosts.find((p) => p.slug === slug)
    const candidates = allPosts.filter((p) => !p.draft && p.slug !== slug)
    if (!current) return []

    const score = (p: Post): number => {
      let s = 0
      if (p.category === current.category) s += 10
      s += p.tags.filter((t) => current.tags.includes(t)).length * 2
      return s
    }

    return candidates
      .sort((a, b) => score(b) - score(a) || (a.date < b.date ? 1 : -1))
      .slice(0, 3)
      .map(toSummary)
  })
