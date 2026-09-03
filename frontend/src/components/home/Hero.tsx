import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'
import { HeroSlideshow } from '@/components/home/HeroSlideshow'
import {
  SparkleIcon,
  HeartOutlineIcon,
  AirplaneIcon,
  HeroOrangeAccent,
  HeartMountainsIcon,
} from '@/components/ui/Decorative'
import { cn, parseContent } from '@/lib/utils'
import type { HeroContent, HomepageSection } from '@/types'

interface HeroProps {
  section: HomepageSection
}

function HeroHeadline({
  content,
  variant = 'default',
}: {
  content: HeroContent
  variant?: 'default' | 'landing'
}) {
  if (content.headline_prefix || content.headline_highlight) {
    if (variant === 'landing') {
      const accentText = content.headline_accent?.endsWith('.')
        ? content.headline_accent.slice(0, -1)
        : content.headline_accent

      return (
        <h1 className="hero-headline-landing font-serif font-normal tracking-[-0.02em] text-balance">
          <span className="block text-navy">
            {content.headline_prefix} {content.headline_highlight}
          </span>
          <span className="mt-1 block text-orange sm:mt-1.5">
            {content.headline_middle ? `${content.headline_middle} ` : ''}
            {accentText}
            <span className="text-teal">.</span>
          </span>
        </h1>
      )
    }

    return (
      <h1 className="hero-headline font-display text-[2rem] font-bold leading-[0.92] tracking-[-0.01em] sm:text-[2.65rem] lg:text-[3rem] xl:text-[3.2rem]">
        <span className="relative block text-navy">
          {content.headline_prefix}
          <SparkleIcon className="pointer-events-none absolute -left-6 -top-6 h-8 w-8 sm:-left-7 sm:-top-7 sm:h-9 sm:w-9" />
        </span>
        <span className="mt-0.5 block text-navy">{content.headline_highlight}</span>
        <span className="mt-0.5 block text-navy">{content.headline_middle}</span>
        <span className="mt-0.5 inline-flex items-center gap-1.5 text-orange">
          <span>{content.headline_accent}</span>
          <HeartOutlineIcon className="h-[0.85em] w-[0.85em] shrink-0 translate-y-[0.04em] rotate-6" />
        </span>
      </h1>
    )
  }

  return (
    <h1 className="hero-headline font-display text-4xl font-bold leading-[0.92] text-balance sm:text-5xl text-navy">
      {content.headline}
    </h1>
  )
}

function StrategyImpactBadge({ text }: { text: string }) {
  const match = text.match(/^(Turning\s+Strategy)\s+(into)\s+(.+)$/i)

  return (
    <div className="absolute bottom-[8%] right-[4%] z-20 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-full bg-navy px-4 py-2.5 text-white shadow-elevated sm:gap-3.5 sm:px-5 sm:py-3 lg:bottom-[10%] lg:right-[5%]">
      <HeartMountainsIcon className="h-9 w-9 shrink-0 text-white sm:h-10 sm:w-10" />

      {match ? (
        <div className="min-w-0 font-serif text-[13px] leading-[1.15] sm:text-[14px]">
          <span className="block whitespace-nowrap">{match[1]}</span>
          <span className="mt-0.5 block whitespace-nowrap">
            <span className="relative inline-block">
              {match[2]}
              <span
                className="absolute -bottom-0.5 left-0 h-[3px] w-full rounded-full bg-orange"
                aria-hidden="true"
              />
            </span>{' '}
            {match[3]}
          </span>
        </div>
      ) : (
        <p className="font-serif text-[13px] leading-snug sm:text-[14px]">{text}</p>
      )}
    </div>
  )
}

