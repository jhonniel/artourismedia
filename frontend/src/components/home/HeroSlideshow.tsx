import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from 'react'
import { buildAssetFallbackChain } from '@/lib/assets'
import { cn } from '@/lib/utils'
import { HERO_SLIDESHOW_PATHS, heroSlideFocus, heroSlideShift } from '@/data/heroSlideshow'

export const HERO_SLIDESHOW_IMAGES = [...HERO_SLIDESHOW_PATHS]

const FADE_MS = 1800
const HOLD_MS = 5200
const FADE_EASING = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)'

export const HERO_SLIDE_INTERVAL_MS = HOLD_MS + FADE_MS

export interface HeroSlideshowHandle {
  next: () => void
  prev: () => void
}

interface HeroSlideshowProps {
  images?: readonly string[]
  className?: string
  imageClassName?: string
  controlRef?: Ref<HeroSlideshowHandle>
  onIndexChange?: (index: number) => void
}

interface SlideshowLayerImageProps {
  path: string
  className?: string
  style?: CSSProperties
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

function SlideshowLayerImage({
  path,
  className,
  style,
  loading = 'lazy',
  fetchPriority = 'auto',
}: SlideshowLayerImageProps) {
  const chain = useMemo(() => buildAssetFallbackChain(path), [path])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [path])

  const src = chain[index]

  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => {
        setIndex((value) => (value + 1 < chain.length ? value + 1 : value))
      }}
      className={className}
      style={style}
    />
  )
}

function preloadImage(path: string): Promise<void> {
  const chain = buildAssetFallbackChain(path)
  if (chain.length === 0) return Promise.resolve()

  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    let index = 0

    const tryNext = () => {
      if (index >= chain.length) {
        resolve()
        return
      }

      img.onload = () => resolve()
      img.onerror = () => {
        index += 1
        tryNext()
      }
      img.src = chain[index]!
    }

    tryNext()
  })
}

export function HeroSlideshow({
  images = HERO_SLIDESHOW_PATHS,
  className,
  imageClassName,
  controlRef,
  onIndexChange,
}: HeroSlideshowProps) {
  const resolvedPaths = useMemo(
    () => images.map((src) => (src.startsWith('/') ? src : src)),
    [images],
  )

  const [reduceMotion, setReduceMotion] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [topLayer, setTopLayer] = useState<0 | 1>(0)
  const [layerPaths, setLayerPaths] = useState<[string, string]>(() => [
    resolvedPaths[0] ?? '',
    resolvedPaths[1] ?? resolvedPaths[0] ?? '',
  ])
  const [isFading, setIsFading] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [autoplayCycle, setAutoplayCycle] = useState(0)

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
    if (resolvedPaths.length === 0) return

    setCurrentIndex(0)
    setTopLayer(0)
    setIsFading(false)
    setRevealed(false)
    isTransitioningRef.current = false
    setLayerPaths([
      resolvedPaths[0]!,
      resolvedPaths[1] ?? resolvedPaths[0]!,
    ])
  }, [resolvedPaths])

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

  const transitionTo = useCallback(async (nextIndex: number) => {
    if (isTransitioningRef.current || resolvedPaths.length <= 1) return
    if (nextIndex === currentIndexRef.current) return

    const nextPath = resolvedPaths[nextIndex]!

    if (reduceMotion) {
      const layer = topLayerRef.current
      setLayerPaths((prev) => {
        const next: [string, string] = [...prev]
        next[layer] = nextPath
        return next
      })
      setCurrentIndex(nextIndex)
      return
    }

    const incomingLayer: 0 | 1 = topLayerRef.current === 0 ? 1 : 0

    isTransitioningRef.current = true
    await preloadImage(nextPath)

    setLayerPaths((prev) => {
      const next: [string, string] = [...prev]
      next[incomingLayer] = nextPath
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
  }, [reduceMotion, resolvedPaths])

  const advanceSlide = useCallback(() => {
    void transitionTo((currentIndexRef.current + 1) % resolvedPaths.length)
  }, [resolvedPaths.length, transitionTo])

  const stepManually = useCallback(
    (step: 1 | -1) => {
      if (isTransitioningRef.current || resolvedPaths.length <= 1) return
      const total = resolvedPaths.length
      void transitionTo((currentIndexRef.current + step + total) % total)
      setAutoplayCycle((cycle) => cycle + 1)
    },
    [resolvedPaths.length, transitionTo],
  )

  useImperativeHandle(
    controlRef,
    () => ({
      next: () => stepManually(1),
      prev: () => stepManually(-1),
    }),
    [stepManually],
  )

  useEffect(() => {
    onIndexChange?.(currentIndex)
  }, [currentIndex, onIndexChange])

  useEffect(() => {
    if (resolvedPaths.length <= 1 || reduceMotion) return

    const interval = window.setInterval(advanceSlide, HERO_SLIDE_INTERVAL_MS)
    return () => {
      window.clearInterval(interval)
    }
  }, [advanceSlide, autoplayCycle, reduceMotion, resolvedPaths.length])

  useEffect(() => () => clearFadeTimers(), [clearFadeTimers])

  useEffect(() => {
    if (resolvedPaths.length <= 1) return

    const preloadIndex = (currentIndexRef.current + 1) % resolvedPaths.length
    void preloadImage(resolvedPaths[preloadIndex]!)
  }, [currentIndex, resolvedPaths])

  if (resolvedPaths.length === 0) return null

  const incomingLayer: 0 | 1 = topLayer === 0 ? 1 : 0

  return (
    <div className={cn('isolate overflow-hidden', className)} aria-hidden="true">
      {layerPaths.map((path, index) => {
        const layer = index as 0 | 1
        const isTop = layer === topLayer
        const opacity = isFading
          ? (layer === incomingLayer ? (revealed ? 1 : 0) : (revealed ? 0 : 1))
          : (isTop ? 1 : 0)

        return (
          <SlideshowLayerImage
            key={`${layer}-${path}`}
            path={path}
            loading={isTop ? 'eager' : 'lazy'}
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
              ['--hero-focus' as string]: heroSlideFocus(path),
              ['--hero-shift' as string]: heroSlideShift(path),
              transitionDuration: isFading && !reduceMotion ? `${FADE_MS}ms` : undefined,
              transitionTimingFunction: isFading && !reduceMotion ? FADE_EASING : undefined,
            }}
          />
        )
      })}
    </div>
  )
}
