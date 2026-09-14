import type { CSSProperties } from 'react'
import { LazyImage } from '@/components/ui/LazyImage'
import { cn } from '@/lib/utils'

interface ServiceHeroImageProps {
  src: string
  alt: string
  fit?: 'cover' | 'contain'
  imageClassName?: string
  imageWrapperClassName?: string
  gradientClassName?: string
  gradientStyle?: CSSProperties
  hideGradient?: boolean
}

const DEFAULT_GRADIENT_CLASS =
  'bg-gradient-to-r from-cream from-0% via-cream/92 via-6% via-cream/20 via-14% to-transparent to-28%'

export function ServiceHeroImage({
  src,
  alt,
  fit = 'cover',
  imageClassName,
  imageWrapperClassName,
  gradientClassName,
  gradientStyle,
  hideGradient = false,
}: ServiceHeroImageProps) {
  const gradient = !hideGradient ? (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-10',
        !gradientStyle && (gradientClassName ?? DEFAULT_GRADIENT_CLASS),
      )}
      style={gradientStyle}
      aria-hidden
    />
  ) : null

  if (fit === 'contain') {
    return (
      <div className="relative h-full min-h-[inherit] w-full overflow-hidden bg-cream">
        <div className={cn('flex h-full w-full justify-end bg-cream', imageWrapperClassName)}>
          <LazyImage
            src={src}
            alt={alt}
            wrapperClassName="flex h-full max-w-full bg-cream"
            className={cn('h-full w-auto max-w-full object-contain object-right-top', imageClassName)}
          />
        </div>
        {gradient}
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[inherit] w-full overflow-hidden bg-cream">
      <div className={cn('absolute inset-0 bg-cream', imageWrapperClassName)}>
        <LazyImage
          src={src}
          alt={alt}
          fill
          wrapperClassName="absolute inset-0 size-full bg-cream"
          className={cn(
            'min-h-full min-w-full scale-[1.02] object-cover object-left-top',
            imageClassName,
          )}
        />
      </div>
      {gradient}
    </div>
  )
}
