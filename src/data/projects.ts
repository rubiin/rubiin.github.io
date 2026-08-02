import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'tsumiki',
    title: 'Tsumiki',
    tagline: 'A modular status bar for Hyprland, built on Fabric.',
    description:
      'Tsumiki (積み木 — Japanese for \'building blocks\') is a modular status bar for the Hyprland Wayland compositor. Built on Fabric with a flexible, widget-based architecture, it ships 45+ widgets — workspaces, system tray, media, battery, CPU, weather, dock, launcher — plus a built-in notification daemon, OSD overlays, and TOML config with hot-reload. Fully themeable via SCSS with Material You color schemes generated from your wallpaper.',
    category: 'devops',
    year: '2024',
    tech: ['Python', 'Fabric', 'Hyprland', 'Wayland', 'GTK'],
    image: '/projects/tsumiki.png',
    github: 'https://github.com/rubiin/tsumiki',
    demo: 'https://tsumikii.pages.dev',
    featured: true,
    challenges: [
      'Keeping a Python panel performant enough to sit beside native C/Rust bars',
      'Designing a 45+ widget architecture that stays responsive to Hyprland\'s event model',
      'Wiring Material You color generation into live SCSS theming',
    ],
    lessons: [
      'Deep compositor integration beats generic widgets',
      'A widget-based architecture turns a status bar into a platform',
      'Python + Fabric can absolutely compete with Waybar',
    ],
  },
  {
    slug: 'ultimate-nestjs',
    title: 'Ultimate Nestjs',
    tagline: 'A real-world NestJS + MikroORM codebase with batteries included.',
    description:
      'A blog built on NestJS and MikroORM — a production-style backend containing real-world examples: CRUD, password-based and OAuth authentication, advanced patterns, and an ever-evolving set of features.',
    category: 'backend',
    year: '2023',
    tech: ['NestJS', 'TypeScript', 'MikroORM', 'PostgreSQL', 'Docker', 'AWS'],
    image: '/projects/ultimate-nestjs.png',
    github: 'https://github.com/rubiin/ultimate-nest',
    featured: true,
    challenges: [
      'Structuring auth (password + OAuth) and advanced patterns so each example stays understandable',
      'Keeping the codebase current across NestJS and MikroORM releases',
    ],
    lessons: [
      'A batteries-included starter saves teams weeks of boilerplate wiring',
      'Documenting real-world patterns beats isolated examples',
    ],
  },
  {
    slug: 'sample-env',
    title: 'Sample env',
    tagline: 'Effortlessly generate .env sample files without leaking secrets.',
    description:
      'A CLI that streamlines creating sample environment files for your projects — it generates environment files while ensuring all sensitive information is excluded, saving you the hassle of manually scrubbing secrets.',
    category: 'devops',
    year: '2023',
    tech: ['Node.js', 'TypeScript', 'CLI'],
    image: '/projects/sample-env.png',
    github: 'https://github.com/rubiin/sample-env',
    featured: true,
    challenges: [
      'Reliably detecting which values are secrets versus safe defaults',
      'Keeping the CLI zero-config while supporting common file formats',
    ],
    lessons: [
      'Secret hygiene is a tooling problem — make the safe path the easy path',
      'Small focused CLIs are great open-source surface area',
    ],
  },
  {
    slug: 'nestjs-easyconfig',
    title: 'Nestjs-easyconfig',
    tagline: 'Load configs from .env files with type processing and safe checks.',
    description:
      'nestjs-easyconfig loads configs from your .env files — automatic env variable type processing, safe checks, and multiple logger options, all as a drop-in NestJS module.',
    category: 'backend',
    year: '2022',
    tech: ['NestJS', 'TypeScript', 'dotenv'],
    image: '/projects/nestjs-easyconfig.png',
    github: 'https://github.com/NestCrafts/nestjs-easyconfig',
    featured: true,
    challenges: [
      'Auto type-processing env values without surprising edge cases',
      'Designing a module API that feels native to NestJS',
    ],
    lessons: [
      'Typed config catches whole classes of runtime bugs',
      'Framework-native tooling gets adopted faster than wrappers',
    ],
  },
  {
    slug: 'projecto',
    title: 'Projecto',
    tagline: 'Open your project folders in your favorite editors instantly.',
    description:
      'Projecto efficiently opens your project folder in the editors you have specified — it streamlines setup by automatically launching your preferred editors or IDEs with the project folder already loaded, so you can dive straight into work.',
    category: 'devops',
    year: '2023',
    tech: ['Golang', 'Shell'],
    image: '/projects/projecto.png',
    github: 'https://github.com/rubiin/projecto',
    featured: true,
    challenges: [
      'Detecting installed editors across platforms and shells',
      'Keeping launch behavior fast and predictable',
    ],
    lessons: [
      'Golang is a great fit for snappy developer CLI tools',
      'Eliminating manual setup steps compounds daily',
    ],
  },
  {
    slug: 'fortune-nvim',
    title: 'Fortune.nvim',
    tagline: 'Inspiration, wisdom, or humor for your Neovim dashboard.',
    description:
      'A Neovim plugin that injects random quotes, proverbs, or jokes into your dashboard, plus helpful tips and tricks to improve your productivity within the editor.',
    category: 'devops',
    year: '2023',
    tech: ['Lua', 'Neovim', 'Vim'],
    github: 'https://github.com/rubiin/fortune.nvim',
    challenges: [
      'Writing Lua that works across Neovim versions',
      'Keeping the dashboard layout stable with injected content',
    ],
    lessons: [
      'Small delightful touches make tools feel alive',
      'Plugin docs and animated previews drive adoption',
    ],
  },
  {
    slug: 'helper-fns',
    title: 'Helper-fns',
    tagline: 'A collection of utility functions for everyday TypeScript.',
    description:
      'A library of utility functions for common tasks across data types — arrays, objects, strings, and more — designed to improve code readability and maintainability with reusable solutions.',
    category: 'backend',
    year: '2022',
    tech: ['TypeScript', 'JavaScript', 'npm'],
    github: 'https://github.com/rubiin/helper-fns',
    challenges: [
      'Keeping the API surface small and well-typed',
      'Avoiding bundle bloat with tree-shakeable exports',
    ],
    lessons: [
      'Good utility libraries are opinionated about what they omit',
      'TypeScript generics turn helper functions into safety nets',
    ],
  },
  {
    slug: 'nestjs-cloudinary',
    title: 'Nestjs-cloudinary',
    tagline: 'A Nest module for Cloudinary media uploads.',
    description:
      'A nest-cloudinary module for Nest — install the client SDK, configure the module, and upload media through a clean, framework-native API.',
    category: 'backend',
    year: '2021',
    tech: ['NestJS', 'TypeScript', 'Cloudinary'],
    github: 'https://github.com/NestCrafts/nestjs-cloudinary',
    challenges: [
      'Wrapping the Cloudinary SDK in a DI-friendly module',
      'Exposing upload options without leaking implementation details',
    ],
    lessons: [
      'Modules that hide third-party SDKs keep app code clean',
      'Quick-start guides reduce integration friction',
    ],
  },
  {
    slug: 'nestjs-minio',
    title: 'Nestjs-minio',
    tagline: 'A Nest module for MinIO object storage.',
    description:
      'A nest-minio module for Nest — a quick-start guide to installing the client SDK and executing an example program, wrapping MinIO object storage in a NestJS-native module.',
    category: 'backend',
    year: '2021',
    tech: ['NestJS', 'TypeScript', 'MinIO'],
    github: 'https://github.com/NestCrafts/nestjs-minio',
    challenges: [
      'Mirroring the Cloudinary module API for consistency',
      'Handling bucket lifecycle and error propagation cleanly',
    ],
    lessons: [
      'Consistent module APIs across a series lower the learning curve',
      'S3-compatible storage keeps deployments portable',
    ],
  },
  {
    slug: 'url-minify',
    title: 'URL Minify',
    tagline: 'Shorten long URLs with multiple providers, in TS.',
    description:
      'A versatile, lightweight library for shortening long URLs into concise, manageable links. Supports multiple URL shortening providers so you can pick the best service — written in TypeScript for both Node.js and browser environments.',
    category: 'backend',
    year: '2024',
    tech: ['TypeScript', 'Node.js', 'REST'],
    github: 'https://github.com/rubiin/url-minify',
    challenges: [
      'Abstracting multiple shortening providers behind one API',
      'Keeping the library isomorphic across Node and browser',
    ],
    lessons: [
      'Provider abstraction lets users swap services without code changes',
      'Isomorphic libraries need careful environment guards',
    ],
  },
  {
    slug: 'jazz-music-player',
    title: 'Jazz — Music Player',
    tagline: 'A fork of the original Jazz music player for Android.',
    description:
      'A fork of the original Jazz music player — a feature-rich Android music player, distributed through the Play Store.',
    category: 'mobile',
    year: '2021',
    tech: ['Android', 'Java'],
    github: 'https://github.com/rubiin/jazz-music-player',
    demo: 'https://play.google.com/store/apps/details?id=rubin.jazz',
    challenges: [
      'Maintaining a fork while upstream evolves',
      'Ensuring playback stability across Android versions',
    ],
    lessons: [
      'Forks thrive when the fixes are contributed back upstream',
      'Play Store distribution sharpens polish and testing',
    ],
  },
]
