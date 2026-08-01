# Portfolio / Interactive Resume / MDX Blog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, premium (Awwwards-grade) personal portfolio, interactive resume, and MDX-powered blog using the TanStack ecosystem (Start + Router + Query + Form + Store), Tailwind v4, shadcn/ui, Motion, and React Three Fiber — deployable to Vercel with zero config.

**Architecture:** TanStack Start (file-based routing, server functions, route loaders) serves an `src/` app. Content is data-driven: structured TS data files in `src/data/` for resume/skills/experience/projects/socials/nav/SEO, and MDX files in `content/blog/` compiled by content-collections. A server layer (`src/server/`) exposes blog reads and writes (contact/newsletter/analytics) via `createServerFn`, backed by Prisma 7 + PostgreSQL with **graceful fallback** (app runs without DB/Resend creds). UI is shadcn/ui components on a Tailwind v4 CSS-variable design system with light/dark/system theming. Heavy 3D is lazy-loaded on the home page only.

**Tech Stack:** @tanstack/react-start 1.168.x, @tanstack/react-router 1.170.x, react-query 5.x, react-form 1.33.x + @tanstack/zod-form-adapter, @tanstack/react-store 0.11.x, React 19.2, TypeScript ~5.9, Tailwind CSS 4.3.x, shadcn/ui, Motion 12.x, Lenis, three 0.185.x + @react-three/fiber 9.x + drei 10.x, content-collections 0.2.x + @content-collections/mdx, Shiki 4.x, KaTeX, Mermaid, Prisma 7 + @prisma/adapter-pg, Resend, Zod 4, Lucide, Sonner.

---

## Global Constraints

Bind every task unless a task explicitly overrides.

