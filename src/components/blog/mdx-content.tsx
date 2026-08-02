import { MDXContent as ContentCollectionsMDX } from '@content-collections/mdx/react'
import { mdxComponents } from '@/components/blog/mdx-components'

/**
 * Renders a compiled MDX module string produced by content-collections'
 * compileMDX, using the package's official React renderer (handles the
 * `_jsx_runtime` plumbing and hydration correctly).
 */
export function MDXContent({ code }: { code: string }) {
  return <ContentCollectionsMDX code={code} components={mdxComponents} />
}
