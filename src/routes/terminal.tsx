import { createFileRoute } from '@tanstack/react-router'
import { Terminal } from '@/components/terminal/terminal'

export const Route = createFileRoute('/terminal')({
  head: () => ({
    meta: [
      { title: 'Terminal — Rubin Bhandari' },
      {
        name: 'description',
        content: "Rubin Bhandari's hidden terminal — explore the portfolio from the command line.",
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <Terminal />,
})
