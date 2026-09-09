import { Link } from 'react-router-dom'
import { HeroSlideshow } from '@/components/home/HeroSlideshow'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { MindanaoBrand } from '@/components/about/MindanaoBrand'
import { localFirstAssetUrl } from '@/lib/assets'
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
      {/* Hero */}
      <section className="border-b border-navy/8 bg-cream/40 py-12 md:py-16 lg:py-20">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 xl:gap-16">
            <FadeIn>
              <div className="max-w-xl">
                {metadata.eyebrow && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange sm:text-[13px]">
                    {metadata.eyebrow}
                  </p>
                )}
                {metadata.headline && (
                  <h1 className="mt-4 text-[1.85rem] font-bold leading-[1.12] text-navy sm:text-4xl lg:text-[2.65rem] xl:text-[2.85rem]">
                    {metadata.headline}
                  </h1>
                )}
                {metadata.intro && (
                  <p className="mt-5 text-base leading-relaxed text-navy/75 sm:text-lg">{metadata.intro}</p>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <div className="relative lg:justify-self-end">
                <div
                  className="pointer-events-none absolute left-[8%] top-[4%] -z-10 h-52 w-52 rounded-full bg-orange/25 sm:left-[12%] sm:h-64 sm:w-64 lg:left-[10%] lg:h-72 lg:w-72"
                  aria-hidden="true"
                />

                <div className="grid items-end gap-8 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] sm:gap-6 lg:gap-8">
                  <div className="relative mx-auto w-full max-w-[18rem] sm:mx-0 sm:max-w-none">
                    {metadata.portrait_url && (
                      <img
                        src={localFirstAssetUrl(metadata.portrait_url)}
                        alt={metadata.signature_name ?? 'Art Boncato, Jr.'}
                        decoding="async"
                        className="mx-auto w-full max-w-[18rem] object-contain object-bottom sm:mx-0 sm:max-w-[20rem] lg:max-w-[24rem] xl:max-w-[28rem]"
                      />
                    )}
                  </div>

                  <div className="space-y-5 pb-1 sm:pb-3 lg:pb-4">
                    <div>
                      {metadata.signature_name && (
                        <p className="font-display text-[2rem] leading-none text-navy sm:text-[2.35rem] lg:text-4xl xl:text-[2.75rem]">
                          {metadata.signature_name}
                        </p>
                      )}
                      {metadata.signature_title && (
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-navy/55 sm:text-xs">
                          {metadata.signature_title}
                        </p>
                      )}
                    </div>

                    {metadata.quote && (
                      <blockquote className="rounded-[1.25rem] border border-navy/8 bg-white p-5 shadow-card sm:p-6">
                        <span className="font-display text-4xl leading-none text-navy/15" aria-hidden="true">
                          “
                        </span>
                        <p className="mt-1 text-sm leading-relaxed text-navy/80 sm:text-base">{metadata.quote}</p>
                        <div className="mt-4 h-1 w-10 rounded-full bg-orange" aria-hidden="true" />
                      </blockquote>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

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
                  <div
                    className="prose-content mt-6 space-y-4 text-base leading-relaxed text-navy/75 sm:text-lg"
                    dangerouslySetInnerHTML={{ __html: metadata.career_body }}
                  />
                )}
              </div>
            </FadeIn>

            {metadata.leadership && metadata.leadership.length > 0 && (
              <FadeIn delay={80}>
                <div className="rounded-[1.25rem] bg-cream/70 p-6 shadow-soft sm:p-7">
                  <h3 className="text-lg font-bold text-navy">Leadership Experience</h3>
                  <ul className="mt-5 space-y-4">
                    {metadata.leadership.map((item) => (
                      <li key={`${item.title}-${item.organization}`} className="flex gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-navy shadow-soft">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 21h18M6 21V7l6-4 6 4v14M10 10h4v11h-4V10z" />
                          </svg>
                        </span>
                        <div>
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
                    <div
                      className={serviceIconWrapperClass(item.slug, item.slug, 'card')}
                    >
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
      <section className="border-t border-navy/8 bg-cream/40 py-12 md:py-16">
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
