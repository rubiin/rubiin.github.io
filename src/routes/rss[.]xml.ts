import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/data/site'
import { getPosts } from '@/server/blog'
import { absoluteUrl, xmlEscape } from '@/lib/seo'


function rssDate(date: string) {
  return new Date(date).toUTCString()
}

async function rssXml() {
  const posts = await getPosts()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${xmlEscape(siteConfig.seo.title)}</title>
  <link>${xmlEscape(siteConfig.url)}</link>
  <description>${xmlEscape(siteConfig.seo.description)}</description>
  <language>en</language>
  <atom:link href="${xmlEscape(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml" />
  ${posts
    .map(
      (post) => `  <item>
    <title>${xmlEscape(post.title)}</title>
    <link>${xmlEscape(absoluteUrl(`/blog/${post.slug}`))}</link>
    <guid isPermaLink="true">${xmlEscape(absoluteUrl(`/blog/${post.slug}`))}</guid>
    <pubDate>${rssDate(post.date)}</pubDate>
    <description>${xmlEscape(post.description)}</description>
    <category>${xmlEscape(post.category)}</category>
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
