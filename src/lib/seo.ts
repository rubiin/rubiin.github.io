import { siteConfig } from '@/data/site'

/** Prefix a path with the canonical site origin. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${siteConfig.url}${path === '/' ? '' : path}`
}

/** Escape text for safe inclusion in XML (sitemap/RSS). */
export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { rel: string; href: string }

/**
 * Standard + Open Graph + Twitter meta for a page. `image` falls back to the
 * site OG image when omitted.
 */
export function buildMeta({
  title,
  description,
  image,
  path,
  type = 'website',
}: {
  title: string
  description: string
  image?: string
  path: string
  type?: 'website' | 'article'
}): MetaTag[] {
  const url = absoluteUrl(path)
  const ogImage = image ? absoluteUrl(image) : absoluteUrl(siteConfig.seo.ogImage)
  return [
    { title },
    { name: 'description', content: description },
    { rel: 'canonical', href: url },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: ogImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ]
}

/** JSON-LD Person schema for the site owner. */
export function jsonLdPerson() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.location.split(',')[0],
      addressCountry: siteConfig.location.split(', ')[1] ?? 'NL',
    },
    sameAs: [siteConfig.socials.github, siteConfig.socials.linkedin, siteConfig.socials.twitter],
  }
}
