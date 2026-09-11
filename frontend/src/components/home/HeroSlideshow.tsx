import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { localFirstAssetUrl } from '@/lib/assets'
import { cn } from '@/lib/utils'
import { HERO_SLIDESHOW_PATHS } from '@/data/heroSlideshow'

export const HERO_SLIDESHOW_IMAGES = HERO_SLIDESHOW_PATHS.map(localFirstAssetUrl)

const FADE_MS = 1800
const HOLD_MS = 5200
const FADE_EASING = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'

interface HeroSlideshowProps {
  images?: readonly string[]
  className?: string
  imageClassName?: string
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    const finish = () => resolve()
    img.onload = finish
    img.onerror = finish
    img.src = src
  })
}

export function HeroSlideshow({
  images = HERO_SLIDESHOW_IMAGES,
  className,
  imageClassName,
}: HeroSlideshowProps) {
  const resolvedImages = useMemo(
    () => images.map((src) => (src.startsWith('/') ? localFirstAssetUrl(src) : src)),
    [images],
  )

  const [reduceMotion, setReduceMotion] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [topLayer, setTopLayer] = useState<0 | 1>(0)
  const [layerSources, setLayerSources] = useState<[string, string]>(() => [
    resolvedImages[0] ?? '',
    resolvedImages[1] ?? resolvedImages[0] ?? '',
  ])
  const [isFading, setIsFading] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const currentIndexRef = useRef(0)
  const topLayerRef = useRef<0 | 1>(0)
  const isTransitioningRef = useRef(false)
  const fadeFrameRef = useRef<number | null>(null)
  const fadeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    topLayerRef.current = topLayer
  }, [topLayer])

  useEffect(() => {
    if (resolvedImages.length === 0) return

    setCurrentIndex(0)
    setTopLayer(0)
    setIsFading(false)
    setRevealed(false)
    isTransitioningRef.current = false
    setLayerSources([
      resolvedImages[0]!,
      resolvedImages[1] ?? resolvedImages[0]!,
    ])
  }, [resolvedImages])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const clearFadeTimers = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current)
      fadeFrameRef.current = null
    }
    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
  }, [])

  const advanceSlide = useCallback(async () => {
    if (isTransitioningRef.current || resolvedImages.length <= 1 || reduceMotion) return

    const nextIndex = (currentIndexRef.current + 1) % resolvedImages.length
    const incomingLayer: 0 | 1 = topLayerRef.current === 0 ? 1 : 0
    const nextSrc = resolvedImages[nextIndex]!

    isTransitioningRef.current = true
    await preloadImage(nextSrc)

    setLayerSources((prev) => {
      const next: [string, string] = [...prev]
      next[incomingLayer] = nextSrc
      return next
    })
    setIsFading(true)
    setRevealed(false)

    fadeFrameRef.current = requestAnimationFrame(() => {
      fadeFrameRef.current = requestAnimationFrame(() => {
        fadeFrameRef.current = null
        setRevealed(true)
      })
    })

    fadeTimeoutRef.current = window.setTimeout(() => {
      fadeTimeoutRef.current = null
      setTopLayer(incomingLayer)
      setCurrentIndex(nextIndex)
      setIsFading(false)
      setRevealed(false)
      isTransitioningRef.current = false
    }, FADE_MS)
  }, [reduceMotion, resolvedImages])

  useEffect(() => {
    if (resolvedImages.length <= 1 || reduceMotion) return

    const interval = window.setInterval(advanceSlide, HOLD_MS + FADE_MS)
    return () => {
      window.clearInterval(interval)
      clearFadeTimers()
      isTransitioningRef.current = false
    }
  }, [advanceSlide, clearFadeTimers, reduceMotion, resolvedImages.length])

  useEffect(() => () => clearFadeTimers(), [clearFadeTimers])

  useEffect(() => {
    if (resolvedImages.length <= 1) return

    const preloadIndex = (currentIndexRef.current + 1) % resolvedImages.length
    void preloadImage(resolvedImages[preloadIndex]!)
  }, [currentIndex, resolvedImages])

  if (resolvedImages.length === 0) return null

  const incomingLayer: 0 | 1 = topLayer === 0 ? 1 : 0

  return (
    <div className={cn('isolate overflow-hidden', className)} aria-hidden="true">
      {layerSources.map((src, index) => {
        const layer = index as 0 | 1
        const isTop = layer === topLayer
        const opacity = isFading
          ? (layer === incomingLayer ? (revealed ? 1 : 0) : (revealed ? 0 : 1))
          : (isTop ? 1 : 0)

        return (
          <img
            key={layer}
            src={src}
            alt=""
            loading={isTop ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={isTop ? 'high' : 'auto'}
            className={cn(
              'absolute inset-0 h-full w-full object-cover will-change-[opacity]',
              imageClassName,
              isFading && !reduceMotion
                ? 'transition-opacity motion-reduce:transition-none'
                : 'transition-none',
            )}
            style={{
              opacity,
              zIndex: isFading ? (layer === incomingLayer ? 2 : 1) : (isTop ? 1 : 0),
              transitionDuration: isFading && !reduceMotion ? `${FADE_MS}ms` : undefined,
              transitionTimingFunction: isFading && !reduceMotion ? FADE_EASING : undefined,
            }}
          />
        )
      })}
    </div>
  )
}
