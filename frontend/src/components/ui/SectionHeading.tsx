import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  accent?: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'default' | 'landing'
  accentUnderline?: 'bar' | 'squiggle'
  /** Typeface of the accent word in the default tone (replaces the handwritten default). */
  accentClassName?: string
  eyebrowClassName?: string
  className?: string
  children?: ReactNode
}

/** Draws the underline once the heading scrolls into view; drawn immediately for reduced motion. */
function useDrawOnView<T extends Element>() {
  const ref = useRef<T>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDrawn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return { ref, drawn }
}

function SquiggleAccent({ accent }: { accent: string }) {
  const [first, ...rest] = accent.split(' ')
  const { ref, drawn } = useDrawOnView<HTMLSpanElement>()

  return (
    <span className="text-teal">
      <span ref={ref} className="relative inline-block">
        {first}
        <svg
          className={cn('accent-squiggle', drawn && 'is-drawn')}
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="accent-squiggle__path" d="M2,2 L98,2" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
      {rest.length > 0 && ` ${rest.join(' ')}`}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  tone = 'default',
  accentUnderline = 'bar',
  accentClassName,
  eyebrowClassName,
  className,
  children,
}: SectionHeadingProps) {
  const isLanding = tone === 'landing'
  const isSquiggle = accentUnderline === 'squiggle'

  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' && 'mx-auto max-w-4xl text-center xl:max-w-5xl',
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-3 font-bold uppercase text-teal',
            isLanding
              ? 'text-[11px] tracking-[0.18em] sm:text-xs'
              : 'text-sm tracking-[0.2em]',
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      )}

      {isLanding ? (
        <>
          <h2 className="font-serif text-[1.85rem] font-normal leading-[1.15] text-balance text-navy sm:text-[2.15rem] lg:text-[2.5rem] xl:text-[2.65rem]">
            {title}
            {accent && (
              <>
                {' '}
                {isSquiggle ? <SquiggleAccent accent={accent} /> : <span className="text-teal">{accent}</span>}
              </>
            )}
          </h2>
          {accent && !isSquiggle && (
            <div
              className={cn(
                'mt-4 flex h-1 w-16 overflow-hidden rounded-full',
                align === 'center' && 'mx-auto',
              )}
              aria-hidden="true"
            >
              <span className="h-full w-1/2 bg-teal" />
              <span className="h-full w-1/2 bg-orange" />
            </div>
          )}
        </>
      ) : (
        <h2 className="text-[1.75rem] font-bold leading-tight text-balance sm:text-3xl md:text-4xl lg:text-5xl">
          {title}
          {accent && (
            <>
              {' '}
              <span className={cn(accentClassName ?? 'font-display font-normal', 'text-teal')}>{accent}</span>
            </>
          )}
        </h2>
      )}

      {description && (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed text-navy/70 sm:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
