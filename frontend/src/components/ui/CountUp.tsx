import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface CountUpProps {
  value: string
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  className?: string
}

function parseNumericValue(value: string): number | null {
  const cleaned = value.replace(/,/g, '').trim()
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null
  return Number(cleaned)
}

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3
}

export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1800,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)
  const target = parseNumericValue(value)
  const [display, setDisplay] = useState(() => (target === null ? value : '0'))

  useEffect(() => {
    hasAnimated.current = false

    if (target === null) {
      setDisplay(value)
      return
    }

    setDisplay('0')

    const element = ref.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDisplay(String(target))
      return
    }

    let rafId = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated.current) return

        hasAnimated.current = true
        observer.disconnect()

        const startTime = performance.now() + delay

        const tick = (now: number) => {
          if (now < startTime) {
            rafId = requestAnimationFrame(tick)
            return
          }

          const progress = Math.min((now - startTime) / duration, 1)
          setDisplay(String(Math.round(easeOutCubic(progress) * target)))

          if (progress < 1) {
            rafId = requestAnimationFrame(tick)
          }
        }

        rafId = requestAnimationFrame(tick)
      },
      { threshold: 0.3 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [value, target, duration, delay])

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
