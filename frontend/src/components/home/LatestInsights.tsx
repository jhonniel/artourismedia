import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { LazyImage } from '@/components/ui/LazyImage'
import type { HomepageSection, Post } from '@/types'
import { cn, formatDate } from '@/lib/utils'

interface LatestInsightsProps {
  section: HomepageSection
  posts: Post[]
}

type CategoryTone = 'teal' | 'orange' | 'purple' | 'navy'

const CATEGORY_TONES: Record<string, CategoryTone> = {
  strategy: 'teal',
  marketing: 'orange',
  media: 'purple',
}

const TONE_STYLES: Record<
  CategoryTone,
  { bar: string; pill: string; link: string; number: string }
> = {
  teal: {
    bar: 'bg-teal',
    pill: 'bg-teal/10 text-teal',
    link: 'text-teal group-hover:text-teal/80',
    number: 'text-teal/25',
  },
  orange: {
    bar: 'bg-orange',
    pill: 'bg-orange/10 text-orange',
    link: 'text-orange group-hover:text-orange/80',
    number: 'text-orange/25',
  },
  purple: {
    bar: 'bg-purple',
    pill: 'bg-purple/10 text-purple',
    link: 'text-purple group-hover:text-purple/80',
    number: 'text-purple/25',
  },
  navy: {
    bar: 'bg-navy',
    pill: 'bg-navy/8 text-navy',
    link: 'text-navy group-hover:text-navy/70',
    number: 'text-navy/15',
  },
}

function categoryTone(name?: string): CategoryTone {
  if (!name) return 'teal'
  return CATEGORY_TONES[name.toLowerCase()] ?? 'navy'
}

function toneStyles(name?: string) {
  return TONE_STYLES[categoryTone(name)]
}

export function LatestInsights({ section, posts }: LatestInsightsProps) {
  const sorted = [...posts].slice(0, 3)
  const eyebrow = (section.content.eyebrow as string) ?? section.title ?? 'Latest Insights'
  const headline = (section.content.title as string) ?? 'Thought leadership for destination builders'
  const ctaText = (section.content.cta_text as string) ?? 'View All Insights'
  const ctaUrl = (section.content.cta_url as string) ?? '/insights'

  if (sorted.length === 0) return null

  const [lead, ...rest] = sorted
  const leadTone = toneStyles(lead.category?.name)

  return (
    <section className="bg-cream py-16 md:py-24">
      <Container>
        <FadeIn>
          <div className="mb-10 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-teal sm:text-xs">
                {eyebrow}
              </p>
              <h2 className="font-serif text-[1.75rem] font-normal leading-[1.15] text-navy sm:text-[2rem] lg:text-[2.35rem]">
                {headline}
              </h2>
              <div className="mt-4 flex h-1 w-16 overflow-hidden rounded-full" aria-hidden="true">
                <span className="h-full w-1/2 bg-teal" />
                <span className="h-full w-1/2 bg-orange" />
              </div>
            </div>

            <Link
              to={ctaUrl}
              className="group inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-navy transition-colors hover:text-teal"
            >
              {ctaText}
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 bg-white text-sm transition-all group-hover:border-teal/30 group-hover:bg-teal group-hover:text-white"
              >
                →
              </span>
            </Link>
          </div>
        </FadeIn>

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <FadeIn className="lg:col-span-7">
            <Link to={`/insights/${lead.slug}`} className="group block h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-card transition-shadow duration-300 hover:shadow-elevated lg:rounded-[1.75rem]">
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
                  <LazyImage
                    src={lead.thumbnail_url ?? lead.featured_image_url}
                    alt={lead.title}
                    fill
                    wrapperClassName="absolute inset-0 size-full"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                  {lead.category && (
                    <span
                      className={cn(
                        'absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm',
                        leadTone.pill,
                      )}
                    >
                      {lead.category.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
                  {lead.published_at && (
                    <time
                      dateTime={lead.published_at}
                      className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/45"
                    >
                      {formatDate(lead.published_at)}
                    </time>
                  )}
                  <h3 className="mt-3 font-serif text-2xl font-normal leading-snug text-navy transition-colors group-hover:text-teal sm:text-[1.65rem] lg:text-[1.85rem]">
                    {lead.title}
                  </h3>
                  {lead.excerpt && (
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-navy/65 sm:text-[0.9375rem]">
                      {lead.excerpt}
                    </p>
                  )}
                  <span
                    className={cn(
                      'mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em]',
                      leadTone.link,
                    )}
                  >
                    Read article
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </article>
            </Link>
          </FadeIn>

          <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
            {rest.map((post, index) => {
              const tone = toneStyles(post.category?.name)
              const number = String(index + 2).padStart(2, '0')

              return (
                <FadeIn key={post.uuid} delay={(index + 1) * 100}>
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
                        src={post.thumbnail_url ?? post.featured_image_url}
                        alt={post.title}
                        wrapperClassName="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28 sm:rounded-2xl"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="relative flex min-w-0 flex-1 flex-col pr-8 sm:pr-10">
                        <span className={cn('mb-3 h-0.5 w-8 rounded-full', tone.bar)} aria-hidden />
                        {post.category && (
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy/50">
                            {post.category.name}
                          </p>
                        )}
                        <h3 className="mt-1 line-clamp-3 font-serif text-lg font-normal leading-snug text-navy transition-colors group-hover:text-teal">
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
                </FadeIn>
              )
            })}

            <FadeIn delay={300}>
              <Link
                to={ctaUrl}
                className="group flex flex-1 flex-col justify-between rounded-[1.25rem] bg-navy p-5 text-white transition-colors hover:bg-navy/95 sm:rounded-[1.5rem] sm:p-6"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal">
                    Explore more
                  </p>
                  <p className="mt-2 font-serif text-xl font-normal leading-snug text-white/90">
                    Strategy, marketing, and media insights for sustainable tourism.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-orange">
                  {ctaText}
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  )
}
