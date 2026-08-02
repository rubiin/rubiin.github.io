import { AtSign, Briefcase, Clock, GitBranch, Mail, MapPin } from 'lucide-react'
import { siteConfig } from '@/data/site'

/** Contact details: email, location, socials, response-time note. */
export function ContactInfo() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Direct
        </h2>
        <a
          href={`mailto:${siteConfig.email}`}
          className="group flex items-center gap-3 text-lg font-medium hover:text-primary"
        >
          <Mail className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
          {siteConfig.email}
        </a>
        <p className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="size-5" aria-hidden />
          {siteConfig.location}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Elsewhere
        </h2>
        <div className="flex flex-col gap-2.5">
          {[
            { label: 'GitHub', href: siteConfig.socials.github, icon: GitBranch },
            { label: 'LinkedIn', href: siteConfig.socials.linkedin, icon: Briefcase },
            { label: 'Twitter / X', href: siteConfig.socials.twitter, icon: AtSign },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="size-4 transition-colors group-hover:text-primary" />
              {label}
              <span className="ml-auto font-mono text-xs opacity-50">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
        <Clock className="size-4 shrink-0 text-primary" aria-hidden />
        <p>Usually responds within 1–2 business days. Open to freelance and full-time.</p>
      </div>
    </div>
  )
}
