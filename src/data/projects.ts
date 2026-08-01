import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'aurora-ai',
    title: 'Aurora AI',
    tagline: 'A RAG-powered assistant that turns team docs into answers.',
    description:
      'Aurora answers questions from your internal documentation using retrieval-augmented generation. Upload markdown, PDFs, and Notion exports; Aurora chunks, embeds, and indexes them into pgvector, then answers with citations.',
    category: 'ai',
    year: '2025',
    tech: ['React 19', 'TanStack Start', 'OpenAI', 'pgvector', 'Prisma 7', 'FastAPI'],
    demo: 'https://example.com/aurora',
    featured: true,
    architecture:
      'Server functions handle ingestion and querying. Documents are chunked by heading, embedded with text-embedding-3-small, and stored in pgvector. Queries run a hybrid keyword + vector search reranked by a small cross-encoder.',
    challenges: [
      'Chunking strategy dramatically affected answer quality — solved with heading-aware splitting and overlap',
      'Streaming responses through server functions required SSE handling on the edge',
      'Managing embedding costs at scale with a caching layer',
    ],
    lessons: [
      'Retrieval quality beats model choice — invest in chunking and reranking first',
      'Instrument everything: tracing RAG pipelines exposed failure modes instantly',
    ],
  },
  {
    slug: 'pixel-forge',
    title: 'Pixel Forge',
    tagline: 'A browser-based design tool for token-driven UI.',
    description:
      'Pixel Forge is a design tool where components are built from design tokens, not pixels. Export to Tailwind, CSS variables, or JSON — and keep design and code in perfect sync.',
    category: 'frontend',
    year: '2024',
    tech: ['React 19', 'Tailwind CSS', 'Zod', 'react-flow', 'IndexedDB'],
    github: 'https://github.com/devina/pixel-forge',
    demo: 'https://example.com/pixel-forge',
    featured: true,
    architecture:
      'A canvas editor with an ECS-style state model persisted to IndexedDB. Token values flow through a single source of truth and compile to framework-agnostic output.',
    challenges: [
      'Undo/redo across a graph data model — solved with an operation log',
      'Real-time preview of generated styles without layout thrash',
    ],
    lessons: [
      'A strict data model makes export features nearly free',
      'Offline-first with IndexedDB needs careful migration versioning',
    ],
  },
  {
    slug: 'neural-scape',
    title: 'Neural Scape',
    tagline: 'An immersive 3D visualization of neural network training.',
    description:
      'Neural Scape renders a neural network as it trains — weights, activations, and gradients become a living 3D landscape you can fly through. Built for a conference demo and a blog series.',
    category: 'full-stack',
    year: '2024',
    tech: ['Three.js', 'react-three-fiber', 'WebSocket', 'Python', 'FastAPI'],
    github: 'https://github.com/devina/neural-scape',
    demo: 'https://example.com/neural-scape',
    architecture:
      'A Python training loop streams metrics and weights over WebSocket to a Three.js scene. Instanced meshes render thousands of neurons at 60fps.',
    challenges: [
      'Streaming thousands of weight updates per second without jank — solved with batching and LOD',
      'Making abstract tensors legible required careful color and layout design',
    ],
    lessons: [
      'Instanced rendering is the difference between a demo and a product',
      'Visualization design is a first-class engineering problem',
    ],
  },
  {
    slug: 'shipyard',
    title: 'Shipyard',
    tagline: 'A deployment platform for indie SaaS teams.',
    description:
      'Shipyard deploys web apps to edge nodes with zero-config HTTPS, preview deployments, and one-click rollbacks — aimed at the indie developer who wants infra without the ops.',
    category: 'devops',
    year: '2023',
    tech: ['Node.js', 'Docker', 'Fly.io', 'PostgreSQL', 'GitHub Actions', 'Stripe'],
    github: 'https://github.com/devina/shipyard',
    demo: 'https://example.com/shipyard',
    architecture:
      'Git push triggers a build pipeline that produces immutable containers, promoted to preview then production environments. A control plane coordinates deployments and health checks.',
    challenges: [
      'Coordinating multi-region rollouts and rollbacks safely',
      'Billing metering for per-minute usage with Stripe',
    ],
    lessons: [
      'Predictable deploys come from immutable artifacts and one-way promotions',
      'Metering is a database design problem you should solve on day one',
    ],
  },
  {
    slug: 'motion-lab',
    title: 'Motion Lab',
    tagline: 'A playground for web animation primitives.',
    description:
      'Motion Lab documents and demonstrates 40+ animation patterns — springs, scroll choreography, shared element transitions, and micro-interactions — each with copyable code.',
    category: 'frontend',
    year: '2023',
    tech: ['React 19', 'Motion', 'Lenis', 'MDX', 'content-collections'],
    github: 'https://github.com/devina/motion-lab',
    demo: 'https://example.com/motion-lab',
    architecture:
      'A static-first MDX site where every pattern is a live, editable sandbox. Each animation runs in an isolated iframe so demos never fight the docs UI.',
    challenges: [
      'Isolating demo styles from the documentation shell',
      'Teaching spring physics without a math lecture',
    ],
    lessons: [
      'Animation is engineering: springs, easing, and duration all deserve tests',
      'Small, isolated demos are the best documentation',
    ],
  },
  {
    slug: 'atlas-docs',
    title: 'Atlas Docs',
    tagline: 'A blazing-fast documentation platform for product teams.',
    description:
      'Atlas is an MDX-powered documentation platform with instant search, offline support, and a themable design system. Used by several open-source projects as their docs home.',
    category: 'backend',
    year: '2022',
    tech: ['TanStack Start', 'TanStack Router', 'MDX', 'Shiki', 'IndexedDB', 'Service Workers'],
    github: 'https://github.com/devina/atlas-docs',
    demo: 'https://example.com/atlas-docs',
    featured: true,
    architecture:
      'Content compiles to static routes at build time; a service worker caches everything for offline reading. Search runs locally against a prebuilt index.',
    challenges: [
      'Sub-100ms search over large doc sets without a search server — solved with a compressed trie',
      'Offline caching invalidation across doc releases',
    ],
    lessons: [
      'A prebuilt index beats any client-side filter',
      'Offline-first is a product feature, not an afterthought',
    ],
  },
]
