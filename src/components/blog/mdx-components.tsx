import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { CodeBlock } from '@/components/blog/code-block'
import { Mermaid } from '@/components/blog/mermaid'
import { ImageZoom } from '@/components/blog/image-zoom'
import { AnimatedHeading } from '@/components/blog/animated-heading'
import { ReadingParagraph } from '@/components/blog/reading-paragraph'
import { cn } from '@/lib/utils'

/**
 * Shared component map passed to MDXContent for every blog post.
 * Code fences are intercepted so the raw code + language can be handed to
 * the client-side Shiki CodeBlock.
 */
export const mdxComponents = {
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => {
    const external = href?.startsWith('http')
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    )
  },
  pre: ({ children, className }: ComponentPropsWithoutRef<'pre'>) => {
    const child = children as ReactNode & { props?: { children?: string; className?: string } }
    const rawCode = child?.props?.children
    const rawLang = /language-([\w+-]+)/.exec(child?.props?.className ?? '')?.[1]
    if (typeof rawCode === 'string') {
      return <CodeBlock code={rawCode} lang={rawLang} className={className} />
    }
    return <pre className={cn('overflow-x-auto', className)}>{children}</pre>
  },
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code {...props} className={cn(props.className)} />
  ),
  img: ({ src, alt, className }: ComponentPropsWithoutRef<'img'>) => (
    <ImageZoom src={src ?? ''} alt={alt ?? ''} className={className} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => <ReadingParagraph {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <AnimatedHeading level="h2" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <AnimatedHeading level="h3" {...props} />,
  h4: (props: ComponentPropsWithoutRef<'h4'>) => <AnimatedHeading level="h4" {...props} />,
  Mermaid,
}

export type MDXComponents = typeof mdxComponents
