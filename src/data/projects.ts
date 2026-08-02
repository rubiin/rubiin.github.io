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
    slug: 'nestjs-i18n',
    title: 'Nestjs-i18n',
    tagline: 'The i18n module for NestJS — internationalization the Nest way.',
    description:
      'The most popular i18n module for NestJS — robust internationalization for Nest applications with locale resolution, JSON/YAML translation files, pluralization, and flexible query/header/cookie-based language detection. Battle-tested across thousands of projects and documented at nestjs-i18n.com.',
    category: 'backend',
    year: '2019',
    tech: ['NestJS', 'TypeScript', 'i18n', 'Internationalization'],
    image: '/projects/nestjs-i18n.png',
    github: 'https://github.com/toonvanstrijp/nestjs-i18n',
    demo: 'https://nestjs-i18n.com',
    featured: true,
    challenges: [
      'Designing locale resolution that works across query, header, and cookie strategies',
      'Supporting pluralization rules across dozens of languages',
      'Keeping the module framework-native while handling a huge feature surface',
    ],
    lessons: [
      'A well-documented module with a docs site earns community trust fast',
      'L10n is a cross-cutting concern — a clean module API is everything',
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
    slug: 'nestjs-pgpromise',
    title: 'Nestjs-pgpromise',
    tagline: 'A NestJS module for pg-promise.',
    description:
      'A module that wraps pg-promise for NestJS — utilities, database pool management, and a clean service API for PostgreSQL access, matching the ergonomics of the rest of the NestCrafts module series.',
    category: 'backend',
    year: '2019',
    tech: ['NestJS', 'TypeScript', 'pg-promise', 'PostgreSQL'],
    github: 'https://github.com/NestCrafts/nestjs-pgpromise',
    challenges: [
      'Wrapping pg-promise\'s promise-first API in Nest\'s DI lifecycle',
      'Managing connection pools and clean shutdown',
    ],
    lessons: [
      'Database modules must handle pool lifecycle or users will in production',
      'Consistent module ergonomics make the NestCrafts series easy to adopt',
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
    slug: 'pokego',
    title: 'Pokego',
    tagline: 'Display Pokémon sprites in color, right in your terminal.',
    description:
      'A Go port of pokemon-colorscripts with a speed boost — renders colorful Pokémon sprites directly in your terminal, powered by the classic spritesheet data. Distributed via AUR (pokego-git) and Go install.',
    category: 'devops',
    year: '2024',
    tech: ['Go', 'Terminal', 'CLI'],
    github: 'https://github.com/rubiin/pokego',
    challenges: [
      'Porting sprite rendering logic from Bash to idiomatic Go with a real speed win',
      'Keeping output crisp across terminal color profiles',
    ],
    lessons: [
      'A faithful port can beat the original when the language fits',
      'Small delightful CLIs make great open-source calling cards',
    ],
  },
  {
    slug: 'init-lua',
    title: 'init.lua — Neovim PDE',
    tagline: 'A personal development environment, carefully crafted in Neovim.',
    description:
      'Rubin\'s always-WIP Neovim config (PDE — Personal Development Environment): a brew of plugins and keybindings that dance harmoniously — autocomplete, syntax highlighting, and a carefully tuned editing experience.',
    category: 'devops',
    year: '2024',
    tech: ['Lua', 'Neovim', 'LazyVim'],
    github: 'https://github.com/rubiin/init.lua',
    challenges: [
      'Keeping a personal config fast while layering on plugins',
      'Documenting keybindings well enough to stay usable',
    ],
    lessons: [
      'An editor config is a personal product — iterate on it daily',
      'Delightful docs make configs worth sharing',
    ],
  },
  {
    slug: 'nfdl',
    title: 'NFDL — Nerd Font Downloader',
    tagline: 'Install your favorite Nerd Fonts straight from the terminal.',
    description:
      'A handy CLI that simplifies downloading and installing Nerd Fonts — choose from a curated list of popular patched fonts, auto-download from official releases, unarchive, and install with a friendly interface.',
    category: 'devops',
    year: '2023',
    tech: ['TypeScript', 'Node.js', 'CLI', 'npm'],
    github: 'https://github.com/rubiin/nfdl',
    challenges: [
      'Curating and maintaining the font list against upstream releases',
      'Handling download, unarchive, and install across OSes',
    ],
    lessons: [
      'Developer tooling that removes setup pain gets adopted',
      'Interactive CLIs need zero-friction defaults',
    ],
  },
  {
    slug: 'dotfiles',
    title: 'dotfiles (arch btw)',
    tagline: 'Personal dotfiles — neovim, tmux, zsh, alacritty, kitty, and more.',
    description:
      'The secret sauce behind Rubin\'s Unix environment: dotfiles managed with Chezmoi, including configs for Neovim, tmux, zsh, Alacritty, Kitty, and more — arch btw. The desktop screenshot shows the full setup in action.',
    category: 'devops',
    year: '2024',
    tech: ['Chezmoi', 'Neovim', 'Tmux', 'Zsh', 'Linux'],
    image: '/projects/dotfiles.png',
    github: 'https://github.com/rubiin/dotfiles',
    challenges: [
      'Versioning secrets and machine-specific overrides with Chezmoi',
      'Keeping the environment reproducible across machines',
    ],
    lessons: [
      'Dotfiles are an environment — treat them like a product',
      'Chezmoi makes machine-specific configs manageable',
    ],
  },
  {
    slug: 'gitignorer',
    title: 'Gitignorer',
    tagline: 'Quickly add .gitignore files to your current environment.',
    description:
      'A CLI app that adds gitignore files to your current environment or project with one command — no more hunting for the right template.',
    category: 'devops',
    year: '2021',
    tech: ['Go', 'CLI', 'Git'],
    github: 'https://github.com/rubiin/gitignorer',
    challenges: [
      'Sourcing and maintaining a solid template library',
      'Detecting the project type to suggest the right ignore file',
    ],
    lessons: [
      'One-command conveniences compound across every project',
      'Go single-binary CLIs are trivially easy to distribute',
    ],
  },
  {
    slug: 'vscode-nestjs-snippets',
    title: 'NestJS Snippets for VS Code',
    tagline: 'Snippets for common NestJS operations in VS Code.',
    description:
      'A VS Code extension that adds snippets for the common operations of working with NestJS — controllers, services, modules, providers, and more — so you can write idiomatic Nest code in a keystroke.',
    category: 'backend',
    year: '2019',
    tech: ['VS Code', 'NestJS', 'TypeScript', 'Snippets'],
    image: '/projects/vscode-nestjs-snippets.png',
    github: 'https://github.com/rubiin/vscode-nestjs-snippets',
    challenges: [
      'Designing snippet bodies that produce idiomatic, configurable code',
      'Keeping the extension maintained across VS Code releases',
    ],
    lessons: [
      'Developer-experience tools spread through word of mouth',
      'Snippets encode team conventions into keystrokes',
    ],
  },
]
