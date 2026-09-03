import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  accent?: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'default' | 'landing'
  className?: string
  children?: ReactNode
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  tone = 'default',
  className,
  children,
}: SectionHeadingProps) {
  const isLanding = tone === 'landing'

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
                <span className="text-teal">{accent}</span>
              </>
            )}
          </h2>
          {accent && (
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
              <span className="font-display font-normal text-teal">{accent}</span>
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
