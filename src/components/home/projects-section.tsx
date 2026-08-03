import { ArrowRight, ExternalLink, FolderGit2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/animations/reveal'
import { TiltCard } from '@/components/animations/tilt-card'
import { BrowserFrame } from '@/components/projects/browser-frame'
import { GitHubIcon } from '@/components/ui/brand-icons'
import { SectionHeading } from '@/components/home/section-heading'
import { CATEGORY_LABELS } from '@/lib/constants'
import { projects } from '@/data/projects'

const FEATURED = projects.filter((p) => p.featured).slice(0, 3)

/**
 * Featured projects (data-driven). Cards tilt on hover; images fall back to
 * a gradient placeholder with an icon when no asset is present.
 */
export function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Selected work"
        title="Projects I'm proud of."
        description="A few things I've designed, built, and shipped — across AI, frontend, mobile, and more."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.08}>
            <TiltCard className="h-full rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-lg">
              <article className="flex h-full flex-col overflow-hidden">
                {/* Visual: browser-framed gradient placeholder when no image */}
                <BrowserFrame
                  url={`${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '')}.dev`}
                  className="aspect-[16/10]"
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-accent/20 to-chart-1/10"
                    aria-hidden
                  >
                    <FolderGit2 className="size-12 text-primary/50" />
                    <span className="absolute top-3 left-3 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium backdrop-blur">
                      {CATEGORY_LABELS[project.category]}
                    </span>
                  </div>
                </BrowserFrame>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>

                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="font-normal">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    {project.demo && (
                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                        <a href={project.demo} target="_blank" rel="noreferrer">
                          View demo
                          <ExternalLink className="size-3.5" />
                        </a>
                      </Button>
                    )}
                    {project.github && (
                      <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        aria-label={`${project.title} on GitHub`}
                      >
                        <a href={project.github} target="_blank" rel="noreferrer">
                          <GitHubIcon className="size-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 flex justify-center">
        <Button asChild variant="outline" className="gap-2">
          <Link to={'/projects' as string}>
            View all projects
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>
    </section>
  )
}