1. **Stack versions (exact floors):** TanStack Start ≥1.168.34, Router ≥1.170.18, Query ≥5.101.4, Form ≥1.33.3, Store ≥0.11.0, Tailwind ≥4.3.3, React 19.2.x, TypeScript **~5.9.x pinned (do NOT use 7.x — the Go compiler breaks tooling)**, Prisma 7.9.x, Zod 4.4.x. Install with **pnpm** only.
2. **Package manager is pnpm.** All installs/scripts run via `pnpm`/`pnpm dlx`. Never use npm install.
3. **No `any`.** Strict TypeScript everywhere (`strict: true`). `unknown` + narrowing or Zod inference instead.
4. **Path alias:** `@/*` → `src/*` in both tsconfig and Vite (via vite-tsconfig-paths). All imports use `@/` unless relative is within the same folder's siblings.
5. **Design tokens:** All colors/radii/spacing live as CSS variables in `src/styles/globals.css` under `@theme` + `:root`/`.dark`. Never hardcode hex/rgb in components — use tokens like `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`.
6. **Components:** Reuse shadcn/ui primitives in `src/components/ui/`. Variants via CVA. Merge classes with `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge). No duplicated component logic.
7. **Icons:** lucide-react only. Never add a second icon library.
8. **Theming:** Light/Dark/System toggle, persisted to `localStorage` (`theme` key), default system. Respect `prefers-reduced-motion`: disable scroll-smoothing, particle/3D motion, and heavy reveals when reduced motion is on.
9. **Accessibility:** Semantic HTML, skip-to-content link, keyboard nav for all interactive components, visible focus rings, proper ARIA labels, `lang="en"`, alt text on images. Focus management on dialogs/sheets.
10. **SEO:** Every page sets title + description via route `head()`. Root sets OG/Twitter/JSON-LD. `/sitemap.xml`, `/rss.xml`, `public/robots.txt` present and correct.
11. **Forms:** Client + server validation (same Zod schemas), loading/success/error states, use TanStack Form.
12. **Performance:** Route-level code splitting is automatic (TanStack). Lazy-load the 3D scene, mermaid, katex css, and giscus with `lazy()`/dynamic import. No Three.js on non-home pages.
13. **Data-driven:** Resume/skills/experience/projects/socials/nav/testimonials/education/certifications/SEO editable in `src/data/*.ts` without touching app logic. Blog posts = adding one `.mdx` to `content/blog/` — no routing or registration changes.
14. **Backend graceful fallback:** All DB/email code paths must work when `DATABASE_URL` and/or `RESEND_API_KEY` are absent — return mock/empty data and log, never crash the request. The contact form still "succeeds" (records nothing) without creds.
15. **No placeholders:** no TBDs, no TODO comments left in shipped code.
16. **Commit discipline:** implementers commit per logical step with conventional messages (`feat:`, `fix:`, `chore:`, `docs:`).

---

### Task 1: Scaffold TanStack Start project with pnpm + full dependency set

**Files:**
- Create: `package.json`, `tsconfig.json`, `app.config.ts`, `vite.config.ts`, `src/client.tsx`, `src/ssr.tsx`, `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/styles/globals.css`, `.env.example`, `.npmrc`
- Modify: `.gitignore` (ensure `.content-collections/`, `dist`, `.output` ignored)

**Interfaces:**
- Produces: `src/router.tsx` exporting `createRouter()`, `src/client.tsx` (hydrate root), `src/ssr.tsx` (default export handler), route tree generation via `@tanstack/router-plugin`. `src/routes/__root.tsx` renders `<RootDocument>` with `<Outlet />`. `pnpm dev` boots at :3000.

- [ ] **Step 1: Write package.json with exact deps**

Run `pnpm init` in `/home/devina/portfolio`, then edit `package.json` to contain exactly these deps (versions are floors; use `^`):

```jsonc
{
  "name": "portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "content:build": "content-collections build"
  },
  "dependencies": {
    "@content-collections/mdx": "^0.2.2",
    "@prisma/adapter-pg": "^7.9.1",
    "@prisma/client": "^7.9.1",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-drawer": "^2.2.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-hover-card": "^1.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "@tanstack/react-form": "^1.33.3",
    "@tanstack/react-query": "^5.101.4",
    "@tanstack/react-router": "^1.170.18",
    "@tanstack/react-start": "^1.168.34",
    "@tanstack/react-store": "^0.11.0",
    "@tanstack/zod-form-adapter": "^1.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "content-collections": "^0.2.1",
    "giscus": "^1.6.0",
    "katex": "^0.18.1",
    "lenis": "^1.3.25",
    "lucide-react": "^1.28.0",
    "mermaid": "^11.16.0",
    "motion": "^12.43.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "resend": "^6.18.1",
    "sonner": "^2.0.0",
    "tailwind-merge": "^3.6.0",
    "three": "^0.185.1",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@content-collections/vite": "^0.2.1",
    "@tailwindcss/vite": "^4.3.3",
    "@tanstack/react-start-plugin": "^1.168.0",
    "@tanstack/router-plugin": "^1.168.23",
    "@types/node": "^24.0.0",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@types/three": "^0.185.0",
    "@vitejs/plugin-react": "^5.0.0",
    "dotenv": "^17.0.0",
    "prisma": "^7.9.1",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.19.0",
    "typescript": "~5.9.3",
    "vite": "^7.0.0",
    "vite-tsconfig-paths": "^5.1.0"
  },
  "engines": { "node": ">=20.19" }
}
```

> Note: keep the list minimal — if `pnpm install` complains about a missing optional peer, add it.

- [ ] **Step 2: Install and pin**

```bash
pnpm install
git add package.json pnpm-lock.yaml && git commit -m "chore: scaffold package.json with full dependency set"
```

- [ ] **Step 3: Write tsconfig.json**

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "moduleDetection": "force",
    "noEmit": true,
    "paths": { "@/*": ["./src/*"] },
    "types": ["vite/client", "node"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "app.config.ts", "vite.config.ts", "content-collections.config.ts"]
}
```

- [ ] **Step 4: Write vite.config.ts + app.config.ts**

`vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start-plugin/vite'
import { contentCollections } from '@content-collections/vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    tsconfigPaths(),
    tailwindcss(),
    contentCollections(),
  ],
})
```

`app.config.ts` (TanStack Start server config; keep minimal):
```ts
import { defineConfig } from '@tanstack/react-start/config'
export default defineConfig({})
```

If the TanStack Start 1.168 plugin is NOT exported from `@tanstack/react-start-plugin/vite`, check installed package exports and use the correct entry (e.g. `@tanstack/react-start/plugin/vite`); pick whichever the installed version documents.

- [ ] **Step 5: Entry files**

`src/client.tsx`:
```tsx
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import { createRouter } from './router'

const router = createRouter()
hydrateRoot(document, <StartClient router={router} />)
```

`src/ssr.tsx`:
```tsx
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { getRouterManifest } from '@tanstack/react-start/router-manifest'
import { createRouter } from './router'

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler)
```

`src/router.tsx`:
```tsx
import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const router = createTanstackRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPendingMinMs: 300,
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

- [ ] **Step 6: Root route + minimal index + globals.css**

`src/routes/__root.tsx`:
```tsx
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import '../styles/globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Devina — Creative Developer' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

`src/routes/index.tsx`:
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return <main className="p-8"><h1 className="text-3xl font-bold">Portfolio scaffold works</h1></main>
}
```

`src/styles/globals.css` (minimal for Task 1; expanded in Task 2):
```css
@import "tailwindcss";
```

- [ ] **Step 7: Verify dev server boots**

```bash
pnpm dev &
sleep 20
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```
Expect 200 and page contains "Portfolio scaffold works". Kill the server. Also run `pnpm typecheck` — must pass.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: scaffold tanstack start app"
```

---

### Task 2: Design system — tokens, cn util, CVA, theme store + provider, base shadcn/ui components

**Files:**
- Create: `src/lib/utils.ts`, `src/lib/cva.ts` (if needed), `src/stores/theme-store.ts`, `src/hooks/use-theme.ts`, `src/components/layout/theme-provider.tsx` (client component), `src/components/layout/theme-toggle.tsx`, `src/components/ui/*` (shadcn base set: button, badge, card, input, label, separator, skeleton, avatar, tooltip, dropdown-menu, sheet, dialog, sonner, scroll-area, tabs, accordion, switch, checkbox, radio-group, select, popover, hover-card, navigation-menu, progress, alert, breadcrumb, pagination, carousel, command, calendar, textarea, drawer, table)
- Modify: `src/styles/globals.css` (full token set), `src/routes/__root.tsx` (apply theme class + providers)

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string`; `useTheme()` returning `{ theme: 'light'|'dark'|'system', setTheme(t) }`; `<ThemeProvider>` wrapping children; `src/components/ui/` full shadcn set importable as `@/components/ui/<name>`. CSS classes `dark` on `<html>` when dark.

- [ ] **Step 1: cn util**

`src/lib/utils.ts`:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Full globals.css with design tokens**

Use the shadcn "neutral" palette (hsl triplets), zinc-based, with `--radius: 0.75rem`. Define tokens: `--background, --foreground, --card, --card-foreground, --popover, --popover-foreground, --primary, --primary-foreground, --secondary, --secondary-foreground, --muted, --muted-foreground, --accent, --accent-foreground, --destructive, --destructive-foreground, --border, --input, --ring, --chart-1..5, --radius, --sidebar-*`. Map in `@theme inline` so `bg-background` etc. work. Also add:
- `.dark` variant under `@custom-variant dark (&:is(.dark *));`
- font tokens: `--font-sans: 'Inter', ui-sans-serif...` and import Inter from Google Fonts via `@import url(...)` (with `display=swap`) OR fall back to system stack if offline — pick system-safe stack: `ui-sans-serif, system-ui, ...` plus load Inter via `<link>` in `__root.tsx` head.
- a `.prose` base style for blog (typography): since we won't add @tailwindcss/typography plugin, hand-roll `.prose` styles in globals.css for h1–h4, p, ul/ol, blockquote, code, pre, table, a, img, hr (used in Task 10).
- reduced-motion: `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important } }`

- [ ] **Step 3: Theme store + provider + toggle**

`src/stores/theme-store.ts` (TanStack Store):
```ts
import { Store } from '@tanstack/react-store'

export type Theme = 'light' | 'dark' | 'system'
export const themeStore = new Store<Theme>(
  typeof document !== 'undefined'
    ? (localStorage.getItem('theme') as Theme | null) ?? 'system'
    : 'system',
)
export const setTheme = (t: Theme) => {
  themeStore.setState(() => t)
  if (typeof document !== 'undefined') localStorage.setItem('theme', t)
  applyTheme(t)
}
export function applyTheme(t: Theme) {
  const root = document.documentElement
  const resolved = t === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}
```

`src/hooks/use-theme.ts`:
```ts
import { useStore } from '@tanstack/react-store'
import { themeStore, setTheme, type Theme } from '@/stores/theme-store'

export function useTheme() {
  const theme = useStore(themeStore)
  return { theme, setTheme }
}
```

`src/components/layout/theme-provider.tsx`: client-only component that on mount calls `applyTheme(themeStore.state)` and subscribes to `matchMedia` changes when theme==='system'. Renders children.

`src/components/layout/theme-toggle.tsx`: dropdown-menu with three options (Light/Dark/System), lucide icons `Sun`, `Moon`, `Monitor`, aria-label "Toggle theme".

- [ ] **Step 4: Add shadcn/ui components**

Use the shadcn CLI (Tailwind v4 aware):
```bash
pnpm dlx shadcn@latest init -y -b neutral --css src/styles/globals.css
pnpm dlx shadcn@latest add -y button card badge input label separator skeleton avatar tooltip dropdown-menu sheet dialog sonner scroll-area tabs accordion switch checkbox radio-group select popover hover-card navigation-menu progress alert breadcrumb pagination carousel command calendar textarea drawer table
```
If CLI init fails in this environment, hand-write the components (button, card, badge, input, label, separator, skeleton, avatar, tooltip, dropdown-menu, sheet, dialog, sonner, scroll-area, tabs, accordion, switch, checkbox, radio-group, select, popover, hover-card, navigation-menu, progress, alert, breadcrumb, pagination, carousel, command, calendar, textarea, drawer, table) following the canonical shadcn sources adapted to this project's aliases (`@/components/ui`, `@/lib/utils`). Ensure every component uses the token classes from Step 2 (no raw hex).

- [ ] **Step 5: Wire theme provider into root**

Update `src/routes/__root.tsx`: render `<ThemeProvider>` inside body (client-only mount guard), wrap `<Outlet />`, and append Inter font `<link>` (or rely on system stack). Verify dark mode toggling works by checking `document.documentElement.classList`.

- [ ] **Step 6: Verify + commit**

```bash
pnpm typecheck
pnpm dev &  (curl home, expect 200) ; kill
git add -A && git commit -m "feat: design system tokens, theme store, shadcn ui components"
```

---

### Task 3: Content data layer — structured data files

**Files:**
- Create: `src/types/index.ts`, `src/data/site.ts`, `src/data/nav.ts`, `src/data/profile.ts`, `src/data/skills.ts`, `src/data/experience.ts`, `src/data/education.ts`, `src/data/certifications.ts`, `src/data/awards.ts`, `src/data/projects.ts`, `src/data/testimonials.ts`, `src/data/resume.ts` (aggregator), `src/lib/constants.ts`

**Interfaces:**
- Produces exact named exports (later tasks consume these — names are contract):
  - `siteConfig: SiteConfig` from `@/data/site` — `{ name, firstName, role, tagline, bio, email, location, url, availability, resumePdfUrl, socials: { github, linkedin, twitter, rss, email }, seo: { title, description, ogImage, keywords[] } }`
  - `navItems: NavItem[]` from `@/data/nav` — `{ label, href, description? }[]` (about, experience/skills, projects, blog, resume, contact)
  - `profile: Profile` from `@/data/profile` — `{ name, role, bio, shortBio, highlights[], interests[], philosophy, careerHighlights[] }`
  - `skillCategories: SkillCategory[]` from `@/data/skills` — `{ name, icon (lucide name string), skills: Skill[] }`, `Skill = { name, level (0-100), years, technologies[]?, relatedProjects[] (slugs), color? }`
  - `experience: ExperienceItem[]` from `@/data/experience` — `{ company, role, start, end?, current?, description, achievements[], technologies[] }`
  - `education: EducationItem[]` from `@/data/education` — `{ school, degree, field, start, end, notes? }`
  - `certifications: Certification[]` from `@/data/certifications` — `{ name, issuer, year, url?, credentialId? }`
  - `awards: Award[]` from `@/data/awards` — `{ name, issuer, year, description }`
  - `projects: Project[]` from `@/data/projects` — `{ slug, title, tagline, description, category: ProjectCategory, year, tech[], image?, video?, github?, demo?, featured?, architecture?, challenges[], lessons[] }`
  - `ProjectCategory = 'frontend' | 'backend' | 'ai' | 'devops' | 'mobile' | 'full-stack'`
  - `testimonials: Testimonial[]` from `@/data/testimonials` — `{ quote, author, role, company, avatar? }`
  - `resumeData` from `@/data/resume` aggregating experience/education/certifications/awards/skills.
  - Types from `@/types` exported as `SiteConfig, NavItem, Profile, Skill, SkillCategory, ExperienceItem, EducationItem, Certification, Award, Project, ProjectCategory, Testimonial, ResumeData`.

- [ ] **Step 1: Types** — define all interfaces in `src/types/index.ts` with exact fields above (all required except where `?` shown). `Project.image` is a path under `/projects/<slug>/` and a poster `imageFallback` optional; keep simple: `image?: string` URL or path.

- [ ] **Step 2: Data files** — author realistic placeholder content for a creative developer persona named **Devina** (folder owner): senior creative developer / full-stack engineer, 8+ years, loves TypeScript, Three.js, design systems. 6 experience items, 12 skills across 5 categories, 6 education/cert entries, 3 awards, 6 projects covering all six categories (slugs: `aurora-ai`, `pixel-forge`, `neural-scape`, `shipyard`, `motion-lab`, `atlas-docs`), 3 testimonials. All copy professional, specific, and believable — no lorem ipsum.

- [ ] **Step 3: site.ts** — URL placeholder `https://devina.dev`, socials as real-looking placeholder links (`https://github.com/devina`, etc.).

- [ ] **Step 4: Verify + commit** — `pnpm typecheck` passes. Commit `feat: content data layer`.

---

### Task 4: Blog content system — content-collections + MDX pipeline

**Files:**
- Create: `content-collections.config.ts`, `content/blog/*.mdx` (6 posts), `scripts/blog-utils.ts` (or `src/server/blog-utils.ts`), `src/components/blog/mdx-components.tsx`, `src/components/blog/code-block.tsx` (client), `src/components/blog/mermaid.tsx` (client), `.content-collections/generated` (generated, gitignored)
- Modify: `src/styles/globals.css` (katex css import), `vite.config.ts` (already has plugin from Task 1)

**Interfaces:**
- Produces: `allPosts` from `@/../.content-collections/generated` (typed collection). Post doc: `{ slug, title, date, description, tags: string[], category: string, featured: boolean, draft: boolean, coverImage?, readingTime: number, toc: TocItem[], mdx }`. `TocItem = { id, text, level }`. `MDXContent` component + `components` map (`mdx-components.tsx`) with `a, h1..h4, pre, code, img, blockquote, table, ul, ol, li, hr, p, strong, em` + `Mermaid` + `CodeBlock`. `CodeBlock` (client) renders shiki output with copy button. `Mermaid` (client) renders diagram from chart string via `mermaid.render`.

- [ ] **Step 1: Install MDX toolchain** (do NOT re-add `@content-collections/mdx` — already in package.json)

```bash
pnpm add -D shiki rehype-slug rehype-katex remark-math unified unist-util-visit @types/mdast reading-time
```

- [ ] **Step 2: content-collections.config.ts**

```ts
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import { remarkMermaid } from './scripts/remark-mermaid'

export const posts = defineCollection({
  name: 'posts',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('engineering'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkMath, remarkMermaid],
      rehypePlugins: [rehypeKatex, rehypeSlug],
    })
    return {
      ...document,
      mdx,
      readingTime: Math.max(1, Math.round(document.content.split(/\s+/).length / 200)),
      toc: extractToc(document.content),
    }
  },
})

export default defineConfig({ collections: [posts] })
```

- [ ] **Step 3: remark-mermaid + toc extraction**

`scripts/remark-mermaid.ts` — transforms fenced ```mermaid blocks into `<Mermaid chart="...">` JSX elements (visit `code` nodes, lang==='mermaid', splice in `mdxJsxFlowElement` with a single `chart` attribute).

`src/server/blog-utils.ts` — `extractToc(markdown: string): TocItem[]` parses `^#{2,3} ` headings, computes `id` via GitHub-slugger semantics (lowercase, spaces→dashes, strip punctuation), returns `{id, text, level}`. (rehype-slug uses the same algorithm so anchors match.)

- [ ] **Step 4: Six sample posts**

`content/blog/` — write 6 substantive MDX posts (800+ words each): one featured with `featured: true`. Cover distinct topics demonstrating the toolchain: one with ` ```mermaid ` (architecture diagram), one with LaTeX math (`$$...$$`), one with multiple code blocks (shiki), one long-form engineering essay, one tools/design post, one career post. Real frontmatter per schema. No lorem ipsum.

- [ ] **Step 5: MDX components**

`src/components/blog/mdx-components.tsx` — a shared `components` record passed to `MDXContent`. `code` inline styled; `pre` wraps children in `<CodeBlock>` (client). Provide `Mermaid` from client file. Links target `_blank` for external with rel. Headings have `scroll-mt-28` for anchor offset.

`src/components/blog/code-block.tsx` — client component: receives `code` string + `lang` via context/props; uses Shiki (`codeToHtml` with `github-dark` theme) via `useEffect` + `useState`, renders copy-to-clipboard button (lucide `Copy`/`Check`), a small header with lang label. Graceful fallback to `<pre>` if shiki fails.

`src/components/blog/mermaid.tsx` — client: `useEffect` imports `mermaid`, calls `mermaid.render`, injects svg; loading placeholder "Rendering diagram…"; respects reduced motion (static render fine).

- [ ] **Step 6: Verify**

Add the generated-path alias to `tsconfig.json` paths and to `vite.config.ts` (via `resolve.alias` if vite-tsconfig-paths doesn't pick up `content-collections`):
```jsonc
"paths": { "@/*": ["./src/*"], "content-collections": ["./.content-collections/generated"] }
```

```bash
pnpm content:build   # generates .content-collections/generated
pnpm typecheck
```
Then add `katex/dist/katex.min.css` import to globals.css (`@import "katex/dist/katex.min.css";` at top) — verify no build error. Commit `feat: mdx blog content system`.

---

### Task 5: Server layer — blog reads + contact/newsletter/analytics + Prisma 7 graceful

**Files:**
- Create: `prisma/schema.prisma`, `prisma.config.ts`, `src/server/db.ts`, `src/server/blog.ts`, `src/server/contact.ts`, `src/server/newsletter.ts`, `src/server/analytics.ts`, `src/server/email.ts`, `src/lib/schemas.ts`, `scripts/seed.ts`, `.env.example` (DATABASE_URL, RESEND_API_KEY, PUBLIC_*)
- Modify: `package.json` (seed script), `.gitignore` (generated prisma client dir)

**Interfaces:**
- Produces server functions (all `createServerFn`):
  - `getPosts(): Promise<PostSummary[]>` — non-draft, sorted date desc: `{ slug, title, date, description, tags, category, featured, coverImage, readingTime }`
  - `getPost(slug: string): Promise<Post | null>` — full doc incl. mdx
  - `getPostsByTag(tag): Promise<PostSummary[]>`; `getPostTags(): Promise<{tag, count}[]>`; `getPostCategories(): Promise<{category, count}[]>`; `getRelatedPosts(slug, n=3): Promise<PostSummary[]>`
  - `submitContact(input: ContactInput): Promise<{ ok: true } | { ok: false; error: string }>` — server-validates with zod; if `DATABASE_URL` set → persist to `ContactSubmission`; if `RESEND_API_KEY` set → send email to site owner; always returns ok when valid (graceful).
  - `subscribeNewsletter(email): Promise<{ ok: true } | { ok: false; error }>` — upsert `NewsletterSubscriber` when DB present; mock-ok otherwise.
  - `recordProjectView(slug): Promise<void>` — upsert `ProjectAnalytics` count; no-op without DB.
  - `getVisitorCount(): Promise<number>` — from `VisitorMetric` or mock.
- `src/lib/schemas.ts` exports Zod schemas `contactSchema`, `newsletterSchema` (used by both client forms and server).
- Prisma models: `ContactSubmission { id, name, email, subject, message, createdAt }`, `NewsletterSubscriber { id, email unique, createdAt }`, `ProjectAnalytics { id, slug unique, views Int }`, `VisitorMetric { id, date unique, count Int }`, optional `PostView`.

- [ ] **Step 1: Prisma 7 schema + config**

`prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model ContactSubmission { id String @id @default(cuid()) name String email String subject String? message String createdAt DateTime @default(now()) }
model NewsletterSubscriber { id String @id @default(cuid()) email String @unique createdAt DateTime @default(now()) }
model ProjectAnalytics { id String @id @default(cuid()) slug String @unique views Int @default(0) }
model VisitorMetric { id String @id @default(cuid()) date DateTime @unique @db.Date count Int @default(0) }
```

`prisma.config.ts`:
```ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
})
```
`.env.example` documents `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`. If `DATABASE_URL` unset, `pnpm db:generate` still works (generate doesn't need URL) but `db:migrate` will fail — that's expected/documented.

- [ ] **Step 2: Graceful db client**

`src/server/db.ts` (ESM-safe — `require` is NOT available in this `"type": "module"` project):
```ts
// Lazy singleton that returns null when DATABASE_URL is absent, so the app
// runs without a database. The generated client is imported statically (the
// module always exists post-generate); only *construction* is guarded.
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient }

export function getPrisma(): PrismaClient | null {
  const url = process.env.DATABASE_URL
  if (!url) return null
  if (globalForPrisma.__prisma) return globalForPrisma.__prisma
  const adapter = new PrismaPg({ connectionString: url })
  globalForPrisma.__prisma = new PrismaClient({ adapter })
  return globalForPrisma.__prisma
}
```
(If the generated client's export shape differs — e.g. named `PrismaClient` only — adjust the import accordingly. Keep the lazy-singleton pattern.)

- [ ] **Step 3: Blog server functions**

`src/server/blog.ts` — `getPosts`, `getPost`, `getPostsByTag`, `getPostTags`, `getPostCategories`, `getRelatedPosts` using `import { allPosts } from 'content-collections'` (resolves via the Task 4 alias to `.content-collections/generated`). Verify the generated file's export name after Task 4 runs; if it differs (e.g. `posts`), adjust the import. Tag/category counts computed by reduce. Related = same category first, then shared tags, then newest, capped n, excluding self.

- [ ] **Step 4: Contact + newsletter + analytics**

Per interfaces above. `submitContact` validators: `zodValidator` (or `.validator((d) => contactSchema.parse(d))`). Email via `src/server/email.ts` — lazy `new Resend(process.env.RESEND_API_KEY)`; `sendContactEmail` builds a simple HTML string (no external template). Guard all Resend/Prisma calls behind env checks; never throw on missing creds.

- [ ] **Step 5: Seed script** — `scripts/seed.ts` inserts 3 sample `ContactSubmission`? No — instead seed one `NewsletterSubscriber` and a `VisitorMetric` row ONLY if DB present (documented: `pnpm db:seed` requires DATABASE_URL).

- [ ] **Step 6: Verify**

```bash
pnpm db:generate        # must succeed without DATABASE_URL
pnpm typecheck
pnpm content:build && pnpm typecheck
```
Commit `feat: server layer with prisma graceful fallback`.

---

### Task 6: Global layout — nav, footer, scroll progress, command palette, mobile sheet

**Files:**
- Create: `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`, `src/components/layout/mobile-nav.tsx`, `src/components/layout/scroll-progress.tsx`, `src/components/layout/command-palette.tsx`, `src/components/layout/skip-link.tsx`, `src/components/layout/lenis-provider.tsx`, `src/hooks/use-lenis.ts`, `src/stores/command-store.ts`, `src/hooks/use-command.ts`
- Modify: `src/routes/__root.tsx` (global layout shell), `src/routes/index.tsx` (keep placeholder until Task 7)

**Interfaces:**
- Produces: `<SiteHeader />` (sticky, glass, scroll-aware — hides/shrinks on scroll down, elevation on scroll), `<SiteFooter />`, `<MobileNav />` (sheet from right), `<ScrollProgress />` (top progress bar from scroll %, motion-driven), `<CommandPalette />` (⌘K dialog: nav + pages + blog posts + projects, keyboard navigable, fuzzy filter), `<SkipLink />`, `<LenisProvider />` (smooth scroll; disabled on reduced motion / touch). Global store `commandStore` (open boolean) + `useCommand()` hook binding ⌘K/Ctrl+K.
- All layout components used in `__root.tsx` shell with `<Outlet />` between header and footer.

- [ ] **Step 1: Lenis provider** — client component: `new Lenis({ lerp: 0.1, autoRaf: true })`, destroy on unmount; skip when `prefers-reduced-motion` or viewport is touch. Export `useLenis()` returning instance or null.

- [ ] **Step 2: Header** — sticky top, `backdrop-blur`, translucent `bg-background/70`, border-b appears after scrollY>8 (use small `useScrollPosition` hook local to header), nav from `navItems`, active link styling via `Link` + `useLocation`. Right side: theme toggle + command trigger button (lucide `Command`), GitHub link icon. Desktop shows full nav; mobile shows hamburger → `MobileNav`.

- [ ] **Step 3: Mobile nav** — `Sheet` (right side), nav links stacked large, social links row, theme toggle inside.

- [ ] **Step 4: Scroll progress** — fixed top bar 2px, `scaleX` = scroll fraction via `useScroll` from motion, `transform-origin-left`, gradient primary→accent, `aria-hidden`.

- [ ] **Step 5: Command palette** — `CommandDialog` from shadcn `command`; triggers on ⌘K/Ctrl+K via `useCommand` (listens `keydown`, prevents default, toggles store). Content: groups "Navigation" (navItems + key pages), "Projects" (from `projects` data), "Blog" (from `getPosts()` server fn via TanStack Query `useQuery`), each item navigates via `router.navigate`. Close on select. `aria-label="Command palette"`.

- [ ] **Step 6: Footer** — 3 columns: brand+tagline, quick links (nav), socials (github/linkedin/twitter/rss/email icons) + "Built with TanStack Start, Tailwind, Motion". Bottom bar: © {year} {name}, RSS link (`/rss.xml`), sitemap link (`/sitemap.xml`).

- [ ] **Step 7: Root shell** — `__root.tsx`: `SkipLink`, `LenisProvider`, `ScrollProgress`, `SiteHeader`, `<main id="main" className="min-h-[60vh]">` `<Outlet/>`, `SiteFooter`, `CommandPalette`, `<Toaster />` (sonner). Keep `<ThemeProvider>`.
  - Add `QueryClientProvider` here too: create `src/components/layout/query-provider.tsx` (client) exporting `<QueryProvider>` with a module-level `new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } } })`, wrap it inside `ThemeProvider`. The Command Palette (Task 6 Step 5) and any future `useQuery` consumers depend on it.

- [ ] **Step 8: Verify + commit** — typecheck + dev smoke test (200, no console errors — check via curl + grep for key strings). Commit `feat: global layout shell`.

---

### Task 7: Home page — hero, 3D workspace scene, micro-interactions

**Files:**
- Create: `src/components/animations/reveal.tsx`, `src/components/animations/magnetic-button.tsx`, `src/components/animations/tilt-card.tsx`, `src/components/animations/counter.tsx`, `src/components/animations/text-reveal.tsx`, `src/components/three/hero-scene.tsx` (client, lazy), `src/components/three/workspace.tsx`, `src/components/three/particles.tsx`, `src/components/three/lighting.tsx`, `src/components/home/hero.tsx`, `src/components/home/marquee.tsx`, `src/components/home/section-heading.tsx`
- Modify: `src/routes/index.tsx` (hero + intro sections; other sections wired in Task 8)

**Interfaces:**
- Produces: `<Reveal>` (scroll-triggered fade+translate via motion `whileInView`, respects reduced motion, `once`), `<MagneticButton>` (wraps children, translates toward cursor within 40px radius, springs back), `<TiltCard>` (3D tilt on pointer move, perspective), `<Counter to={n} />` (animated count-up on inView, reduced-motion → instant), `<TextReveal>` (per-line masked reveal), `<HeroScene />` (Canvas with workspace + particles + lighting; **lazy-loaded**, `display: none` when reduced motion), `<Hero />` (name, title, intro, 4 CTA buttons: Resume / Projects / Blog / Contact).
- `index.tsx` loader: `getPosts()` for latest 3 posts (for a "Latest writing" strip if desired — optional).

- [ ] **Step 1: Animation primitives** — implement the five components per interfaces. All respect `prefers-reduced-motion` (motion's `useReducedMotion`). Keep defaults subtle (translate-y-4, opacity, 500-700ms, ease `[0.22, 1, 0.36, 1]`).

- [ ] **Step 2: 3D scene (lazy)** — `hero-scene.tsx`: `lazy(() => import('...'))` at call site or export a lazy wrapper; `<Canvas camera={{ position: [0, 1.2, 6], fov: 45 }} dpr={[1, 1.5]}>` with `<Suspense>` fallback null. `workspace.tsx`: stylized floating workspace — a rounded box "monitor" + keyboard plane + floating glowing icosahedron (interactive: rotates toward pointer via `useFrame`, hover scale), soft shadows, `Float` from drei. `particles.tsx`: ~120 Points with slow drift (useFrame), `PointsMaterial` size ~0.02, color matches `--primary`. `lighting.tsx`: ambient + two point lights (primary/accent tint). Wrap whole scene in `<Suspense fallback={null}>` and `{!reducedMotion && <HeroScene />}`. Also add mouse parallax: hero container translates children by `(mouse - center) * 0.02` on `pointermove`.

- [ ] **Step 3: Hero section** — full-viewport (min-h-[92svh]), animated gradient blobs behind (blur-3xl, motion animate opacity/scale slow loop), availability badge (green pulse dot + "Available for freelance"), `TextReveal` for name (large, tracking-tight, gradient text on one word), role line with rotating word (`React Developer → TypeScript → Creative Developer` — small rotating loop), short intro, CTAs (`MagneticButton` + shadcn Button variants: primary "View Resume" with `Download` icon, outline "Projects", ghost "Blog", secondary "Contact"). Scroll indicator (animated chevron, `motion` y-loop). Stats row (`Counter`): years exp, projects shipped, blog posts, coffee? Keep classy: 3 stats.

- [ ] **Step 4: Marquee** — infinite scrolling text strip of technologies (`TypeScript • React • Node.js • Three.js • ...`) with CSS `animation` marquee, `aria-hidden`, pause on reduced motion.

- [ ] **Step 5: Wire into index route** — compose hero + marquee + a `SectionHeading`("What I do") teaser with three mini-cards (Build, Design, Ship) — full sections land in Task 8. Keep route component server-rendered with lazy client 3D.

- [ ] **Step 6: Verify + commit** — typecheck; dev smoke test; confirm 3D only mounts on `/` (grep route files for `HeroScene` usage). Commit `feat: home hero with lazy 3d scene`.

---

### Task 8: Home page sections — about, skills viz, experience timeline, featured projects, contact CTA

**Files:**
- Create: `src/components/home/about-section.tsx`, `src/components/home/skills-section.tsx`, `src/components/home/experience-section.tsx`, `src/components/home/projects-section.tsx`, `src/components/home/contact-cta.tsx`, `src/components/home/skills-orbit.tsx` (client viz)
- Modify: `src/routes/index.tsx` (compose all sections)

**Interfaces:**
- Produces: `<AboutSection />` (biography, current role, interests chips, philosophy quote card, career highlights list — cards animate in via `Reveal`), `<SkillsSection />` (interactive viz: hover a skill category → list skills with level bars; orbiting dots around a center node client-side `skills-orbit.tsx`, or a constellation grid — pick one, keep performant), `<ExperienceSection />` (vertical timeline, each item is an Accordion expanding achievements; scroll-animated line growth), `<ProjectsSection />` (featured 3 projects from data, `TiltCard` cards with image, tech badges, links), `<ContactCta />` (gradient panel, "Let's build something together", button to /contact).

- [ ] **Step 1: About section** — two-column: left bio paragraphs + interests chips (from profile); right: "Philosophy" card (blockquote) + career highlights with icons. Reveal staggered.

- [ ] **Step 2: Skills section** — tabs by category (from `skillCategories`) showing skill rows with animated `Progress` bars (animate width on inView via Counter-like hook). A decorative constellation/orbit graphic behind/right (client, ~30 dots + lines via SVG or canvas, static positions, subtle float animation; skip when reduced motion). Hovering a skill shows tooltip with years + related projects.

- [ ] **Step 3: Experience timeline** — vertical line with gradient, nodes (dot + year), Accordion per role: summary shows role @ company + dates; expanded shows description, achievements list (check icons), tech badges. Line grows on scroll (`useScroll` target → scaleY).

- [ ] **Step 4: Featured projects** — `projects.filter(featured).slice(0,3)`, `TiltCard` + image (use gradient placeholder div with lucide icon if no image), title, tagline, tech badges, GitHub/demo icon links. "View all projects" button → /projects.

- [ ] **Step 5: Contact CTA** — centered panel, gradient border card, heading "Have an idea? Let's build it.", button → /contact (MagneticButton). 

- [ ] **Step 6: Compose index route** — order: Hero, Marquee, About, Skills, Experience, Projects, ContactCta, (optional Latest Writing strip using Task 5 `getPosts` via loader).

- [ ] **Step 7: Verify + commit** — typecheck + dev smoke. Commit `feat: home page sections`.

---

### Task 9: Projects page — data-driven grid with search-param filtering

**Files:**
- Create: `src/components/projects/project-card.tsx`, `src/components/projects/project-filters.tsx`, `src/routes/projects.tsx`

**Interfaces:**
- Route: `/projects`, file `src/routes/projects.tsx`, with `validateSearch: (s) => ({ category: s.category as ProjectCategory|'all' ?? 'all', q: s.q ?? '' })`, `search` param updates via `navigate({ search: (prev) => ({...prev, category}) })` — Router search params drive state. `useLoaderData` not needed (data is static import) but use `loader` for SEO title only.
- Produces: `<ProjectFilters active={category} onChange={setCategory} />` (button group: All + 6 categories, active = primary variant), `<ProjectCard project />` (image/video, title, tagline, tech badges, links, hover lift + border glow).

- [ ] **Step 1: Route + search params** — `createFileRoute('/projects')`, `validateSearch` with `category` and `q` (string), defaults. Title/meta via `head()`.

- [ ] **Step 2: Filters** — sticky under header (or inline row), category pills; clicking navigates with new search. Search input (debounced 250ms) filters by title/tagline/tech client-side.

- [ ] **Step 3: Grid + cards** — responsive grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`, filtered `projects`. Empty state ("No projects match — clear filters" button). Card: aspect-video media (image or gradient+icon), category Badge, title, tagline, tech Badges (secondary), GitHub/Demo icon buttons (external, aria-labels). Hover: `TiltCard`-lite (translate-y + shadow) — reuse `TiltCard` from Task 7.

- [ ] **Step 4: Verify + commit** — URL reflects filters (`/projects?category=ai`), back/forward works, typecheck, smoke test. Commit `feat: projects page with search-param filters`.

---

### Task 10: Blog index + post page — cards, featured, search, pagination, MDX rendering

**Files:**
- Create: `src/routes/blog/index.tsx`, `src/routes/blog/$slug.tsx`, `src/components/blog/post-card.tsx`, `src/components/blog/featured-post.tsx`, `src/components/blog/blog-search.tsx`, `src/components/blog/pagination.tsx`, `src/components/blog/table-of-contents.tsx`, `src/components/blog/reading-progress.tsx`, `src/components/blog/share-buttons.tsx`, `src/components/blog/related-posts.tsx`, `src/components/blog/prev-next-nav.tsx`, `src/components/blog/post-comments.tsx` (giscus, client)
- Modify: `src/server/blog.ts` (add `getPostsPage` if pagination needs it — or paginate client-side), `src/routes/index.tsx` (optional latest-writing strip)

**Interfaces:**
- Route `/blog` (`blog/index.tsx`): search params `{ category?, tag?, q?, page? }` validated; loader: `getPosts`, `getPostTags`, `getPostCategories`; renders FeaturedPost (first featured), filters row (category pills + tag select + search input), PostCard grid (animated `Reveal`), Pagination (client, page size 6, updates `?page=`).
- Route `/blog/$slug` (`blog/$slug.tsx`): loader `getPost(slug)` → `{ post, related, prev, next }` (from `getRelatedPosts` + neighbors by date); head(): title/description/OG/JSON-LD Article; `pendingComponent` skeleton; `errorComponent` friendly error; renders hero cover, meta row (author, date, reading time, category), `ReadingProgress`, TableOfContents (sticky right on lg, from `post.toc`), `MDXContent code={post.mdx} components={mdxComponents}` in `.prose` article, ShareButtons, RelatedPosts, PrevNextNav, PostComments (giscus).
- `mdx-components.tsx` shared map (Task 4) reused here.
- Not-found behavior for missing slug: `throw notFound()` → 404 route.

- [ ] **Step 1: Blog index route** — search-param validation, loader fetching posts+tags+categories via server fns, `head()` meta. Compose FeaturedPost + filters + grid + pagination. Client-side filtering memoized on search params; pagination slices.

- [ ] **Step 2: Post card + featured** — card: cover (or gradient), category badge, date, title, description, tags, reading time; hover: lift + image scale. Featured: large 2-col card with `featured` data.

- [ ] **Step 3: Blog search** — debounced input (lucide `Search` icon, clear button), filters client-side across title/description/tags; empty state.

- [ ] **Step 4: Post page route** — loader + head + components. Include `ReadingProgress` (top bar tied to article scroll — reuse ScrollProgress pattern scoped to article), TOC with active-section highlight (`useInView` on headings), share buttons (Twitter/X, LinkedIn, Copy link — clipboard), `rehype`-generated ids match toc anchors. JSON-LD: `{"@type":"Article","headline":...}`.

- [ ] **Step 5: Related + prev/next + comments** — related grid (3 cards), prev/next footer links (chevrons), giscus client component (`<giscus-widget>` via `giscus` package or script tag: repo = placeholder `devina/portfolio` — read `NEXT_PUBLIC_GISCUS_REPO` style env or data constant; render only after mount, `loading="lazy"`).

- [ ] **Step 6: Verify + commit** — typecheck; curl `/blog` and `/blog/<slug>` → 200 + contains post title; `content:build` regenerates; commit `feat: blog index and post pages`.

---

### Task 11: Contact page + resume page + 404 + loading states

**Files:**
- Create: `src/routes/contact.tsx`, `src/components/contact/contact-form.tsx`, `src/components/contact/contact-info.tsx`, `src/routes/resume.tsx`, `src/components/resume/*` (timeline, skill-bars, print button, education, certifications, awards), `src/routes/404.tsx`, `src/routes/loading.tsx` (optional per-route pending)
- Modify: `src/routes/__root.tsx` (not-found component via `createRootRoute` `notFoundComponent` or `NotFound` route)

**Interfaces:**
- Contact route `/contact`: TanStack Form + `zodValidator` (contactSchema) with onChange/onBlur validators, `onSubmit` → `submitContact` server fn; states: `isSubmitting` (button spinner), success (sonner toast + inline success card), error (toast + inline error); fields: name, email, subject, message; all with labels + aria. `contact-info.tsx`: email, location, GitHub/LinkedIn/Twitter links, "response time" note.
- Resume route `/resume`: printable. Header (name, role, contact links), timeline (experience), skills bars, education, certifications, awards; print button (`window.print()` + `print:` CSS in globals.css: hide nav/footer/buttons, A4-friendly, `@media print`). Optional "Download PDF" → `siteConfig.resumePdfUrl` (placeholder `#` if none) or generate via print dialog instruction.
- 404 route: `NotFoundComponent` — big 404, message, "Back home" button, search link. Custom loading: route `pendingComponent` skeletons on blog post + projects.

- [ ] **Step 1: Contact form** — full TanStack Form pattern with zodValidator; graceful server fn; toasts via sonner; validation messages under fields (`text-destructive`); `aria-invalid` + `aria-describedby`. Reset form after success.

- [ ] **Step 2: Contact info** — card grid: Email (mailto), Location, Socials (icon buttons), response-time badge.

- [ ] **Step 3: Resume page** — sections composed from `resumeData`; print styles in globals.css (`@media print { header, footer, .no-print { display: none } }`); Print button `no-print`; PDF link.

- [ ] **Step 4: 404 + loading** — global NotFoundComponent in `__root.tsx` (`notFoundComponent`), custom `pendingComponent` for `/blog/$slug` (skeleton) and `/projects` (skeleton grid). Also wire root `errorComponent` (friendly error with reload button).

- [ ] **Step 5: Verify + commit** — typecheck; curl /contact, /resume, /nonexistent → 200/404; commit `feat: contact, resume, 404, loading states`.

---

### Task 12: SEO & performance polish — meta, OG, JSON-LD, RSS, sitemap, robots

**Files:**
- Create: `src/routes/sitemap.xml.ts`, `src/routes/rss.xml.ts`, `src/lib/seo.ts`, `public/robots.txt`, `src/components/seo/json-ld.tsx` (helper component)
- Modify: `src/routes/__root.tsx` (global meta, OG defaults, canonical, JSON-LD Person), `src/routes/blog/$slug.tsx` (Article JSON-LD), `src/routes/projects.tsx`, `src/routes/resume.tsx`, `src/routes/contact.tsx` (per-route meta)

**Interfaces:**
- `src/lib/seo.ts`: `buildMeta({ title, description, image?, path, type }): Meta[]` producing standard + OG + twitter tags with `siteConfig.url` prefix; `jsonLdPerson(): object` (Person schema); `absoluteUrl(path)`.
- `/sitemap.xml.ts` route: `loader` returns `new Response(xml, { headers: { 'Content-Type': 'application/xml' } })` with urls: /, /about?(no about route — use /#sections; list /, /projects, /resume, /blog, /contact, all blog slugs, /rss.xml). `<lastmod>` from post dates.
- `/rss.xml.ts`: RSS 2.0 feed from `getPosts()` (title, link, description, pubDate, guid). Content-Type `application/rss+xml`.
- `public/robots.txt`: allow all, sitemap URL.
- Verify with `curl -s http://localhost:3000/sitemap.xml | head` and rss.

- [ ] **Step 1: seo helpers + JSON-LD Person** in root head (name, url, sameAs socials, jobTitle).

- [ ] **Step 2: Per-route meta** — add `head()` to projects/resume/contact/blog routes using `buildMeta`; canonical URLs.

- [ ] **Step 3: sitemap + rss + robots** — implement per interfaces; test with curl.

- [ ] **Step 4: Performance audit** — ensure: 3D lazy (already), `mermaid` + `katex` css dynamic (`<link>` injected in `mdx-components` via lazy import or `import('katex/dist/katex.min.css')` in a `useEffect`-free server-safe way — prefer loading katex css only on post pages via route-level dynamic import in a `beforeLoad` or a client `useEffect`), giscus lazy. Confirm no Three.js import in any non-home route chunk (grep).

- [ ] **Step 5: Verify + commit** — `pnpm build` succeeds (production build!), `pnpm typecheck`, curl checks. Commit `feat: seo, rss, sitemap, performance polish`.

---

### Task 13: Final validation — full typecheck, build, dev smoke, a11y pass

**Files:**
- Modify: any file with defects found; `README.md` (create: setup, env vars, content editing guide, deploy to Vercel steps, scripts reference)

**Interfaces:**
- None new — verification + docs only.

- [ ] **Step 1: Full verification**

```bash
pnpm typecheck
pnpm content:build
pnpm build
```
All three must pass with zero errors. Fix anything that fails (type errors, build errors).

- [ ] **Step 2: Runtime smoke test** — start `pnpm start` (production server) or `pnpm dev`; curl: `/` 200, `/projects` 200, `/resume` 200, `/blog` 200, `/blog/<real-slug>` 200, `/contact` 200, `/sitemap.xml` 200 + xml, `/rss.xml` 200 + rss, `/nonexistent` → 404. Check no 500s.

- [ ] **Step 3: A11y + reduced-motion pass** — grep for `aria-label` on icon-only buttons, `alt` on images, `role="dialog"` presence in dialog components (shadcn provides), skip link present, `prefers-reduced-motion` guards on 3D/lenis/marquee/reveal. Fix gaps.

- [ ] **Step 4: README** — `README.md` with: overview, stack, getting started (`pnpm install && pnpm dev`), env vars table, "add a blog post" 3-step guide, "edit content" data file guide, deployment to Vercel (import repo, env vars, `pnpm build` auto-detected), scripts table, project structure tree.

- [ ] **Step 5: Commit** — `docs: readme and final validation fixes`.

---

## Self-Review Notes (controller)

- Spec coverage: hero ✓ (T7), about/skills/experience/projects/contact ✓ (T8), resume ✓ (T11), blog home+post ✓ (T10), contact form ✓ (T11), nav/footer/palette/theme ✓ (T6), SEO/RSS/sitemap ✓ (T12), 3D ✓ (T7), MDX/shiki/katex/mermaid/giscus ✓ (T4, T10), Prisma/Resend graceful ✓ (T5), print mode ✓ (T11), search params ✓ (T9, T10), reduced motion ✓ (T2/T7), 404/loading ✓ (T11). Nice-to-haves (PWA, i18n, heatmap, terminal page, dynamic OG images, visitor dashboard) explicitly **deferred** — out of scope for this plan.
- No placeholders: all steps contain concrete code or exact behaviors.
- Type consistency: `ProjectCategory`, `Project`, `PostSummary`, `ContactInput`, `TocItem`, `NavItem`, `Theme` names are used consistently across tasks 3–12.
