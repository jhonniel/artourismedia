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
  /** Eager-load the card image (lead / above-the-fold). */
  priority?: boolean
}

export function PostCard({ post, variant = 'grid', index = 0, priority = false }: PostCardProps) {
  const imageSrc = postFeaturedImage(post)
  const tone = toneStyles(post.category?.name)

  if (variant === 'lead') {
    return (
      <Link to={`/insights/${post.slug}`} className="group block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-card transition-shadow duration-300 hover:shadow-elevated lg:rounded-[1.75rem]">
          <div className="relative h-[11rem] overflow-hidden sm:h-[12.5rem] md:h-[14rem] lg:h-[15rem]">
            <LazyImage
              src={imageSrc}
              alt={post.title}
              fill
              priority={priority}
              wrapperClassName="absolute inset-0 size-full"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
            {post.category && (
              <span
                className={cn(
                  'absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm',
                  tone.pill,
                )}
              >
                {post.category.name}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
            {post.published_at && (
              <time
                dateTime={post.published_at}
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/45"
              >
                {formatDate(post.published_at)}
              </time>
            )}
            <h3 className="mt-3 break-words font-serif text-xl font-normal leading-relaxed text-navy transition-colors group-hover:text-teal sm:text-2xl lg:text-[1.75rem]">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-navy/65 sm:text-[0.9375rem]">
                {post.excerpt}
              </p>
            )}
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-orange group-hover:text-orange/80">
              Read article
              <span aria-hidden>→</span>
            </span>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'list') {
    return (
      <Link to={`/insights/${post.slug}`} className="group block">
        <article className="flex flex-col gap-4 p-4 transition-colors hover:bg-cream/40 sm:flex-row sm:gap-6 sm:p-6">
          <LazyImage
            src={imageSrc}
            alt={post.title}
            wrapperClassName="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-auto sm:h-36 sm:w-52 sm:rounded-2xl md:h-40 md:w-60 lg:h-44 lg:w-64"
            className="h-full w-full object-cover"
          />

          <div className="flex min-w-0 flex-1 flex-col sm:justify-center">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {post.category && (
                <Badge variant={categoryTone(post.category.name)} className="w-fit">
                  {post.category.name}
                </Badge>
              )}
              {post.published_at && (
                <time
                  dateTime={post.published_at}
                  className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/40"
                >
                  {formatDate(post.published_at)}
                </time>
              )}
              {post.reading_time != null && post.reading_time > 0 && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/40">
                  {post.reading_time} min read
                </span>
              )}
            </div>

            <h3 className="mt-2 break-words font-serif text-lg font-normal leading-relaxed text-navy transition-colors group-hover:text-teal sm:mt-0 sm:text-xl">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/65 sm:line-clamp-3">
                {post.excerpt}
              </p>
            )}

            <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-orange group-hover:text-orange/80 sm:mt-4">
              Read article
              <span aria-hidden>→</span>
            </span>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'compact') {
    const number = String(index + 1).padStart(2, '0')

    return (
      <Link to={`/insights/${post.slug}`} className="group block h-full">
        <article className="relative flex h-full gap-4 overflow-hidden rounded-[1.25rem] bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated sm:gap-5 sm:rounded-[1.5rem] sm:p-5">
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
            <h3 className="mt-1 break-words font-serif text-lg font-normal leading-relaxed text-navy transition-colors group-hover:text-teal">
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
      <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-navy/5 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated sm:rounded-[1.5rem]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <LazyImage
            src={imageSrc}
            alt={post.title}
            fill
            wrapperClassName="absolute inset-0 size-full"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {post.category && (
              <Badge variant={categoryTone(post.category.name)} className="w-fit">
                {post.category.name}
              </Badge>
            )}
            {post.published_at && (
              <time
                dateTime={post.published_at}
                className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/45"
              >
                {formatDate(post.published_at)}
              </time>
            )}
            {post.reading_time != null && post.reading_time > 0 && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/40">
                {post.reading_time} min read
              </span>
            )}
          </div>
          <h3 className="mt-3 break-words font-serif text-xl font-normal leading-relaxed text-navy transition-colors group-hover:text-teal">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy/65">
              {post.excerpt}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-orange group-hover:text-orange/80">
            Read article
            <span aria-hidden>→</span>
          </span>
        </div>
      </article>
    </Link>
  )
}
