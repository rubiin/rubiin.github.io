import { Badge } from '@/components/ui/badge'
import type { ExperienceItem } from '@/types'

/** Print-friendly experience timeline for the resume page. */
export function ExperienceList({ items }: { items: ExperienceItem[] }) {
  return (
    <section aria-labelledby="resume-experience" className="mt-10">
      <h2 id="resume-experience" className="text-xl font-semibold tracking-tight">
        Experience
      </h2>
      <ol className="mt-4 flex flex-col gap-6">
        {items.map((item) => (
          <li key={`${item.company}-${item.role}`} className="border-l-2 border-border pl-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">{item.role}</h3>
              <span className="font-mono text-xs text-muted-foreground">
                {item.start} — {item.end ?? 'Present'}
              </span>
            </div>
            <p className="text-sm font-medium text-primary">{item.company}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
            {item.achievements.length > 0 && (
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
                {item.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
            {item.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.technologies.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
