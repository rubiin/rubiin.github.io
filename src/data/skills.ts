import type { SkillCategory } from '@/types'

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    icon: 'Layout',
    skills: [
      {
        name: 'React / Next.js / TanStack',
        level: 95,
        years: 8,
        technologies: ['React 19', 'TanStack Router', 'TanStack Query', 'Server Components'],
        relatedProjects: ['atlas-docs', 'motion-lab'],
      },
      {
        name: 'TypeScript',
        level: 92,
        years: 7,
        technologies: ['Strict mode', 'Generics', 'Zod'],
        relatedProjects: ['pixel-forge', 'atlas-docs'],
      },
      {
        name: 'Tailwind CSS / Design Systems',
        level: 90,
        years: 5,
        technologies: ['Tailwind v4', 'shadcn/ui', 'CSS Variables'],
        relatedProjects: ['pixel-forge'],
      },
      {
        name: 'Three.js / WebGL',
        level: 82,
        years: 4,
        technologies: ['react-three-fiber', 'drei', 'GLSL'],
        relatedProjects: ['neural-scape', 'motion-lab'],
      },
      {
        name: 'Motion / Animation',
        level: 88,
        years: 6,
        technologies: ['Motion', 'GSAP', 'Lenis', 'View Transitions'],
        relatedProjects: ['motion-lab'],
      },
    ],
  },
  {
    name: 'Backend',
    icon: 'Server',
    skills: [
      {
        name: 'Node.js',
        level: 90,
        years: 8,
        technologies: ['Hono', 'Fastify', 'Workers'],
        relatedProjects: ['shipyard'],
      },
      {
        name: 'PostgreSQL / Prisma',
        level: 85,
        years: 6,
        technologies: ['Prisma 7', 'Drizzle', 'Supabase'],
        relatedProjects: ['shipyard', 'aurora-ai'],
      },
      {
        name: 'Serverless & Edge',
        level: 84,
        years: 5,
        technologies: ['Vercel', 'Cloudflare Workers', 'AWS Lambda'],
        relatedProjects: ['shipyard'],
      },
      {
        name: 'APIs & Real-time',
        level: 86,
        years: 7,
        technologies: ['tRPC', 'WebSockets', 'REST', 'GraphQL'],
        relatedProjects: ['shipyard', 'aurora-ai'],
      },
    ],
  },
  {
    name: 'AI / ML',
    icon: 'Brain',
    skills: [
      {
        name: 'LLM Application Dev',
        level: 78,
        years: 2,
        technologies: ['OpenAI', 'LangChain', 'RAG', 'Prompt engineering'],
        relatedProjects: ['aurora-ai'],
      },
      {
        name: 'Vector Databases',
        level: 72,
        years: 2,
        technologies: ['pgvector', 'Pinecone', 'Embeddings'],
        relatedProjects: ['aurora-ai'],
      },
      {
        name: 'Python',
        level: 70,
        years: 3,
        technologies: ['FastAPI', 'NumPy', 'scikit-learn'],
        relatedProjects: ['aurora-ai'],
      },
    ],
  },
  {
    name: 'DevOps',
    icon: 'Cloud',
    skills: [
      {
        name: 'CI/CD',
        level: 85,
        years: 6,
        technologies: ['GitHub Actions', 'Vercel', 'Turborepo'],
        relatedProjects: ['shipyard'],
      },
      {
        name: 'Docker / Containers',
        level: 78,
        years: 5,
        technologies: ['Docker', 'docker-compose', 'Fly.io'],
        relatedProjects: ['shipyard'],
      },
      {
        name: 'Observability',
        level: 80,
        years: 4,
        technologies: ['OpenTelemetry', 'Grafana', 'Sentry'],
        relatedProjects: ['shipyard'],
      },
    ],
  },
  {
    name: 'Mobile',
    icon: 'Smartphone',
    skills: [
      {
        name: 'React Native',
        level: 80,
        years: 5,
        technologies: ['Expo', 'Reanimated', 'Gesture Handler'],
        relatedProjects: ['pixel-forge'],
      },
      {
        name: 'PWA / Offline',
        level: 82,
        years: 4,
        technologies: ['Service Workers', 'IndexedDB', 'Workbox'],
        relatedProjects: ['atlas-docs'],
      },
    ],
  },
  {
    name: 'Full Stack',
    icon: 'Layers',
    skills: [
      {
        name: 'TanStack Start / Router',
        level: 90,
        years: 3,
        technologies: ['Server Functions', 'File-based routing', 'Loaders'],
        relatedProjects: ['atlas-docs'],
      },
      {
        name: 'Auth & Security',
        level: 80,
        years: 5,
        technologies: ['OAuth2', 'JWT', 'RBAC', 'Clerk'],
        relatedProjects: ['shipyard'],
      },
      {
        name: 'Testing',
        level: 85,
        years: 6,
        technologies: ['Vitest', 'Playwright', 'Testing Library'],
        relatedProjects: ['shipyard', 'atlas-docs'],
      },
    ],
  },
]
