import { useEffect, useMemo, useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { buildImageFallbackChain } from '@/lib/imageFallback'

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string
}

export function LazyImage({ className, wrapperClassName, alt = '', src, ...props }: LazyImageProps) {
  const fallbackChain = useMemo(() => buildImageFallbackChain(src), [src])
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setIndex(0)
    setLoaded(false)
  }, [src])

  const currentSrc = fallbackChain[index]
  const exhausted = !currentSrc || index >= fallbackChain.length

  return (
    <div className={cn('relative overflow-hidden bg-navy/5', wrapperClassName)}>
      {!loaded && !exhausted && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-teal/10 via-cream to-orange/10" />
      )}
      {exhausted ? (
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 bg-gradient-to-br from-teal/15 via-cream to-navy/10 px-6 text-center text-navy/40">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {alt && <span className="text-xs font-medium uppercase tracking-wider">{alt}</span>}
        </div>
      ) : (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setIndex((value) => value + 1)
          }}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...props}
        />
      )}
    </div>
  )
}
