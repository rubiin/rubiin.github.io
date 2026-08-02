import { createFileRoute } from '@tanstack/react-router'
import { getPosts } from '@/server/blog'
import { absoluteUrl, xmlEscape } from '@/lib/seo'

const STATIC_PATHS = ['', '/projects', '/resume', '/blog', '/contact', '/rss.xml'] as const

async function sitemapXml() {
  const posts = await getPosts()

  const urls = [
    ...STATIC_PATHS.map((path) => ({ path, lastmod: undefined as string | undefined })),
    ...posts.map((post) => ({ path: `/blog/${post.slug}`, lastmod: post.date })),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(absoluteUrl(u.path))}</loc>${u.lastmod ? `\n    <lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const xml = await sitemapXml()
        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        })
      },
    },
  },
  component: () => null,
})
