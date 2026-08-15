'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { siteConfig } from '@/data/site'
import { skillCategories } from '@/data/skills'
import { profile } from '@/data/profile'
import { setMode, themeStore } from '@/stores/theme-store'

const BANNER = [
  '   ____          _             _      ',
  '  |  _ \\  ___ __(_)_ __  _   _(_) __ _ ',
  '  | | | |/ _ \\_  / |  _ \\| | | | |/ _` |',
  '  | |_| |  __// /| | | | | |_| | | (_| |',
  '  |____/ \\___/___|_|_| |_|\\__,_|_|\\__,_|',
  '                                        ',
  `  ${siteConfig.role}`,
].join('\n')

const COMMANDS = [
  'help',
  'about',
  'skills',
  'projects',
  'resume',
  'blog',
  'github',
  'linkedin',
  'theme',
  'whoami',
  'date',
  'echo',
  'ls',
  'sudo',
  'banner',
  'clear',
]

const TITLE_BAR = (
  <div className="flex items-center gap-2 border-b border-border/70 bg-[#0a192f]/80 px-4 py-3">
    <span aria-hidden className="size-3 rounded-full bg-[#ef6b73]" />
    <span aria-hidden className="size-3 rounded-full bg-[#ffae57]" />
    <span aria-hidden className="size-3 rounded-full bg-[#bae67e]" />
    <span className="ml-3 truncate font-mono text-xs text-muted-foreground">
      rubin@portfolio — zsh
    </span>
  </div>
)

const HELP = [
  'Available commands:',
  '  help       show this help',
  '  about      who I am',
  '  skills     what I work with',
  '  projects   open the projects grid',
  '  resume     download my resume (PDF)',
  '  blog       read my writing',
  '  github     open GitHub',
  '  linkedin   open LinkedIn',
  '  theme      toggle light/dark',
  '  whoami     identity check',
  '  date       current time',
  '  echo <t>   print text',
  '  ls         list workspace files',
  '  sudo <c>   pretend to be root',
  '  banner     print the banner again',
  '  clear      clear the screen',
  '',
  'Tips: Tab autocompletes, ↑/↓ walks history.',
].join('\n')

interface Line {
  key: number
  node: ReactNode
}

let keySeq = 0
const nextKey = () => ++keySeq

/**
 * Hidden interactive terminal. Text-driven, keyboard navigable, and safe
 * under reduced motion (no animations). Commands navigate via the router
 * or open external profiles in a new tab.
 */
export function Terminal() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>(() => [
    { key: nextKey(), node: <pre className="text-primary">{BANNER}</pre> },
    {
      key: nextKey(),
      node: (
        <span>
          Type <span className="text-primary">help</span> to get started.
        </span>
      ),
    },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const print = useCallback((node: ReactNode) => {
    setLines((prev) => [...prev, { key: nextKey(), node }])
  }, [])

  const run = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      print(
        <span>
          <span className="text-primary">➜</span> <span className="text-muted-foreground">~</span>{' '}
          {raw}
        </span>,
      )
      if (!trimmed) return

      const [cmd, ...args] = trimmed.split(/\s+/)
      const arg = args.join(' ')
      if (!cmd) return
      const lower = cmd.toLowerCase()

      const link = (label: string, to: string, external = false) => (
        <span>
          {external ? (
            <a
              className="text-primary underline underline-offset-2 hover:opacity-80"
              href={to}
              target="_blank"
              rel="noreferrer"
            >
              {label}
            </a>
          ) : (
            <a
              className="text-primary underline underline-offset-2 hover:opacity-80"
              href={to}
              onClick={(e) => {
                e.preventDefault()
                void navigate({ to })
              }}
            >
              {label}
            </a>
          )}
        </span>
      )

      switch (lower) {
        case 'help':
          print(<pre className="whitespace-pre-wrap">{HELP}</pre>)
          break
        case 'about':
          print(
            <span>
              {profile.bio}
              <br />
              Based in {siteConfig.location} ·{' '}
              {siteConfig.availability ? 'available for freelance' : 'not currently available'}.
            </span>,
          )
          break
        case 'skills':
          print(
            <span>
              {skillCategories
                .map((c) => `${c.name}: ${c.skills.map((s) => s.name).join(', ')}`)
                .join('\n')}
            </span>,
          )
          break
        case 'projects':
          print(<span>Opening {link('the projects grid', '/projects')}…</span>)
          break
        case 'resume':
          print(
            <span>Downloading {link('resume.pdf', siteConfig.resumePdfUrl ?? '#', true)}…</span>,
          )
          break
        case 'blog':
          print(<span>Opening {link('the blog', '/blog')}…</span>)
          break
        case 'github':
          print(<span>Opening {link('github.com/rubiin', siteConfig.socials.github, true)}…</span>)
          break
        case 'linkedin':
          print(
            <span>
              Opening {link('linkedin.com/in/rubiin', siteConfig.socials.linkedin, true)}…
            </span>,
          )
          break
        case 'theme': {
          const next: 'light' | 'dark' = themeStore.state.mode === 'light' ? 'dark' : 'light'
          setMode(next)
          print(<span>Theme toggled to {next}.</span>)
          break
        }
        case 'whoami':
          print(<span>rubin — {siteConfig.role}</span>)
          break
        case 'date':
          print(<span>{new Date().toLocaleString()}</span>)
          break
        case 'echo':
          print(<span>{arg || '(empty)'}</span>)
          break
        case 'ls':
          print(
            <span className="text-muted-foreground">
              about.md skills.ts projects/ blog/ resume.pdf secrets/
            </span>,
          )
          break
        case 'sudo':
          print(
            <span className="text-destructive">
              rubin is not in the sudoers file. This incident will be reported. 🚨
            </span>,
          )
          break
        case 'banner':
          print(<pre className="text-primary">{BANNER}</pre>)
          break
        case 'clear':
          setLines([])
          break
        default: {
          const suggestion = COMMANDS.find((c) => c.startsWith(lower))
          print(
            <span>
              <span className="text-destructive">command not found: {lower}</span>
              {suggestion ? (
                <>
                  {' '}
                  — did you mean <span className="text-primary">{suggestion}</span>?
                </>
              ) : null}
            </span>,
          )
        }
      }
    },
    [navigate, print],
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setHistory((h) => [...h, input])
    setHistIdx(-1)
    run(input)
    setInput('')
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const match = COMMANDS.find((c) => c.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === -1) return
      const next = histIdx + 1
      if (next >= history.length) {
        setHistIdx(-1)
        setInput('')
      } else {
        setHistIdx(next)
        setInput(history[next] ?? '')
      }
    }
  }

  return (
    <div className="terminal-root mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col px-4 py-10 sm:px-6">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-[#04101f]/95 shadow-2xl shadow-black/30">
        {TITLE_BAR}

        {/* Output */}
        <div
          ref={scrollRef}
          role="log"
          aria-label="Terminal output"
          className="flex-1 overflow-y-auto px-5 py-4 font-mono text-sm leading-relaxed text-[#ccd6f6]"
        >
          {lines.map((l) => (
            <div key={l.key} className="whitespace-pre-wrap break-words">
              {l.node}
            </div>
          ))}

          {/* Prompt */}
          <form onSubmit={onSubmit} className="mt-1 flex items-center gap-2">
            <span aria-hidden className="text-primary">
              ➜
            </span>
            <span aria-hidden className="text-muted-foreground">
              ~
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Terminal input"
              className="w-full bg-transparent font-mono text-sm text-[#ccd6f6] caret-primary outline-none placeholder:text-muted-foreground/50"
              placeholder="type help…"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
