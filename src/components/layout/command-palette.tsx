'use client'

import { startTransition, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Download, FileText, FolderGit2, Navigation, TerminalSquare } from 'lucide-react'
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
export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const navigate = useNavigate()

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

  const commands = useMemo(() => {
    const nav = [
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
    const proj = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      hint: p.tagline,
      href: `/projects?category=${p.category}`,
      download: false,
      icon: FolderGit2,
    }))
    const blog = posts.map((p) => ({
      id: `post-${p.slug}`,
      label: p.title,
      hint: p.category,
      href: `/blog/${p.slug}`,
      download: false,
      icon: FileText,
    }))
    return [
      { heading: 'Navigation', items: nav },
      { heading: 'Projects', items: proj },
      { heading: 'Blog', items: blog },
    ]
  }, [posts])

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
              {items.map(({ id, label, hint, href, download, icon: Icon }) => (
                <CommandItem
                  key={id}
                  value={`${heading} ${label} ${hint ?? ''}`}
                  onSelect={() => {
                    if (download) goDownload(href)
                    else if (href.startsWith('http')) goExternal(href)
                    else go(href)
                  }}
                >
                  <Icon />
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
