'use client'

import { startTransition, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Download,
  FileText,
  FolderGit2,
  Navigation,
  TerminalSquare,
  type LucideIcon,
} from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { PALETTES } from '@/stores/theme-store'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { navItems } from '@/data/nav'
import { projects } from '@/data/projects'
import { getPosts } from '@/server/blog'
import { BLOG_POSTS_QUERY_KEY } from '@/lib/constants'

/**
 * ⌘K palette: fuzzy-search navigation, projects, and blog posts.
 * Keyboard navigable via cmdk; selects navigate through the router.
 */
type CommandEntry = {
  id: string
  label: string
  hint?: string
  href?: string
  download?: boolean
  icon?: LucideIcon
  swatch?: [string, string, string]
  onSelect?: () => void
}

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const { palette, setPalette } = useTheme()

  // Shares BLOG_POSTS_QUERY_KEY with the blog index loader, which seeds the
  // cache on page load — opening ⌘K then never refetches. Posts are static
  // build-time content, so staleTime: Infinity keeps it fetch-once-per-session.
  const { data: posts = [] } = useQuery({
    queryKey: BLOG_POSTS_QUERY_KEY,
    queryFn: () => getPosts(),
    enabled: open,
    staleTime: Infinity,
  })

  const go = (href: string) => {
    setOpen(false)
    // Navigation as a transition: the palette closes instantly and the
    // route renders off the critical path (use-transitions).
    startTransition(() => {
      void navigate({ to: href })
    })
  }

  const goExternal = (href: string) => {
    setOpen(false)
    window.open(href, '_blank', 'noreferrer')
  }

  const goDownload = (href: string) => {
    setOpen(false)
    const a = document.createElement('a')
    a.href = href
    a.download = ''
    a.rel = 'noreferrer'
    a.click()
  }

  const commands = useMemo<{ heading: string; items: CommandEntry[] }[]>(() => {
    const nav: CommandEntry[] = [
      ...navItems.map((item) => ({
        id: `nav-${item.href}`,
        label: item.label,
        hint: item.description,
        href: item.href,
        download: item.download,
        icon: item.download ? Download : Navigation,
      })),
      {
        id: 'nav-terminal',
        label: 'Terminal',
        hint: 'Hidden CLI',
        href: '/terminal',
        download: false,
        icon: TerminalSquare,
      },
    ]
    // No per-project detail route exists, so project items land on the
    // projects grid pre-filtered to their category.
    const proj: CommandEntry[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      hint: p.tagline,
      href: `/projects?category=${p.category}`,
      download: false,
      icon: FolderGit2,
    }))
    const blog: CommandEntry[] = posts.map((p) => ({
      id: `post-${p.slug}`,
      label: p.title,
      hint: p.category,
      href: `/blog/${p.slug}`,
      download: false,
      icon: FileText,
    }))
    // Pick the color palette without leaving the page — same registry as
    // the PaletteToggle dropdown in the header.
    const palettes: CommandEntry[] = PALETTES.map(({ value, label, swatch }) => ({
      id: `palette-${value}`,
      label,
      hint: value === palette ? 'Active' : undefined,
      download: false,
      swatch,
      onSelect: () => {
        setPalette(value)
        setOpen(false)
      },
    }))
    return [
      { heading: 'Navigation', items: nav },
      { heading: 'Projects', items: proj },
      { heading: 'Blog', items: blog },
      { heading: 'Theme', items: palettes },
    ]
  }, [posts, palette, setPalette, setOpen])

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search pages, projects, and articles"
      aria-label="Command palette"
    >
      <CommandInput placeholder="Search pages, projects, articles…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map(({ heading, items }) =>
          items.length ? (
            <CommandGroup key={heading} heading={heading}>
              {items.map(({ id, label, hint, href, download, swatch, icon: Icon, onSelect }) => (
                <CommandItem
                  key={id}
                  value={`${heading} ${label} ${hint ?? ''}`}
                  onSelect={() => {
                    if (onSelect) {
                      onSelect()
                      return
                    }
                    if (download && href) goDownload(href)
                    else if (href?.startsWith('http')) goExternal(href)
                    else if (href) go(href)
                  }}
                >
                  {swatch ? (
                    <span className="flex shrink-0 items-center gap-0.5" aria-hidden>
                      {swatch.map((color) => (
                        <span
                          key={color}
                          className="size-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                  ) : (
                    Icon && <Icon />
                  )}
                  <span>{label}</span>
                  {hint && (
                    <span className="ml-auto truncate pl-4 text-xs text-muted-foreground">
                      {hint}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null,
        )}
      </CommandList>
    </CommandDialog>
  )
}
