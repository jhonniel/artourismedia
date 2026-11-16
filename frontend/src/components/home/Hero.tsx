import { Link } from 'react-router-dom'
import { useRef, useState, type ReactNode, type RefObject } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'
import {
  HERO_SLIDE_INTERVAL_MS,
  HERO_SLIDESHOW_IMAGES,
  HeroSlideshow,
  type HeroSlideshowHandle,
} from '@/components/home/HeroSlideshow'
import {
  HERO_FRAME_MASK,
  HERO_MOBILE_MASK,
  HeroBottomWaves,
  HeroFrameEdge,
  HeroFrameShadow,
  HeroMobileEdge,
  HeroMobileShadow,
  HeroScenery,
} from '@/components/home/HomeScenery'
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
        <h1 className="hero-headline-landing break-words font-serif font-normal tracking-[-0.02em] text-balance">
          {content.headline_prefix && <span className="block text-navy">{content.headline_prefix}</span>}
          {content.headline_highlight && <span className="block text-navy">{content.headline_highlight}</span>}
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

const HERO_PHOTO_CREDIT = 'Photo by: JC Molina'

function HeroPhotoCredit({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'hero-photo-credit pointer-events-none z-20',
        className,
      )}
      aria-label={`Photography credit: ${HERO_PHOTO_CREDIT}`}
    >
      {HERO_PHOTO_CREDIT}
    </p>
  )
}

const HERO_SLIDE_TOTAL = HERO_SLIDESHOW_IMAGES.length

function formatSlideNumber(value: number): string {
  return String(value).padStart(2, '0')
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={cn('h-3.5 w-3.5', direction === 'left' && 'rotate-180')}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}

function HeroSlideControls({
  index,
  controlRef,
}: {
  index: number
  controlRef: RefObject<HeroSlideshowHandle | null>
}) {
  if (HERO_SLIDE_TOTAL <= 1) return null

  return (
    <div className="hero-slide-controls" aria-label="Hero slideshow controls">
      <p className="hero-slide-controls__count" aria-live="polite">
        <span className="text-navy">{formatSlideNumber(index + 1)}</span>
        <span className="text-navy/40"> / {formatSlideNumber(HERO_SLIDE_TOTAL)}</span>
      </p>
      <span className="hero-slide-controls__track" aria-hidden="true">
        <span
          key={index}
          className="hero-slide-controls__fill"
          style={{ animationDuration: `${HERO_SLIDE_INTERVAL_MS}ms` }}
        />
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="hero-slide-controls__button"
          onClick={() => controlRef.current?.prev()}
          aria-label="Previous photo"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          className="hero-slide-controls__button"
          onClick={() => controlRef.current?.next()}
          aria-label="Next photo"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  )
}

function LandingHero({ content }: { content: HeroContent }) {
  const mobileSlides = useRef<HeroSlideshowHandle>(null)
  const desktopSlides = useRef<HeroSlideshowHandle>(null)
  const [mobileIndex, setMobileIndex] = useState(0)
  const [desktopIndex, setDesktopIndex] = useState(0)

  return (
    <section className="hero-offset-full hero-landing relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-clip">
      {/* Mobile — photo with a wave edge, copy below */}
      <div className="hero-landing-mobile lg:hidden relative flex min-h-0 flex-1 flex-col">
        <div className="hero-mobile-stack flex min-h-0 flex-1 flex-col">
          <div className="hero-mobile-photo-wrap">
            <HeroMobileShadow />
            <div
              aria-hidden
              className="hero-mobile-photo"
              style={{ WebkitMaskImage: HERO_MOBILE_MASK, maskImage: HERO_MOBILE_MASK }}
            >
              <HeroSlideshow
                className="hero-mobile-slideshow absolute inset-0 z-0 size-full"
                imageClassName="object-cover"
                controlRef={mobileSlides}
                onIndexChange={setMobileIndex}
              />
              <HeroMobileEdge />
            </div>
            <HeroPhotoCredit className="hero-photo-credit--mobile" />
          </div>

          <Container className="hero-mobile-copy-wrap min-w-0 max-w-full">
            <FadeIn className="hero-copy min-w-0 max-w-full">
              <HeroContentBlock
                content={content}
                variant="landing"
                controls={<HeroSlideControls index={mobileIndex} controlRef={mobileSlides} />}
              />
            </FadeIn>
          </Container>
        </div>
        <HeroBottomWaves className="hero-waves--mobile" />
      </div>

      {/* Desktop — photo in an organic wave frame beside the copy */}
      <div className="hero-shell hero-landing-shell hidden min-h-0 flex-1 lg:block">
        <HeroScenery />

        <div className="hero-stage">
          <HeroFrameShadow />
          <div className="hero-frame" style={{ WebkitMaskImage: HERO_FRAME_MASK, maskImage: HERO_FRAME_MASK }}>
            <HeroSlideshow
              className="hero-frame__slideshow absolute inset-0 z-0 h-full w-full"
              imageClassName="object-cover"
              controlRef={desktopSlides}
              onIndexChange={setDesktopIndex}
            />
            <HeroPhotoCredit className="hero-frame__credit" />
            <HeroFrameEdge />
          </div>
        </div>

        <HeroBottomWaves variant="ribbon" />

        <FadeIn className="hero-copy hero-landing-copy relative z-10 flex flex-col justify-center">
          <HeroContentBlock
            content={content}
            variant="landing"
            controls={<HeroSlideControls index={desktopIndex} controlRef={desktopSlides} />}
          />
        </FadeIn>
      </div>
    </section>
  )
}

