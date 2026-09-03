import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { Badge } from '@/components/ui/Badge'
import { LazyImage } from '@/components/ui/LazyImage'
import { Button } from '@/components/ui/Button'
import type { HomepageSection, Post } from '@/types'
import { cn } from '@/lib/utils'

interface LatestInsightsProps {
  section: HomepageSection
  posts: Post[]
}

const CATEGORY_VARIANTS: Record<string, 'teal' | 'orange' | 'purple' | 'navy'> = {
  strategy: 'teal',
  marketing: 'orange',
  media: 'purple',
}

function categoryVariant(name?: string): 'teal' | 'orange' | 'purple' | 'navy' {
  if (!name) return 'teal'
  return CATEGORY_VARIANTS[name.toLowerCase()] ?? 'navy'
}

function categoryReadMoreClass(name?: string): string {
  if (!name) return 'text-orange group-hover:text-orange/80'

  const key = name.toLowerCase()
  if (key.includes('marketing')) return 'text-orange group-hover:text-orange/80'
  if (key.includes('media')) return 'text-purple group-hover:text-purple/80'
  if (key.includes('strategy')) return 'text-teal group-hover:text-teal/80'

  return 'text-orange group-hover:text-orange/80'
}

export function LatestInsights({ section, posts }: LatestInsightsProps) {
  const sorted = [...posts].slice(0, 3)
  const ctaText = (section.content.cta_text as string) ?? 'View All Insights'
  const ctaUrl = (section.content.cta_url as string) ?? '/insights'

  if (sorted.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <FadeIn>
          <h2 className="mb-10 text-[11px] font-bold uppercase tracking-[0.18em] text-teal sm:mb-12 sm:text-xs">
            {section.title ?? 'Latest Insights'}
          </h2>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((post, index) => {
            const variant = categoryVariant(post.category?.name)
            const readMoreClass = categoryReadMoreClass(post.category?.name)

            return (
              <FadeIn key={post.uuid} delay={index * 100}>
                <Link to={`/insights/${post.slug}`} className="group block h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-navy/5 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated sm:rounded-[1.5rem]">
                    <LazyImage
                      src={post.thumbnail_url ?? post.featured_image_url}
                      alt={post.title}
                      wrapperClassName="aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:h-36 xl:h-40"
                      className="h-full w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      {post.category && (
                        <Badge variant={variant} className="mb-3 w-fit">
                          {post.category.name}
                        </Badge>
                      )}
                      <h3 className="font-serif text-lg font-normal leading-snug text-navy transition-colors group-hover:text-teal">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/60 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <span className={cn('mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em]', readMoreClass)}>
                        Read more
                        <span aria-hidden>→</span>
                      </span>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            )
          })}

          <FadeIn delay={300}>
            <div className="flex h-full min-h-[16rem] flex-col justify-between rounded-[1.25rem] border-2 border-teal/25 bg-teal/5 p-5 sm:min-h-[18rem] sm:rounded-[1.5rem] sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
                  More Insights
                </p>
                <p className="mt-3 text-sm leading-relaxed text-navy/70 sm:mt-4">
                  Explore articles on strategy, marketing, and storytelling for sustainable tourism growth.
                </p>
              </div>
              <Link to={ctaUrl} className="mt-5 inline-flex sm:mt-6">
                <Button size="lg" className="w-full px-6 text-xs uppercase tracking-[0.1em]">
                  {ctaText} →
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
