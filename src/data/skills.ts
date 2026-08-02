import type { SkillCategory } from '@/types'

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    icon: 'Layout',
    skills: [
      {
        name: 'JavaScript (ES6+)',
        level: 90,
        since: 2019,
        technologies: ['ES2023', 'Async patterns', 'Functional style'],
        relatedProjects: ['helper-fns'],
      },
      {
        name: 'TypeScript',
        level: 85,
        since: 2021,
        technologies: ['Strict mode', 'Generics', 'Decorators'],
        relatedProjects: ['ultimate-nestjs', 'url-minify', 'nestjs-easyconfig'],
      },
      {
        name: 'HTML & (S)CSS',
        level: 88,
        since: 2019,
        technologies: ['SCSS', 'Responsive layouts', 'Tailwind'],
        relatedProjects: ['jazz-music-player'],
      },
      {
        name: 'Vue',
        level: 75,
        since: 2022,
        technologies: ['Vue 3', 'Composition API', 'Vite'],
        relatedProjects: [],
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
        since: 2019,
        technologies: ['Express', 'Fastify', 'CLI tools'],
        relatedProjects: ['sample-env', 'helper-fns', 'url-minify'],
      },
      {
        name: 'NestJS',
        level: 92,
        since: 2021,
        technologies: ['Modules', 'DI', 'REPL', 'MikroORM'],
        relatedProjects: [
          'ultimate-nestjs',
          'nestjs-easyconfig',
          'nestjs-cloudinary',
          'nestjs-minio',
        ],
      },
      {
        name: 'Golang',
        level: 78,
        since: 2022,
        technologies: ['CLI', 'Concurrency', 'HTTP servers'],
        relatedProjects: ['projecto'],
      },
      {
        name: 'GraphQL',
        level: 75,
        since: 2022,
        technologies: ['Apollo', 'TypeGraphQL', 'Subscriptions'],
        relatedProjects: ['ultimate-nestjs'],
      },
    ],
  },
  {
    name: 'Full Stack',
    icon: 'Layers',
    skills: [
      {
        name: 'PostgreSQL',
        level: 80,
        since: 2020,
        technologies: ['SQL', 'Prisma', 'MikroORM'],
        relatedProjects: ['ultimate-nestjs'],
      },
      {
        name: 'MongoDB',
        level: 78,
        since: 2020,
        technologies: ['Mongoose', 'Aggregation'],
        relatedProjects: [],
      },
      {
        name: 'Redis',
        level: 70,
        since: 2022,
        technologies: ['Caching', 'Queues'],
        relatedProjects: ['ultimate-nestjs'],
      },
      {
        name: 'API Design',
        level: 85,
        since: 2019,
        technologies: ['REST', 'Validation', 'Versioning'],
        relatedProjects: ['ultimate-nestjs', 'nestjs-easyconfig'],
      },
    ],
  },
  {
    name: 'DevOps',
    icon: 'Cloud',
    skills: [
      {
        name: 'Docker',
        level: 85,
        since: 2020,
        technologies: ['Compose', 'Multi-stage builds'],
        relatedProjects: ['ultimate-nestjs'],
      },
      {
        name: 'AWS',
        level: 75,
        since: 2021,
        technologies: ['EC2', 'S3', 'RDS'],
        relatedProjects: ['ultimate-nestjs'],
      },
      {
        name: 'Git & CI/CD',
        level: 88,
        since: 2019,
        technologies: ['GitHub Actions', 'Jenkins'],
        relatedProjects: ['nestjs-easyconfig'],
      },
      {
        name: 'Linux',
        level: 85,
        since: 2019,
        technologies: ['Shell scripting', 'Neovim'],
        relatedProjects: ['fortune-nvim'],
      },
    ],
  },
  {
    name: 'Mobile',
    icon: 'Smartphone',
    skills: [
      {
        name: 'Android',
        level: 70,
        since: 2022,
        technologies: ['Java', 'Play Store distribution'],
        relatedProjects: ['jazz-music-player'],
      },
      {
        name: 'Blockchain / Web3',
        level: 65,
        since: 2023,
        technologies: ['Solidity', 'Web3.js', 'Smart contracts'],
        relatedProjects: [],
      },
    ],
  },
]
