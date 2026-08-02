'use client'

import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { FileText, FolderGit2, Navigation } from 'lucide-react'
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
import { useCommand } from '@/hooks/use-command'

/**
 * ⌘K palette: fuzzy-search navigation, projects, and blog posts.
 * Keyboard navigable via cmdk; selects navigate through the router.
 */
export function CommandPalette() {
  const { open, setOpen } = useCommand()
  const navigate = useNavigate()

  const { data: posts = [] } = useQuery({
    queryKey: ['command-palette-posts'],
    queryFn: () => getPosts(),
    enabled: open,
  })

  const go = (href: string) => {
    setOpen(false)
    void navigate({ to: href })
  }

  const goExternal = (href: string) => {
    setOpen(false)
    window.open(href, '_blank', 'noreferrer')
  }

  const commands = useMemo(() => {
    const nav = navItems.map((item) => ({
      id: `nav-${item.href}`,
      label: item.label,
      hint: item.description,
      href: item.href,
      icon: Navigation,
    }))
    // No per-project detail route exists, so project items land on the
    // projects grid pre-filtered to their category.
    const proj = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      hint: p.tagline,
      href: `/projects?category=${p.category}`,
      icon: FolderGit2,
    }))
    const blog = posts.map((p) => ({
      id: `post-${p.slug}`,
      label: p.title,
      hint: p.category,
      href: `/blog/${p.slug}`,
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
              {items.map(({ id, label, hint, href, icon: Icon }) => (
                <CommandItem
                  key={id}
                  value={`${heading} ${label} ${hint ?? ''}`}
                  onSelect={() => (href.startsWith('http') ? goExternal(href) : go(href))}
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
