import { cn } from '@/lib/utils'

interface DecorationProps {
  className?: string
}

/** Wave stack for the 942×375 about hero reference. */
export function AboutHeroBottomWaves({ className }: DecorationProps) {
  return (
    <svg
      className={cn('block h-full w-full', className)}
      viewBox="0 0 942 375"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Teal wave — lower-left */}
      <path
        d="M0,375 L0,318 C72,286 144,334 228,304 C312,274 384,322 468,298 C552,274 624,318 708,294 C792,270 864,310 942,296 L942,375 Z"
        fill="#E7F5F6"
      />
      {/* Peach wave — lower-right under quote */}
      <path
        d="M520,375 C640,332 760,348 942,318 L942,375 Z"
        fill="#FFBA84"
        opacity="0.88"
      />
      <path
        d="M680,375 C780,352 860,362 942,344 L942,375 Z"
        fill="#FDEFE3"
      />
      {/* White foreground crest */}
      <path
        d="M0,375 L0,334 C98,304 196,342 294,318 C392,294 490,334 588,312 C686,290 784,326 882,310 C912,304 928,314 942,310 L942,375 Z"
        fill="#FFFFFF"
      />
      <path
        d="M0,375 L0,356 C84,342 168,360 252,350 C336,340 420,358 504,348 C588,338 672,356 756,346 C840,336 900,352 942,348 L942,375 Z"
        fill="#FFFFFF"
        opacity="0.55"
      />
    </svg>
  )
}

export function AboutHeroAccentStrokes({ className }: DecorationProps) {
  return (
    <svg
      className={cn('pointer-events-none text-[#FF5418]', className)}
      viewBox="0 0 52 60"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8,48 C16,38 24,28 32,18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M14,54 C22,42 30,32 38,22"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.92"
      />
      <path
        d="M20,58 C28,48 34,38 42,28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.78"
      />
    </svg>
  )
}

export function AboutHeroAccentUnderline({ className }: DecorationProps) {
  return (
    <svg
      className={cn('about-hero__accent-underline', className)}
      viewBox="0 0 168 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3,14 C32,6 64,8 96,10 C118,11 138,9 164,11"
        stroke="#FF5418"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.96"
      />
      <path
        d="M8,15 C38,10 66,12 94,13 C114,14 132,12 150,13"
        stroke="#FF5418"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}

export function AboutHeroDotGrid({ className }: DecorationProps) {
  return (
    <svg className={className} viewBox="0 0 120 56" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 8 }).map((__, col) => (
          <circle key={`${row}-${col}`} cx={8 + col * 15} cy={8 + row * 14} r="2.35" fill="#A2D2DF" />
        )),
      )}
    </svg>
  )
}
