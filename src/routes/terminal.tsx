import { createFileRoute } from '@tanstack/react-router'
import { Terminal } from '@/components/terminal/terminal'
import { buildMeta } from '@/lib/seo'

export const Route = createFileRoute('/terminal')({
  head: () => ({
    meta: [
      { title: 'Terminal — Devina' },
      {
        name: 'description',
        content: "Devina's hidden terminal — explore the portfolio from the command line.",
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <Terminal />,
})
