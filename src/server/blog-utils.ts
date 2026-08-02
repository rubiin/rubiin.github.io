export type TocItem = {
  id: string
  text: string
  level: number
}

/**
 * Extract a table of contents from raw markdown by scanning `##` and `###`
 * headings. IDs are generated with GitHub-slugger semantics (lowercase,
 * spaces → dashes, punctuation stripped) so they match the anchors that
 * rehype-slug emits during MDX compilation.
 */
export function extractToc(markdown: string): TocItem[] {
  const toc: TocItem[] = []
  const seen = new Map<string, number>()
  for (const line of markdown.split('\n')) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line)
    if (!match) continue
    const level = match[1]!.length
    const text = match[2]!.trim()
    const base = slugify(text)
    // Match github-slugger dedup semantics so ids line up with rehype-slug:
    // repeated headings become `heading`, `heading-1`, `heading-2`, ...
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count}`
    toc.push({ id, text, level })
  }
  return toc
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
