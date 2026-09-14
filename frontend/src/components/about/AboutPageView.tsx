import { Link } from 'react-router-dom'
import { HeroSlideshow } from '@/components/home/HeroSlideshow'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { RichContent } from '@/components/ui/RichContent'
import { AboutHero } from '@/components/about/AboutHero'
import { LeadershipRoleIcon } from '@/components/about/LeadershipRoleIcon'
import { MindanaoBrand } from '@/components/about/MindanaoBrand'
import {
  ServiceIcon,
  serviceIconImageClass,
  serviceIconWrapperClass,
} from '@/components/icons/ServiceIcons'
import type { AboutPageMetadata } from '@/types'

interface AboutPageViewProps {
  metadata: AboutPageMetadata
}

export function AboutPageView({ metadata }: AboutPageViewProps) {
  return (
    <div className="bg-white">
      <AboutHero metadata={metadata} />

      {/* Career + Leadership */}
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-12">
            <FadeIn>
              <div>
                {metadata.career_heading && (
                  <h2 className="text-2xl font-bold text-navy sm:text-3xl">{metadata.career_heading}</h2>
                )}
                {metadata.career_body && (
                  <RichContent
                    html={metadata.career_body}
                    className="prose-content mt-6 space-y-4 text-base leading-relaxed text-navy/75 sm:text-lg"
                  />
                )}
              </div>
            </FadeIn>

            {metadata.leadership && metadata.leadership.length > 0 && (
              <FadeIn delay={80}>
                <div className="rounded-[1.25rem] border-2 border-orange/30 bg-orange/[0.16] p-6 shadow-card sm:rounded-[1.5rem] sm:p-7 lg:shadow-elevated">
                  <div>
                    <h3 className="text-lg font-bold text-navy sm:text-xl">
                      Leadership experience in the past decades
                    </h3>
                    <div className="mt-3 h-1 w-12 rounded-full bg-orange" aria-hidden="true" />
                  </div>
                  <ul className="mt-6 space-y-5">
                    {metadata.leadership.map((item) => (
                      <li key={`${item.title}-${item.organization}`} className="flex items-start gap-4">
                        <LeadershipRoleIcon item={item} />
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="font-semibold leading-snug text-navy">{item.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-navy/60">{item.organization}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            )}
          </div>
        </Container>
      </section>

      {/* Expertise */}
      {metadata.expertise && metadata.expertise.length > 0 && (
        <section className="bg-white py-12 md:py-16 lg:py-20">
          <Container>
            <FadeIn>
              <div className="max-w-2xl">
                {metadata.expertise_heading && (
                  <h2 className="text-2xl font-bold text-navy sm:text-3xl">{metadata.expertise_heading}</h2>
                )}
                {metadata.expertise_description && (
                  <p className="mt-3 text-base leading-relaxed text-navy/70">{metadata.expertise_description}</p>
                )}
              </div>
            </FadeIn>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {metadata.expertise.map((item, index) => (
                <FadeIn key={item.title} delay={index * 60}>
                  <Link
                    to={item.slug ? `/services/${item.slug}` : '/services'}
                    className="group flex h-full flex-col rounded-[1.25rem] border border-navy/8 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
                  >
                    <div className={serviceIconWrapperClass(item.slug, item.slug, 'card')}>
                      <ServiceIcon
                        slug={item.slug}
                        icon={item.slug}
                        className={serviceIconImageClass(item.slug, item.slug, 'card')}
                      />
                    </div>
                    <h3 className="mt-4 text-base font-bold leading-snug text-navy transition-colors group-hover:text-teal">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">{item.description}</p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Mindanao closing */}
      <section className="border-t border-navy/8 bg-white py-12 md:py-16">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)_10.5rem] lg:items-center lg:gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_12rem] xl:gap-10">
            <FadeIn className="isolate min-w-0 lg:self-center">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-card"
                role="img"
                aria-label="Mindanao landscapes"
              >
                <HeroSlideshow className="absolute inset-0 size-full" />
              </div>
            </FadeIn>

            <FadeIn delay={60} className="isolate min-w-0 overflow-hidden lg:self-center">
              <div>
                {metadata.closing_eyebrow && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">{metadata.closing_eyebrow}</p>
                )}
                {metadata.closing_heading && (
                  <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">{metadata.closing_heading}</h2>
                )}
                {metadata.closing_body && (
                  <p className="mt-4 text-base leading-relaxed text-navy/75">{metadata.closing_body}</p>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={120} className="isolate lg:self-end">
              <MindanaoBrand
                size="compact"
                centeredOnMobile
                className="mx-auto max-w-[14rem] lg:mx-0 lg:ml-auto xl:max-w-[16rem]"
              />
            </FadeIn>
          </div>
        </Container>
      </section>
    </div>
  )
}
