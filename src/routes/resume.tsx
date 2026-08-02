import { createFileRoute } from '@tanstack/react-router'
import { AtSign, Briefcase, Download, GitBranch, Mail, MapPin, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExperienceList } from '@/components/resume/experience-list'
import { SkillBars } from '@/components/resume/skill-bars'
import {
  AwardList,
  CertificationList,
  EducationList,
} from '@/components/resume/credential-sections'
import { resumeData } from '@/data/resume'
import { siteConfig } from '@/data/site'

export const Route = createFileRoute('/resume')({
  head: () => ({
    meta: [
      { title: 'Resume — Devina' },
      {
        name: 'description',
        content:
          'Resume of Devina — creative developer and full-stack engineer with 8+ years of experience.',
      },
    ],
  }),
  component: ResumePage,
})

function ResumePage() {
  const { profile, experience, education, certifications, awards, skills } = resumeData

  const socials = [
    { label: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
    { label: 'github.com/devina', href: siteConfig.socials.github, icon: GitBranch },
    { label: 'linkedin.com/in/devina', href: siteConfig.socials.linkedin, icon: Briefcase },
    { label: 'twitter.com/devina_dev', href: siteConfig.socials.twitter, icon: AtSign },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Print controls (hidden when printing) */}
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Resume</p>
          <h1 className="text-2xl font-semibold tracking-tight">Devina — printable resume</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="size-4" aria-hidden />
            Print / Save as PDF
          </Button>
          {siteConfig.resumePdfUrl && siteConfig.resumePdfUrl !== '#' && (
            <Button asChild className="gap-2">
              <a href={siteConfig.resumePdfUrl} download>
                <Download className="size-4" aria-hidden />
                Download PDF
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Printable document */}
      <article className="rounded-2xl border bg-card p-8 sm:p-12 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">{profile.name}</h2>
            <p className="mt-1 text-lg font-medium text-primary">{profile.role}</p>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">{profile.shortBio}</p>
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {siteConfig.location}
            </p>
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-xs items-center gap-2 truncate hover:text-foreground"
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </a>
            ))}
          </div>
        </header>

        <ExperienceList items={experience} />
        <SkillBars categories={skills} />
        <EducationList items={education} />
        <CertificationList items={certifications} />
        <AwardList items={awards} />
      </article>
    </div>
  )
}
