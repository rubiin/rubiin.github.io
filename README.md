# Rubin Bhandari — Portfolio, Interactive Resume & MDX Blog

A production-ready personal website built on the **TanStack ecosystem**: TanStack Start (SSR + server functions), TanStack Router (file-based routing, search params), TanStack Query, TanStack Form, and TanStack Store — with UnoCSS (wind4 preset, a drop-in Tailwind v4 replacement), shadcn/ui, Motion, and a lazy-loaded React Three Fiber 3D scene on the home page.

![Stack](https://img.shields.io/badge/TanStack-Start%20%7C%20Router%20%7C%20Query%20%7C%20Form%20%7C%20Store-ff4154)

---

## Overview

| Area | Highlights |
| --- | --- |
| **Home** | Full-viewport hero with lazy 3D workspace scene (R3F), animated gradient blobs, marquee, stats counters, mouse parallax |
| **Sections** | About, interactive skills (tabs + orbit constellation + tooltips), experience timeline (scroll-grown line, accordions), featured projects, contact CTA |
| **Projects** | `/projects` — search-param driven category pills + debounced search, responsive grid, empty state |
| **Blog** | `/blog` + `/blog/:slug` — MDX via content-collections, Shiki code blocks, KaTeX math, Mermaid diagrams, TOC, share buttons, related posts, giscus comments |
| **Resume** | Downloadable PDF (`/resume.pdf`) via header/hero/terminal links |
| **Contact** | `/contact` — TanStack Form + shared Zod schema, server-side submit with graceful email fallback |
| **Extras** | ⌘K command palette, light/dark/system theme, smooth scrolling (Lenis), scroll progress, custom 404 + error pages, RSS, sitemap, robots.txt, JSON-LD |

## Tech Stack

- **Framework:** TanStack Start 1.168, React 19.2, TypeScript 6 (strict)
- **Data & routing:** TanStack Router 1.170, TanStack Query 5, TanStack Form 1.33, TanStack Store
- **Styling:** UnoCSS (preset-wind4 — 1:1 with the former Tailwind CSS v4, see `compare.md`), shadcn/ui, CSS-variable design tokens
- **Motion & 3D:** Motion 12, Lenis, Three.js 0.185 + @react-three/fiber + drei (lazy-loaded)
- **Content:** content-collections + @content-collections/mdx, Shiki, KaTeX, Mermaid
- **Backend:** Resend (optional) for contact-form email

> **Note on Radix imports:** UI primitives are imported exclusively from the `radix-ui` monolith (e.g. `import { Slot } from 'radix-ui'`), not from individual `@radix-ui/react-*` packages — those are transitive deps and not listed in `package.json`. Keep it that way when adding components.

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
| `pnpm test:snapshots` | Build + compare visual snapshots against the Tailwind v4 baseline goldens |
| `pnpm test:snapshots:baseline` | Regenerate baseline goldens from the Tailwind v4 build (`HEAD`) |

## Visual Snapshot Testing

A Playwright suite guards against visual regressions by comparing the rendered site, **pixel-for-pixel**, against goldens captured from the previous Tailwind CSS v4 build. This is how the UnoCSS migration was verified as visually 1:1 (see `compare.md` for the full audit).

```bash
pnpm test:snapshots              # build + run the suite (22 tests)
```

- **What it covers** — 22 tests: 6 pages (home, blog, blog post, projects, contact, terminal) × light/dark (terminal is dark-only) × desktop (1280×800) and mobile (390×844) viewports, so responsive breakpoints and the mobile nav are guarded too.
- **Determinism** — third-party requests (Google Fonts, analytics, …) are aborted so both builds render with identical fallback fonts; animations/transitions are frozen; reduced motion and the theme are forced per test; the GPU-dependent 3D hero canvas is masked with a flat theme background.
- **Failure** — any pixel drift above the per-test threshold fails the test, and CI (`snapshots` job) uploads a Playwright report with the expected/actual/diff images.

### Regenerating the goldens

Goldens live in `tests/e2e/__screenshots__/visual.spec.ts/` and were originally captured from the Tailwind v4 baseline (`8b4b624`) via `scripts/snapshot-baseline.mjs HEAD`. They were since regenerated from the UnoCSS build after the WebP image conversion (see below); `tests/snapshots/baseline.json` records the current provenance (UnoCSS build + original Tailwind commit). Regenerate them only when the baseline intentionally changes (e.g. a deliberate redesign):

```bash
pnpm test:snapshots:baseline     # builds HEAD in a temp worktree, serves it on :3199, captures goldens
pnpm exec playwright test --update-snapshots=all   # or: regenerate in place against the current build
```

> **Note:** `--update-snapshots` (default mode) only rewrites *missing or failing* snapshots —
> use `--update-snapshots=all` to bake in an intentional visual change (e.g. the image-format
> conversion), since the old goldens may still pass within the pixel threshold.

## Environment Variables

Copy `.env.example` to `.env`. All are optional — the app runs without them.

| Variable | Purpose | Required |
| --- | --- | --- |
| `RESEND_API_KEY` | Send contact-form emails via Resend | No |
| `RESEND_FROM_EMAIL` | From-address for emails | No |
| `CONTACT_TO_EMAIL` | Where contact messages are delivered | No |

Without `RESEND_API_KEY`, no email is sent — the contact form still succeeds. Nothing crashes.

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
| `projects.ts` | Portfolio projects (categories, tech, links) |
| `testimonials.ts` | Quotes |

Edit a file, save, and the UI updates — no component changes required.

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel.
2. Vercel auto-detects the framework. Build command `pnpm build`, output `.output/public`.
3. Add optional env vars (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`).
4. Deploy. The site is SSR'd with route-level code splitting; the 3D scene, Mermaid, Shiki, and giscus load lazily.

## Project Structure

```
content/blog/          MDX posts (one file = one post)
content-collections.config.ts
public/                robots.txt, og.png, projects/*.webp, blog/**/*.webp (all imagery is WebP — converted from PNG/JPG, see `compare.md`)
scripts/               content build, smoke test, snapshot-baseline helpers
tests/e2e/             Playwright visual snapshot suite + Tailwind v4 goldens
src/
  components/
    animations/        Reveal, MagneticButton, TiltCard, Counter, TextReveal
    blog/              MDX renderer, code blocks, TOC, share, giscus…
    contact/           Contact form + info
    home/              Hero, sections, marquee
    layout/            Header, footer, command palette, theme, lenis…
    projects/          Project card + filters
    three/             Lazy 3D scene
    ui/                shadcn/ui primitives
  data/                All editable site content
  lib/                 cn util, constants, schemas, seo helpers
  routes/              File-based routes (incl. sitemap.xml, rss.xml)
  server/              Server functions (blog, contact, email)
  stores/              Theme + command palette stores
  styles/globals.css   Design tokens, prose, print styles
  types/               Shared TypeScript types
```

## Production Hardening Notes

Before going public, consider:

- **Comments:** set real GitHub repo / category IDs in `src/lib/constants.ts` (`GISCUS_*`) so giscus threads work.
- **Resume PDF:** replace `public/resume.pdf` (or point `siteConfig.resumePdfUrl` at a hosted PDF).
- **Contact spam:** add a rate limiter or honeypot in front of `submitContact`, and enable TanStack Start's CSRF middleware if you deploy to a separate origin.
- **OG image:** replace `public/og.png` (currently a generated placeholder) with a designed 1200×630 asset.

## Accessibility & Motion

- Semantic HTML, skip-to-content link, focus rings, ARIA labels throughout.
- `prefers-reduced-motion` disables the 3D scene, Lenis smooth-scroll, heavy reveals, marquee animation, and giscus.
- Light/dark/system theming persisted to `localStorage`.

## License

Private — all rights reserved.
