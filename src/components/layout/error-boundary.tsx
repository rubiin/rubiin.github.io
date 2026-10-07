import { Link, type ErrorComponentProps } from "@tanstack/react-router";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Friendly route-level error page with a reload action. */
export function ErrorComponent({ error }: ErrorComponentProps) {
  // Router 1.170.41 types the boundary error as `unknown`; only Error instances
  // carry a message, and a thrown non-Error still needs readable copy.
  const message = error instanceof Error ? error.message : "";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" aria-hidden />
      </span>
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        {message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
          <RefreshCw className="size-4" aria-hidden />
          Reload page
        </Button>
        <Button asChild>
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
