import { useEffect, useState } from 'react'
import { assetUrl } from '@/lib/assets'
import { cn } from '@/lib/utils'

/** Tourism showcase photos — crossfades on the landing hero (hosted on Spaces). */
const HERO_SLIDESHOW_PATHS = [
  '/images/hero/hero-slideshow-01-pamulak.jpg',
  '/images/hero/hero-slideshow-03-mountain-valley.jpg',
  '/images/hero/hero-slideshow-04-sunken-cemetery.jpg',
  '/images/hero/hero-slideshow-05-maranao-dance.jpg',
  '/images/hero/hero-slideshow-06-sugba-lagoon.jpg',
  '/images/hero/hero-slideshow-07-grand-mosque.jpg',
  '/images/hero/hero-slideshow-08-cold-spring.jpg',
] as const

export const HERO_SLIDESHOW_IMAGES = HERO_SLIDESHOW_PATHS.map(assetUrl)

const FADE_MS = 2200
const HOLD_MS = 4800

interface HeroSlideshowProps {
  images?: readonly string[]
  className?: string
  imageClassName?: string
}

export function HeroSlideshow({
  images = HERO_SLIDESHOW_IMAGES,
  className,
  imageClassName,
}: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (images.length <= 1 || reduceMotion) return

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, HOLD_MS + FADE_MS)

    return () => window.clearInterval(interval)
  }, [images.length, reduceMotion])

  if (images.length === 0) return null

  return (
    <div className={cn('isolate overflow-hidden', className)} aria-hidden="true">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={index <= 1 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={index === 0 ? 'high' : 'auto'}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            imageClassName,
            !reduceMotion && 'transition-opacity ease-in-out motion-reduce:transition-none',
            index === activeIndex ? 'z-[1] opacity-100' : 'z-0 opacity-0',
          )}
          style={{ transitionDuration: !reduceMotion ? `${FADE_MS}ms` : undefined }}
        />
      ))}
    </div>
  )
}
