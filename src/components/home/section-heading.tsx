import { Reveal } from '@/components/animations/reveal'
import { cn } from '@/lib/utils'

/**
 * Consistent section heading: small eyebrow label, title, optional
 * description. Reveals on scroll.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        'mb-10 flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && (
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      )}
    </Reveal>
  )
}