function HeroLinkButton({
  href,
  external,
  children,
  className,
}: {
  href: string
  external?: boolean
  children: ReactNode
  className?: string
}) {
  if (external) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

function LandingHero({ content }: { content: HeroContent }) {
  return (
    <section className="hero-offset relative w-full overflow-x-clip bg-white">
      {/* Mobile — image fades into overlapping text */}
      <div className="lg:hidden bg-white">
        <div className="hero-mobile-stack relative">
          <div className="hero-mobile-media relative w-full overflow-hidden">
            <HeroSlideshow
              className="hero-mobile-slideshow absolute inset-0 z-0 size-full"
              imageClassName="object-cover object-[center_35%]"
            />
          </div>

          <Container className="hero-mobile-copy-wrap pb-2">
            <FadeIn className="hero-copy hero-mobile-copy pb-6">
              <HeroContentBlock content={content} variant="landing" />
            </FadeIn>
          </Container>
        </div>
      </div>

      {/* Desktop — full-bleed image with soft left fade (no hard 50/50 column split) */}
      <div className="hero-shell hero-landing-shell hidden lg:block">
        <div className="hero-media hero-landing-media">
          <HeroSlideshow
            className="absolute inset-0 z-0 h-full w-full"
            imageClassName="object-cover object-[68%_center]"
          />
          <div aria-hidden className="hero-landing-gradient-overlay pointer-events-none" />
          {content.badge_text && <StrategyImpactBadge text={content.badge_text} />}
          <HeroOrangeAccent className="pointer-events-none absolute -bottom-1 right-0 z-[2] h-32 w-40 xl:h-36 xl:w-48" />
        </div>

        <FadeIn className="hero-copy hero-landing-copy relative z-10 flex flex-col justify-center py-10 xl:py-12">
          <HeroContentBlock content={content} variant="landing" />
        </FadeIn>
      </div>
    </section>
  )
}

function HeroContentBlock({
  content,
  variant = 'default',
  showDecorations = false,
}: {
  content: HeroContent
  variant?: 'default' | 'landing'
  showDecorations?: boolean
}) {
  const isLanding = variant === 'landing'
  const buttonClass = cn(
    'px-6 uppercase tracking-[0.12em] sm:px-7',
    isLanding
      ? 'hero-btn-landing'
      : 'text-[10px] sm:text-[11px] md:text-xs',
  )

  return (
    <>
      {content.eyebrow && !isLanding && (
        <p
          className={cn(
            'mb-3 font-bold uppercase tracking-[0.2em] text-teal',
            isLanding
              ? 'hero-eyebrow-landing'
              : 'text-[10px] sm:text-[11px]',
          )}
        >
          {content.eyebrow}
        </p>
      )}

      <HeroHeadline content={content} variant={variant} />

      {showDecorations && !content.eyebrow && (
        <AirplaneIcon className="pointer-events-none absolute left-[68%] top-[10%] hidden w-36 opacity-80 lg:block xl:left-[78%] xl:w-44" />
      )}

      {content.subheadline && (
        <p
          className={cn(
            isLanding
              ? 'hero-subhead-landing mt-4 w-full max-w-none text-navy/80 sm:mt-[1.125rem]'
              : 'mt-4 max-w-[21rem] text-sm leading-[1.6] text-navy/70 sm:mt-5 md:text-[15px] lg:max-w-[23rem]',
          )}
        >
          {content.subheadline}
        </p>
      )}

      {(content.cta_text || content.secondary_cta_text) && (
        <div className={cn('relative flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center', isLanding ? 'mt-5 sm:mt-6' : 'mt-6 sm:mt-7 md:mt-8')}>
          {content.cta_text && content.cta_url && (
            <HeroLinkButton
              href={content.cta_url}
              external={content.cta_url.startsWith('http')}
              className="inline-flex"
            >
              <Button variant="primary" size="lg" className={buttonClass}>
                {content.cta_text} →
              </Button>
            </HeroLinkButton>
          )}

          {content.secondary_cta_text && content.secondary_cta_url && (
            <HeroLinkButton
              href={content.secondary_cta_url}
              external={content.secondary_cta_url.startsWith('http')}
              className="hero-btn-landing inline-flex items-center gap-3 rounded-full border border-navy/15 bg-white px-4 py-2.5 font-bold uppercase tracking-[0.12em] text-navy transition-colors hover:border-teal hover:text-teal sm:px-5"
            >
              {content.secondary_cta_text}
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/15 bg-white">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-3 w-3 fill-navy" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </HeroLinkButton>
          )}
        </div>
      )}
    </>
  )
}

export function Hero({ section }: HeroProps) {
  const content = parseContent<HeroContent>(section.content)

  return (
    <LandingHero content={content} />
  )
}
