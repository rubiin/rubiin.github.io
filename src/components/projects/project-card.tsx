import { memo } from 'react'
import { ExternalLink, FolderGit2 } from 'lucide-react'
import { TiltCard } from '@/components/animations/tilt-card'
import { AnimatedBorder } from '@/components/animations/animated-border'
import { NeonButton } from '@/components/animations/neon-button'
import { BrowserFrame } from '@/components/projects/browser-frame'
import { GitHubIcon } from '@/components/ui/brand-icons'
import { ResponsiveImage } from '@/components/ui/responsive-image'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { Project } from '@/types'

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
 * Data-driven project card: media (image/video or gradient placeholder),
 * category badge, title, tagline, tech badges, and GitHub/demo links.
 * Tilt on hover + rotating gradient border, matching the home section.
 * Memoized: the /projects grid re-renders while filtering, and `project`
 * is a stable static-data reference, so cards skip re-rendering.
 */
export const ProjectCard = memo(function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full rounded-2xl">
      <AnimatedBorder className="h-full">
        <article className="content-visibility group flex h-full flex-col overflow-hidden rounded-[inherit]">
          {/* Media — framed like a browser window */}
          <BrowserFrame url={domainOf(project.title, project.demo)} className="aspect-[16/10]">
            <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary/15 via-accent-secondary/15 to-chart-3/10">
              {project.image ? (
                <ResponsiveImage
                  src={project.image}
                  alt={`${project.title} interface`}
                  widths={[320, 640, 800]}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  width={800}
                  height={500}
                  loading="lazy"
                  className="object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex size-full items-center justify-center" aria-hidden>
                  <FolderGit2 className="size-12 text-primary/50" />
                </div>
              )}
              <span className="absolute top-3 left-3 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium backdrop-blur">
                {CATEGORY_LABELS[project.category]}
              </span>
            </div>
          </BrowserFrame>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-display text-lg font-semibold tracking-tight">{project.title}</h2>
              <span className="text-xs tabular-nums text-muted-foreground">{project.year}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>

            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {project.tech.slice(0, 5).map((tech) => (
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
  )
})
