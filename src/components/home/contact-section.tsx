'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Clock, Mail, MapPin, type LucideIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { NeonButton } from '@/components/animations/neon-button'
import { ChapterHeading } from '@/components/home/chapter-heading'
import { siteConfig } from '@/data/site'
import { GitHubIcon, LinkedInIcon, XIcon } from '@/components/ui/brand-icons'
import { cn } from '@/lib/utils'

const SOCIALS = [
  { label: 'GitHub', href: siteConfig.socials.github, icon: GitHubIcon },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin, icon: LinkedInIcon },
  { label: 'X', href: siteConfig.socials.twitter, icon: XIcon },
  { label: 'Email', href: siteConfig.socials.email, icon: Mail },
]

/** Static detail row — icon square, tiny label, muted value. */
function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <span className="glass flex size-10 shrink-0 items-center justify-center rounded-xl text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[0.65rem] font-medium tracking-widest text-muted-foreground/70 uppercase">
          {label}
        </span>
        <span className="truncate text-muted-foreground">{value}</span>
      </span>
    </li>
  )
}

/**
 * Email row as a copy-to-clipboard control: the icon square rounds into a
 * gradient check on success and the trailing hint flips to "Copied". A
 * toast confirms for screen readers.
 */
function CopyEmailRow({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? 'Email copied' : 'Copy email address'}
        className="group flex w-full cursor-pointer items-center gap-3 text-left text-sm"
      >
        <span
          aria-hidden
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl text-primary transition-all duration-300',
            'glass group-hover:rounded-full group-hover:shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)]',
            copied &&
              'rounded-full bg-gradient-to-br from-primary to-accent-secondary text-primary-foreground shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--primary)_80%,transparent)]',
          )}
        >
          {copied ? <Check className="size-4" /> : <Mail className="size-4" />}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[0.65rem] font-medium tracking-widest text-muted-foreground/70 uppercase">
            Email
          </span>
          <span className="truncate font-mono text-muted-foreground transition-colors group-hover:text-primary">
            {siteConfig.email}
          </span>
        </span>
        <span
          aria-hidden
          className={cn(
            'ml-1 text-[0.65rem] font-semibold tracking-wider text-primary/70 uppercase transition-opacity duration-200',
            copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        >
          {copied ? 'Copied' : 'Copy'}
        </span>
      </button>
    </li>
  )
}

/**
 * Home contact section: availability + interactive contact details on the
 * left, a magnetic "Say hello" mailto CTA and morphing socials on the right.
 * No form — the mail button opens the visitor's mail client, and the email
 * row copies the address to the clipboard with live feedback.
 */
export function ContactSection() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | null>(null)

  // Clear the 2s "copied" reset if the section unmounts first.
  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current)
    },
    [],
  )

  const copyEmail = useCallback(() => {
    const write = async () => {
      try {
        await navigator.clipboard.writeText(siteConfig.email)
      } catch {
        // Clipboard API needs a secure context; fall back to a hidden textarea.
        const el = document.createElement('textarea')
        el.value = siteConfig.email
        el.setAttribute('readonly', '')
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      setCopied(true)
      toast({ title: 'Email copied', description: 'Paste it anywhere to get in touch.' })
      if (resetTimer.current) window.clearTimeout(resetTimer.current)
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000)
    }
    void write()
  }, [toast])

  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <ChapterHeading
        chapter="06"
        eyebrow="Contact"
        title="Let's build something together."
        description="Open to freelance projects and select collaborations — tell me about your idea and I'll reply within 1–2 business days."
      />

      <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14">
        {/* Ambient gradient glows behind the content */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 -right-28 size-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-28 size-80 rounded-full bg-accent-secondary/10 blur-3xl"
        />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Left: availability + contact details */}
          <div className="flex max-w-xl flex-col gap-6">
            <span className="glass inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="relative flex size-2">
                <span
                  aria-hidden
                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none"
                />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {siteConfig.availability ? 'Available for freelance' : 'Not currently available'}
            </span>

            <ul className="flex flex-col gap-4">
              <CopyEmailRow copied={copied} onCopy={copyEmail} />
              <InfoRow
                icon={MapPin}
                label="Based in"
                value={`${siteConfig.location} · ${siteConfig.role}`}
              />
              <InfoRow
                icon={Clock}
                label="Response time"
                value="Usually within 1–2 business days"
              />
            </ul>
          </div>

          {/* Right: the mail CTA + socials */}
          <div className="flex flex-col items-start gap-8 lg:items-end">
            <MagneticButton>
              <NeonButton href={siteConfig.socials.email} size="lg" ariaLabel="Send me an email">
                <Mail className="size-4" />
                Say hello
                <ArrowUpRight className="size-4" />
              </NeonButton>
            </MagneticButton>

            <div className="flex flex-wrap items-center gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={label}
                  title={label}
                  className="glass group flex size-12 items-center justify-center rounded-xl text-muted-foreground transition-all duration-500 hover:rounded-full hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-accent-secondary hover:text-primary-foreground hover:shadow-[0_0_28px_-6px_color-mix(in_oklab,var(--primary)_80%,transparent)]"
                >
                  <Icon className="size-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[8deg]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
