import { Link } from '@tanstack/react-router'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Friendly 404 page, used as the router-wide default not-found. */
export function NotFoundComponent() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">This page drifted off.</h1>
      <p className="max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved. Let's get you back to
        somewhere useful.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="size-4" aria-hidden />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/blog" search={{ category: 'all', tag: 'all', q: '', page: 1 }}>
            <Search className="size-4" aria-hidden />
            Browse the blog
          </Link>
        </Button>
      </div>
    </div>
  )
}
