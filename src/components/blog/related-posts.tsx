import { PostCard } from '@/components/blog/post-card'
import type { PostSummary } from '@/server/blog'

/** Related articles grid (3 cards), below the post body. */
export function RelatedPosts({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="related-posts" className="mt-16">
      <h2
        id="related-posts"
        className="mb-6 flex items-center gap-3 font-display text-2xl font-semibold tracking-tight"
      >
        Keep reading
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
