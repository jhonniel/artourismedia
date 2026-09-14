import type { CSSProperties } from 'react'
import { LazyImage } from '@/components/ui/LazyImage'
import { cn } from '@/lib/utils'

interface ServiceHeroImageProps {
  src: string
  alt: string
  fit?: 'cover' | 'contain'
  surface?: 'cream' | 'white'
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
  surface = 'cream',
  imageClassName,
  imageWrapperClassName,
  gradientClassName,
  gradientStyle,
  hideGradient = false,
}: ServiceHeroImageProps) {
  const surfaceClass = surface === 'white' ? 'bg-transparent' : 'bg-cream'
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
      <div className={cn('relative h-full min-h-[inherit] w-full overflow-hidden', surfaceClass)}>
        <div className={cn('flex h-full w-full justify-end', surfaceClass, imageWrapperClassName)}>
          <LazyImage
            src={src}
            alt={alt}
            wrapperClassName={cn('flex h-full max-w-full', surfaceClass)}
            className={cn('h-full w-auto max-w-full object-contain object-right-top', imageClassName)}
          />
        </div>
        {gradient}
      </div>
    )
  }

  return (
    <div className={cn('relative h-full min-h-[inherit] w-full overflow-hidden', surfaceClass)}>
      <div className={cn('absolute inset-0', surfaceClass, imageWrapperClassName)}>
        <LazyImage
          src={src}
          alt={alt}
          fill
          wrapperClassName={cn('absolute inset-0 size-full', surfaceClass)}
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
