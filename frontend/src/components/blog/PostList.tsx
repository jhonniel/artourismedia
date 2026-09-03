import { PostCard } from '@/components/blog/PostCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import type { Post } from '@/types'

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function PostList({ posts, isLoading, isError, onRetry }: PostListProps) {
  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return <ErrorMessage message="Unable to load insights." onRetry={onRetry} />
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-navy/10 bg-white p-12 text-center">
        <p className="text-navy/60">No insights found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.uuid} post={post} />
      ))}
    </div>
  )
}
