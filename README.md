# Devina — Portfolio, Interactive Resume & MDX Blog

A production-ready personal website built on the **TanStack ecosystem**: TanStack Start (SSR + server functions), TanStack Router (file-based routing, search params), TanStack Query, TanStack Form, and TanStack Store — with Tailwind CSS v4, shadcn/ui, Motion, and a lazy-loaded React Three Fiber 3D scene on the home page.

![Stack](https://img.shields.io/badge/TanStack-Start%20%7C%20Router%20%7C%20Query%20%7C%20Form%20%7C%20Store-ff4154)

---

## Overview

| Area | Highlights |
| --- | --- |
| **Home** | Full-viewport hero with lazy 3D workspace scene (R3F), animated gradient blobs, marquee, stats counters, mouse parallax |
| **Sections** | About, interactive skills (tabs + orbit constellation + tooltips), experience timeline (scroll-grown line, accordions), featured projects, contact CTA |
| **Projects** | `/projects` — search-param driven category pills + debounced search, responsive grid, empty state |
| **Blog** | `/blog` + `/blog/:slug` — MDX via content-collections, Shiki code blocks, KaTeX math, Mermaid diagrams, TOC, share buttons, related posts, giscus comments |
| **Resume** | `/resume` — printable (Print / Save as PDF), sections composed from data files |
| **Contact** | `/contact` — TanStack Form + shared Zod schema, server-side submit with graceful DB/email fallback |
| **Extras** | ⌘K command palette, light/dark/system theme, smooth scrolling (Lenis), scroll progress, custom 404 + error pages, RSS, sitemap, robots.txt, JSON-LD |

## Tech Stack

- **Framework:** TanStack Start 1.168, React 19.2, TypeScript ~5.9 (strict)
- **Data & routing:** TanStack Router 1.170, TanStack Query 5, TanStack Form 1.33, TanStack Store
- **Styling:** Tailwind CSS 4, shadcn/ui, CSS-variable design tokens
- **Motion & 3D:** Motion 12, Lenis, Three.js 0.185 + @react-three/fiber + drei (lazy-loaded)
- **Content:** content-collections + @content-collections/mdx, Shiki, KaTeX, Mermaid
- **Backend:** Prisma 7 + PostgreSQL (optional, graceful fallback), Resend (optional)

## Getting Started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Required first run (content generation):

```bash
pnpm content:build
```

Other scripts:

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Production build (`.output/`) |
| `pnpm start` | Run the production server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm content:build` | Regenerate `content-collections` output |
| `pnpm db:generate` | Generate the Prisma client |
| `pnpm db:migrate` | Run Prisma migrations (needs `DATABASE_URL`) |
| `pnpm db:seed` | Seed sample data (needs `DATABASE_URL`) |

## Environment Variables

Copy `.env.example` to `.env`. All are optional — the app runs without them.

| Variable | Purpose | Required |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (contact/newsletter/analytics persistence) | No |
| `RESEND_API_KEY` | Send contact-form emails via Resend | No |
| `RESEND_FROM_EMAIL` | From-address for emails | No |
| `CONTACT_TO_EMAIL` | Where contact messages are delivered | No |

Without `DATABASE_URL`, the contact form still succeeds and newsletter signups mock-ok. Without `RESEND_API_KEY`, no email is sent. Nothing crashes.

## Adding a Blog Post

1. Create `content/blog/my-post.mdx`
2. Add frontmatter:
   ```mdx
   ---
   title: "My Post Title"
   date: "2026-08-01"
   description: "One-liner used in cards, meta, and RSS."
   tags: ["react", "tanstack"]
   category: "engineering"
   featured: false
   ---
   ```
3. Write the body. Supported out of the box: Shiki code fences, KaTeX math (`$$...$$`), Mermaid diagrams (```mermaid), standard markdown, custom `Mermaid` component.
4. Run `pnpm content:build` — the post appears automatically at `/blog/my-post`. No routing or registration changes.

## Editing Content

All site content is data-driven in `src/data/`:

| File | Controls |
| --- | --- |
| `site.ts` | Name, role, email, URL, socials, SEO defaults |
| `nav.ts` | Header/footer navigation |
| `profile.ts` | Hero bio, highlights, interests, philosophy |
| `skills.ts` | Skill categories, levels, years, related projects |
| `experience.ts` | Work history + achievements + technologies |
| `education.ts`, `certifications.ts`, `awards.ts` | Credentials |
| `projects.ts` | Portfolio projects (categories, tech, links) |
| `testimonials.ts` | Quotes |
| `resume.ts` | Aggregates the above for the resume page |

Edit a file, save, and the UI updates — no component changes required.

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel.
2. Vercel auto-detects the framework. Build command `pnpm build`, output `.output/public`.
3. Add optional env vars (`DATABASE_URL`, `RESEND_API_KEY`, …).
4. Deploy. The site is SSR'd with route-level code splitting; the 3D scene, Mermaid, Shiki, and giscus load lazily.

## Project Structure

```
content/blog/          MDX posts (one file = one post)
content-collections.config.ts
prisma/                Schema + migrations
public/                robots.txt, og.png
src/
  components/
    animations/        Reveal, MagneticButton, TiltCard, Counter, TextReveal
    blog/              MDX renderer, code blocks, TOC, share, giscus…
    contact/           Contact form + info
    home/              Hero, sections, marquee
    layout/            Header, footer, command palette, theme, lenis…
    projects/          Project card + filters
    resume/            Resume sections
    three/             Lazy 3D scene
    ui/                shadcn/ui primitives
  data/                All editable site content
  lib/                 cn util, constants, schemas, seo helpers
  routes/              File-based routes (incl. sitemap.xml, rss.xml)
  server/              Server functions (blog, contact, analytics, db)
  stores/              Theme + command palette stores
  styles/globals.css   Design tokens, prose, print styles
  types/               Shared TypeScript types
```

## Production Hardening Notes

Before going public, consider:

- **Comments:** set real GitHub repo / category IDs in `src/lib/constants.ts` (`GISCUS_*`) so giscus threads work.
- **Resume PDF:** point `siteConfig.resumePdfUrl` at a hosted PDF (the page falls back to Print / Save as PDF).
- **Contact spam:** add a rate limiter or honeypot in front of `submitContact`, and enable TanStack Start's CSRF middleware if you deploy to a separate origin.
- **OG image:** replace `public/og.png` (currently a generated placeholder) with a designed 1200×630 asset.

## Accessibility & Motion

- Semantic HTML, skip-to-content link, focus rings, ARIA labels throughout.
- `prefers-reduced-motion` disables the 3D scene, Lenis smooth-scroll, heavy reveals, marquee animation, and giscus.
- Light/dark/system theming persisted to `localStorage`.

## License

Private — all rights reserved.
