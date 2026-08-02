import { ExternalLink, FolderGit2, GitBranch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TiltCard } from '@/components/animations/tilt-card'
import { BrowserFrame } from '@/components/projects/browser-frame'
import { CATEGORY_LABELS } from '@/lib/constants'
import type { Project } from '@/types'

/**
 * Data-driven project card: media (image/video or gradient placeholder),
 * category badge, title, tagline, tech badges, and GitHub/demo links.
 * Tilt on hover via the shared TiltCard.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard
      className="h-full rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <article className="flex h-full flex-col overflow-hidden">
        {/* Media — framed like a browser window */}
        <BrowserFrame
          url={`${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '')}.dev`}
          className="aspect-video"
        >
          <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary/15 via-accent/20 to-chart-1/10">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="size-full object-cover"
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
          <h2 className="text-lg font-semibold tracking-tight">{project.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tech.slice(0, 5).map((tech) => (
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
              <Button asChild size="icon" variant="ghost" aria-label={`${project.title} on GitHub`}>
                <a href={project.github} target="_blank" rel="noreferrer">
                  <GitBranch className="size-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  )
}
