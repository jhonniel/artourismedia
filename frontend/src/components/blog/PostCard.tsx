import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { LazyImage } from '@/components/ui/LazyImage'
import type { Post } from '@/types'
import { cn, formatDate, postFeaturedImage } from '@/lib/utils'
import { categoryTone, toneStyles } from '@/lib/insightStyles'

interface PostCardProps {
  post: Post
  variant?: 'grid' | 'lead' | 'compact' | 'list'
  index?: number
  priority?: boolean
}

function PostMeta({
  post,
  className,
}: {
  post: Post
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1.5', className)}>
      {post.published_at && (
        <time
          dateTime={post.published_at}
          className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/45"
        >
          {formatDate(post.published_at)}
        </time>
      )}
      {post.reading_time != null && post.reading_time > 0 && (
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/45">
          {post.reading_time} min read
        </span>
      )}
      {post.category && (
        <Badge variant={categoryTone(post.category.name)} className="w-fit">
          {post.category.name}
        </Badge>
      )}
    </div>
  )
}

function ReadLink({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-orange group-hover:text-orange/80',
        className,
      )}
    >
      Read article
      <span aria-hidden>→</span>
    </span>
  )
}

export function PostCard({ post, variant = 'grid', index = 0, priority = false }: PostCardProps) {
  const imageSrc = postFeaturedImage(post)
  const tone = toneStyles(post.category?.name)

  if (variant === 'lead') {
    return (
      <Link to={`/insights/${post.slug}`} className="group block">
        <article className="overflow-hidden rounded-[1.25rem] border border-navy/[0.06] bg-white shadow-card transition-shadow duration-300 hover:shadow-elevated sm:rounded-[1.5rem] lg:flex lg:min-h-[20rem]">
          <div className="relative h-[12rem] shrink-0 overflow-hidden sm:h-[14rem] lg:h-auto lg:w-[42%] lg:max-w-[28rem] xl:w-[40%]">
            <LazyImage
              src={imageSrc}
              alt={post.title}
              fill
              priority={priority}
              wrapperClassName="absolute inset-0 size-full"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center p-5 sm:p-6 lg:p-8 xl:p-10">
            <PostMeta post={post} />
            <h3 className="mt-4 text-xl font-bold leading-snug text-navy transition-colors group-hover:text-teal sm:text-2xl lg:text-[1.65rem] xl:text-[1.875rem]">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-navy/62 sm:text-[0.9375rem] lg:mt-4 lg:line-clamp-4">
                {post.excerpt}
              </p>
            )}
            <ReadLink className="mt-5 lg:mt-6" />
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'list') {
    return (
      <Link to={`/insights/${post.slug}`} className="group block">
        <article className="flex flex-col gap-4 p-4 transition-colors hover:bg-cream/40 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <LazyImage
            src={imageSrc}
            alt={post.title}
            wrapperClassName="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-auto sm:h-36 sm:w-52 sm:rounded-2xl md:h-40 md:w-56"
            className="h-full w-full object-cover"
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <PostMeta post={post} />
            <h3 className="mt-3 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-teal sm:text-xl">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/62 sm:line-clamp-3">
                {post.excerpt}
              </p>
            )}
            <ReadLink className="mt-4" />
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'compact') {
    const number = String(index + 1).padStart(2, '0')

    return (
      <Link to={`/insights/${post.slug}`} className="group block h-full">
        <article className="relative flex h-full gap-4 overflow-hidden rounded-[1.25rem] border border-navy/[0.06] bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated sm:gap-5 sm:rounded-[1.5rem] sm:p-5">
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute right-4 top-3 font-serif text-4xl font-normal leading-none sm:text-5xl',
              tone.number,
            )}
          >
            {number}
          </span>

          <LazyImage
            src={imageSrc}
            alt={post.title}
            wrapperClassName="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32 sm:rounded-2xl"
            className="h-full w-full object-cover"
          />

          <div className="relative flex min-w-0 flex-1 flex-col pr-8 sm:pr-10">
            <span className={cn('mb-3 h-0.5 w-8 rounded-full', tone.bar)} aria-hidden />
            {post.category && (
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy/50">
                {post.category.name}
              </p>
            )}
            <h3 className="mt-1 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-teal">
              {post.title}
            </h3>
            {post.published_at && (
              <time
                dateTime={post.published_at}
                className="mt-auto pt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/40"
              >
                {formatDate(post.published_at)}
              </time>
            )}
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link to={`/insights/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-navy/[0.06] bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated sm:rounded-[1.5rem]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <LazyImage
            src={imageSrc}
            alt={post.title}
            fill
            priority={priority}
            wrapperClassName="absolute inset-0 size-full"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <PostMeta post={post} />
          <h3 className="mt-3 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-teal sm:text-xl">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy/62">
              {post.excerpt}
            </p>
          )}
          <ReadLink className="mt-5" />
        </div>
      </article>
    </Link>
  )
}
