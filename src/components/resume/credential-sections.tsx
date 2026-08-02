import { ExternalLink } from 'lucide-react'
import type { Award, Certification, EducationItem } from '@/types'

/** Education list. */
export function EducationList({ items }: { items: EducationItem[] }) {
  return (
    <section aria-labelledby="resume-education" className="mt-10">
      <h2 id="resume-education" className="text-xl font-semibold tracking-tight">
        Education
      </h2>
      <ul className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <li key={`${item.school}-${item.field}`} className="flex flex-wrap justify-between gap-2">
            <div>
              <p className="font-medium">
                {item.degree} {item.field}
              </p>
              <p className="text-sm text-muted-foreground">{item.school}</p>
              {item.notes && <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>}
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {item.start} — {item.end}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Certifications list. */
export function CertificationList({ items }: { items: Certification[] }) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby="resume-certifications" className="mt-10">
      <h2 id="resume-certifications" className="text-xl font-semibold tracking-tight">
        Certifications
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="font-medium">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    {item.name}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                ) : (
                  item.name
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.issuer}
                {item.credentialId ? ` · ${item.credentialId}` : ''}
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Awards list. */
export function AwardList({ items }: { items: Award[] }) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby="resume-awards" className="mt-10">
      <h2 id="resume-awards" className="text-xl font-semibold tracking-tight">
        Awards
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.issuer} · {item.description}
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
