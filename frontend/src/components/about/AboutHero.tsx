import { LazyImage } from '@/components/ui/LazyImage'
import { Container } from '@/components/ui/Container'
import type { AboutPageMetadata } from '@/types'

interface AboutHeroProps {
  metadata: Pick<
    AboutPageMetadata,
    'eyebrow' | 'headline' | 'intro' | 'portrait_url' | 'signature_name' | 'signature_title' | 'quote'
  >
}

function AboutHeroHeadline({ headline }: { headline: string }) {
  const headlineClassName =
    'about-hero__headline font-about-headline text-[2.125rem] sm:text-[2.45rem] lg:text-[2.75rem] xl:text-[3.05rem]'

  const builtMatch = headline.match(/^(.*?\bBuilt)\s+(Around\s+)(Tourism)\s*$/i)

  if (builtMatch) {
    const [, lineOne, around, tourism] = builtMatch

    return (
      <h1 className={headlineClassName}>
        <span className="about-hero__headline-line">{lineOne.trim()}</span>
        <span className="about-hero__headline-line mt-0.5 sm:mt-1">
          {around.trim()}{' '}
          <span className="about-hero__headline-accent">{tourism}</span>
        </span>
      </h1>
    )
  }

  const tourismMatch = headline.match(/^(.*?)(Tourism)\s*$/i)

  if (tourismMatch) {
    const [, prefix, accent] = tourismMatch

    return (
      <h1 className={headlineClassName}>
        <span className="about-hero__headline-line">{prefix.trim()}</span>
        <span className="about-hero__headline-accent">{accent}</span>
      </h1>
    )
  }

  return <h1 className={headlineClassName}>{headline}</h1>
}

function AboutDotGrid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 90 90" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={9 + col * 18}
            cy={9 + row * 18}
            r="2.35"
            fill="#A2D2DF"
          />
        )),
      )}
    </svg>
  )
}

export function AboutHero({ metadata }: AboutHeroProps) {
  const portraitAlt = metadata.signature_name ?? 'Art Boncato'

  return (
    <section className="about-hero relative bg-white pb-10 pt-8 sm:pb-12 sm:pt-10 md:pb-14 md:pt-12 lg:pt-14">
      <Container className="relative">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-center md:gap-8 lg:gap-12">
          <div className="min-w-0">
            {metadata.eyebrow && <p className="about-hero__eyebrow">{metadata.eyebrow}</p>}
            {metadata.headline && (
              <div className="mt-3 sm:mt-4">
                <AboutHeroHeadline headline={metadata.headline} />
              </div>
            )}
            {metadata.intro && <p className="about-hero__intro mt-4 sm:mt-5">{metadata.intro}</p>}
          </div>

          <div className="about-hero__card relative min-w-0">
            <AboutDotGrid className="about-hero__dot-grid pointer-events-none absolute right-0 top-0 z-[2] h-[4.25rem] w-[4.25rem] sm:h-[4.75rem] sm:w-[4.75rem]" />

            <div className="about-hero__card-body">
              {metadata.portrait_url && (
                <div className="about-hero__portrait-col">
                  <LazyImage
                    src={metadata.portrait_url}
                    alt={portraitAlt}
                    priority
                    wrapperClassName="about-hero__portrait-card-image !overflow-visible !bg-transparent"
                    className="!block !h-auto !w-full !object-contain"
                  />
                </div>
              )}

              <div className="about-hero__card-content">
                <div className="about-hero__identity-header pr-[4.5rem] sm:pr-[5rem]">
                  {metadata.signature_name && (
                    <p className="about-hero__signature-name font-display text-[1.9rem] leading-[0.9] sm:text-[2.15rem] lg:text-[2.45rem] xl:text-[2.65rem]">
                      {metadata.signature_name}
                    </p>
                  )}
                  {metadata.signature_title && (
                    <p className="about-hero__signature-title mt-1.5 sm:mt-2">
                      {metadata.signature_title}
                    </p>
                  )}
                </div>

                {metadata.quote && (
                  <blockquote className="about-hero__quote-card relative mt-4 sm:mt-5 lg:mt-6">
                    <span
                      className="about-hero__quote-mark text-[2.75rem] leading-none sm:text-[3.25rem]"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>
                    <p className="about-hero__quote-text relative -mt-3 sm:-mt-4">
                      {metadata.quote}
                    </p>
                    <div className="about-hero__quote-accent mt-3 sm:mt-4" aria-hidden="true" />
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
