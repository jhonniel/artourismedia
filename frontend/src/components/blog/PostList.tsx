import { PostCard } from '@/components/blog/PostCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { FadeIn } from '@/components/ui/FadeIn'
import type { Post } from '@/types'

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  layout?: 'list' | 'grid' | 'magazine'
  showLead?: boolean
}

export function PostList({
  posts,
  isLoading,
  isError,
  onRetry,
  layout = 'grid',
  showLead = false,
}: PostListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message="Unable to load insights." onRetry={onRetry} />
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-navy/8 bg-white px-8 py-16 text-center shadow-soft">
        <p className="font-serif text-xl text-navy">No insights found</p>
        <p className="mt-2 text-sm text-navy/60">Try adjusting your search or category filters.</p>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="overflow-hidden rounded-[1.5rem] border border-navy/8 bg-white shadow-soft divide-y divide-navy/[0.06]">
        {posts.map((post, index) => (
          <PostCard key={post.uuid} post={post} variant="list" index={index} />
        ))}
      </div>
    )
  }

  const useLead = layout === 'magazine' && showLead && posts.length > 0
  const leadPost = useLead ? posts[0] : null
  const listPosts = useLead ? posts.slice(1) : posts

  return (
    <div className="space-y-8 md:space-y-10">
      {leadPost && (
        <FadeIn>
          <PostCard post={leadPost} variant="lead" priority />
        </FadeIn>
      )}

      {listPosts.length > 0 && (
        <div className="overflow-hidden rounded-[1.5rem] border border-navy/8 bg-white shadow-soft divide-y divide-navy/[0.06]">
          {listPosts.map((post, index) => (
            <FadeIn key={post.uuid} delay={useLead ? (index + 1) * 60 : index * 60}>
              <PostCard post={post} variant="list" index={index} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  )
}