function HeroContentBlock({
  content,
  variant = 'default',
  showDecorations = false,
  controls,
}: {
  content: HeroContent
  variant?: 'default' | 'landing'
  showDecorations?: boolean
  controls?: ReactNode
}) {
  const isLanding = variant === 'landing'
  const landingButtonClass =
    'hero-btn-landing px-4 py-2.5 text-[0.6875rem] uppercase tracking-[0.1em] sm:px-5 sm:py-2.5 lg:px-5 lg:py-2.5'
  const buttonClass = cn(
    isLanding ? landingButtonClass : 'px-7 uppercase tracking-[0.12em] sm:px-8 lg:px-9 lg:py-4 text-[10px] sm:text-[11px] md:text-xs',
  )

  const eyebrow = isLanding ? content.eyebrow ?? content.badge_text : content.eyebrow

  return (
    <>
      {eyebrow && (
        <p
          className={cn(
            'font-bold uppercase text-teal',
            isLanding
              ? 'hero-eyebrow-landing mb-3 sm:mb-4'
              : 'mb-3 text-[10px] tracking-[0.2em] sm:text-[11px]',
          )}
        >
          {eyebrow}
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
              ? 'hero-subhead-landing mt-3 max-w-[26rem] text-navy sm:mt-4 lg:mt-5 xl:max-w-[28rem]'
              : 'mt-4 max-w-[21rem] text-sm leading-[1.6] text-navy/70 sm:mt-5 md:text-[15px] lg:max-w-[23rem]',
          )}
        >
          {content.subheadline}
        </p>
      )}

      {(content.cta_text || content.secondary_cta_text) && (
        <div
          className={cn(
            'relative flex w-full flex-row flex-wrap items-center gap-2.5',
            isLanding ? 'hero-landing-actions mt-5 sm:mt-6 lg:mt-7' : 'mt-6 sm:mt-7 md:mt-8',
          )}
        >
          {content.cta_text && content.cta_url && (
            <HeroLinkButton
              href={content.cta_url}
              external={content.cta_url.startsWith('http')}
              className="inline-flex w-fit max-w-full"
            >
              <Button variant="primary" size={isLanding ? 'md' : 'lg'} className={buttonClass}>
                {content.cta_text} →
              </Button>
            </HeroLinkButton>
          )}

          {content.secondary_cta_text && content.secondary_cta_url && (
            <HeroLinkButton
              href={content.secondary_cta_url}
              external={content.secondary_cta_url.startsWith('http')}
              className="inline-flex w-fit max-w-full"
            >
              {isLanding ? (
                <Button
                  variant="outline"
                  size="md"
                  className={cn(landingButtonClass, 'hero-btn-outline font-bold')}
                >
                  {content.secondary_cta_text}
                </Button>
              ) : (
                <Button variant="outline" size="sm" className={cn(buttonClass, 'font-bold')}>
                  {content.secondary_cta_text}
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-navy/15 bg-white">
                    <svg viewBox="0 0 24 24" className="ml-px h-2 w-2 fill-current" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </Button>
              )}
            </HeroLinkButton>
          )}
        </div>
      )}

      {controls}
    </>
  )
}

export function Hero({ section }: HeroProps) {
  const content = parseContent<HeroContent>(section.content)

  return (
    <LandingHero content={content} />
  )
}
