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
    <section className="hero-offset relative flex min-h-0 w-full flex-col overflow-hidden bg-white">
      {/* Mobile — image + bottom fade behind copy (no seam line) */}
      <div className="hero-landing-mobile lg:hidden flex min-h-0 flex-1 flex-col bg-white">
        <div className="hero-mobile-stack relative min-h-0 flex-1 overflow-hidden">
          <div aria-hidden className="hero-mobile-photo">
            <HeroSlideshow
              className="hero-mobile-slideshow absolute inset-0 z-0 size-full"
              imageClassName="object-cover object-[center_28%]"
            />
            <div className="hero-mobile-fade pointer-events-none absolute inset-x-0 bottom-0 z-[1]" />
          </div>

          <Container className="hero-mobile-copy-wrap relative z-10 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <FadeIn className="hero-copy">
              <HeroContentBlock content={content} variant="landing" />
            </FadeIn>
          </Container>
        </div>
      </div>

      {/* Desktop — full-bleed image with soft left fade (no hard 50/50 column split) */}
      <div className="hero-shell hero-landing-shell hidden min-h-0 flex-1 lg:block">
        <div className="hero-media hero-landing-media">
          <HeroSlideshow
            className="hero-landing-slideshow absolute inset-0 z-0 h-full w-full"
            imageClassName="object-cover object-[68%_center]"
          />
          <div aria-hidden className="hero-landing-gradient-overlay pointer-events-none" />
        </div>

        <FadeIn className="hero-copy hero-landing-copy relative z-10 flex flex-col justify-center py-10 lg:py-0 xl:py-0">
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
    'px-7 uppercase tracking-[0.12em] sm:px-8 lg:px-9 lg:py-4',
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
              ? 'hero-subhead-landing mt-4 w-full max-w-none text-navy/80 sm:mt-6 lg:mt-7'
              : 'mt-4 max-w-[21rem] text-sm leading-[1.6] text-navy/70 sm:mt-5 md:text-[15px] lg:max-w-[23rem]',
          )}
        >
          {content.subheadline}
        </p>
      )}

      {(content.cta_text || content.secondary_cta_text) && (
        <div className={cn('relative flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center', isLanding ? 'mt-6 sm:mt-7 lg:mt-8' : 'mt-6 sm:mt-7 md:mt-8')}>
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
              className="hero-btn-landing inline-flex items-center gap-3 rounded-full border border-navy/15 bg-white px-5 py-3 font-bold uppercase tracking-[0.12em] text-navy transition-colors hover:border-teal hover:text-teal sm:px-6 lg:py-3.5"
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
