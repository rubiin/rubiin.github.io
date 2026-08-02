import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/data/site'
import { getPosts } from '@/server/blog'
import { absoluteUrl } from '@/lib/seo'

function esc(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function rssDate(date: string) {
  return new Date(date).toUTCString()
}

async function rssXml() {
  const posts = await getPosts()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(siteConfig.seo.title)}</title>
  <link>${esc(siteConfig.url)}</link>
  <description>${esc(siteConfig.seo.description)}</description>
  <language>en</language>
  <atom:link href="${esc(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />
  ${posts
    .map(
      (post) => `  <item>
    <title>${esc(post.title)}</title>
    <link>${esc(absoluteUrl(`/blog/${post.slug}`))}</link>
    <guid isPermaLink="true">${esc(absoluteUrl(`/blog/${post.slug}`))}</guid>
    <pubDate>${rssDate(post.date)}</pubDate>
    <description>${esc(post.description)}</description>
    <category>${esc(post.category)}</category>
  </item>`,
    )
    .join('\n')}
</channel>
</rss>`
}

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async () => {
        const xml = await rssXml()
        return new Response(xml, {
          headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
        })
      },
    },
  },
  component: () => null,
})
