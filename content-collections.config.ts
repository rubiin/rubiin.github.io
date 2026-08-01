import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import { z } from 'zod'
import { remarkMermaid } from './scripts/remark-mermaid'
import { extractToc } from './src/server/blog-utils'

export const posts = defineCollection({
  name: 'posts',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('engineering'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkMath, remarkMermaid],
      rehypePlugins: [rehypeKatex, rehypeSlug],
    })
    return {
      ...document,
      mdx,
      readingTime: Math.max(1, Math.round(document.content.split(/\s+/).length / 200)),
      toc: extractToc(document.content),
    }
  },
})

export default defineConfig({
  content: [posts],
})
