import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { LazyImage } from '@/components/ui/LazyImage'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PostCard } from '@/components/blog/PostCard'
import { FadeIn } from '@/components/ui/FadeIn'
import { RichContent } from '@/components/ui/RichContent'
import { formatDate, getShareUrl } from '@/lib/utils'
import { useNewsletterMutation } from '@/hooks/useMutations'
import type { Post } from '@/types'

interface PostDetailProps {
  post: Post
  related?: Post[]
  previous?: Post | null
  next?: Post | null
}

export function PostDetailView({ post, related = [], previous = null, next = null }: PostDetailProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const newsletter = useNewsletterMutation()

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleNewsletter = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      await newsletter.mutateAsync({ email })
      setSubscribed(true)
      setEmail('')
    } catch {
      // handled by mutation
    }
  }

  return (
    <article>
      {/* Hero */}
      <div className="relative bg-navy text-white">
        {post.featured_image_url && (
          <div className="absolute inset-0">
            <LazyImage
              src={post.featured_image_url}
              alt=""
              wrapperClassName="h-full"
              className="opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60" />
          </div>
        )}

        <Container className="relative py-16 md:py-24">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              {post.category && (
                <Badge variant="orange" className="mb-4">{post.category.name}</Badge>
              )}
              <h1 className="text-3xl font-bold leading-tight md:text-5xl text-balance">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-4 text-lg text-white/70 leading-relaxed">{post.excerpt}</p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
                {post.published_at && (
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                )}
                {post.reading_time && <span>{post.reading_time} min read</span>}
                {post.author && <span>By {post.author.name}</span>}
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* Content */}
      <Container className="py-12 md:py-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            {post.content && (
              <RichContent html={post.content} className="prose-content text-lg" />
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-navy/10 pt-8">
                {post.tags.map((tag) => (
                  <Badge key={tag.uuid} variant="cream">{tag.name}</Badge>
                ))}
              </div>
            )}

            {post.allow_social_sharing && (
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-sm font-semibold text-navy/60">Share:</span>
                {(['facebook', 'twitter', 'linkedin'] as const).map((platform) => (
                  <a
                    key={platform}
                    href={getShareUrl(platform, shareUrl, post.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-navy/5 px-4 py-2 text-sm font-medium text-navy capitalize hover:bg-teal hover:text-white transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}

            {(previous || next) && (
              <nav className="mt-12 flex flex-col gap-4 border-t border-navy/10 pt-8 sm:flex-row sm:justify-between">
                {previous ? (
                  <Link to={`/insights/${previous.slug}`} className="group max-w-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide text-navy/50">Previous</span>
                    <p className="mt-1 font-semibold text-navy group-hover:text-teal transition-colors">{previous.title}</p>
                  </Link>
                ) : <span />}
                {next ? (
                  <Link to={`/insights/${next.slug}`} className="group max-w-sm text-right sm:ml-auto">
                    <span className="text-xs font-semibold uppercase tracking-wide text-navy/50">Next</span>
                    <p className="mt-1 font-semibold text-navy group-hover:text-teal transition-colors">{next.title}</p>
                  </Link>
                ) : null}
              </nav>
            )}
          </div>
        </FadeIn>
      </Container>

      {/* Newsletter CTA */}
      <div className="bg-white/60 py-12">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-xl rounded-3xl bg-navy p-8 text-center text-white md:p-12">
              <h3 className="text-2xl font-bold">Never miss an insight</h3>
              <p className="mt-2 text-white/70">
                Subscribe to our newsletter for the latest tourism trends and strategies.
              </p>
              {subscribed ? (
                <p className="mt-6 text-teal-200">Thank you for subscribing!</p>
              ) : (
                <form onSubmit={handleNewsletter} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button type="submit" variant="orange" disabled={newsletter.isPending}>
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <Container className="py-16">
          <h2 className="mb-8 text-2xl font-bold">Related Insights</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {related.slice(0, 3).map((relatedPost) => (
              <PostCard key={relatedPost.uuid} post={relatedPost} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/insights" className="font-semibold text-teal hover:text-orange transition-colors">
              ← Back to all insights
            </Link>
          </div>
        </Container>
      )}
    </article>
  )
}
