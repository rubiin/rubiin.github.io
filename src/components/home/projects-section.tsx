import { ArrowRight, ExternalLink, FolderGit2 } from 'lucide-react'
import { Reveal } from '@/components/animations/reveal'
import { TiltCard } from '@/components/animations/tilt-card'
import { AnimatedBorder } from '@/components/animations/animated-border'
import { NeonButton } from '@/components/animations/neon-button'
import { GitHubIcon } from '@/components/ui/brand-icons'
import { BrowserFrame } from '@/components/projects/browser-frame'
import { ChapterHeading } from '@/components/home/chapter-heading'
import { CATEGORY_LABELS } from '@/lib/constants'
import { projects } from '@/data/projects'

const FEATURED = projects.filter((p) => p.featured).slice(0, 3)

function domainOf(title: string, demo?: string) {
  if (demo) {
    try {
      return new URL(demo).hostname.replace(/^www\./, '')
    } catch {
      /* fall through */
    }
  }
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '')}.dev`
}

/**
 * Featured projects (data-driven). Cards tilt in 3D, sport a rotating
 * gradient border, and lift with a neon glow on hover.
 */
export function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <ChapterHeading
        chapter="04"
        eyebrow="Selected work"
        title="Projects I'm proud of."
        description="A few things I've designed, built, and shipped — across AI, frontend, mobile, and more."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.08} className="h-full">
            <TiltCard className="h-full rounded-2xl">
              <AnimatedBorder className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-[inherit]">
                  {/* Visual: real screenshot in a browser frame */}
                  <BrowserFrame
                    url={domainOf(project.title, project.demo)}
                    className="aspect-[16/10]"
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} interface`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-accent-secondary/15 to-chart-3/10">
                        <FolderGit2 className="size-12 text-primary/50" aria-hidden />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium backdrop-blur">
                      {CATEGORY_LABELS[project.category]}
                    </span>
                  </BrowserFrame>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {project.title}
                      </h3>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {project.tagline}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {project.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border/50 bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {project.demo && (
                        <NeonButton href={project.demo} size="sm">
                          Live preview
                          <ExternalLink className="size-3.5" />
                        </NeonButton>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${project.title} on GitHub`}
                          className="glass flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                        >
                          <GitHubIcon className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </AnimatedBorder>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 flex justify-center">
        <NeonButton to="/projects" variant="outline" size="md">
          View all projects
          <ArrowRight className="size-4" />
        </NeonButton>
      </Reveal>
    </section>
  )
}
