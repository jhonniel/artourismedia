interface DecorativeProps {
  className?: string
}

export function DestinationsArrow({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 48 16" fill="none" aria-hidden="true">
      <path
        d="M2 8 H38"
        stroke="#078C95"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <path d="M34 4 L42 8 L34 12" stroke="#078C95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SunIcon({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="16" fill="#FBBF24" stroke="#FF5A1F" strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="37"
          y="6"
          width="6"
          height="16"
          rx="3"
          fill="#FBBF24"
          transform={`rotate(${angle} 40 40)`}
        />
      ))}
      <circle cx="34" cy="36" r="2" fill="#0B2447" opacity="0.5" />
      <circle cx="44" cy="36" r="2" fill="#0B2447" opacity="0.5" />
      <path d="M34 46 Q40 50 46 46" stroke="#0B2447" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
    </svg>
  )
}

export function AirplaneIcon({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 280 100" fill="none" aria-hidden="true">
      <path
        d="M10 72 Q80 20 160 38 Q220 50 270 42"
        stroke="#078C95"
        strokeWidth="2.5"
        strokeDasharray="8 8"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M248 30 L278 42 L248 54 L262 42 Z"
        fill="#078C95"
        opacity="0.9"
      />
    </svg>
  )
}

export function SparkleIcon({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 20 L16 28 L24 32 L16 36 L12 44 L8 36 L0 32 L8 28 Z" fill="#FBBF24" />
      <path d="M32 4 L34 14 L44 16 L34 18 L32 28 L30 18 L20 16 L30 14 Z" fill="#FBBF24" />
      <path d="M48 24 L50 30 L56 32 L50 34 L48 40 L46 34 L40 32 L46 30 Z" fill="#FBBF24" opacity="0.85" />
    </svg>
  )
}

export function StarOutlineIcon({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 4 L28 18 L42 20 L30 30 L34 44 L24 36 L14 44 L18 30 L6 20 L20 18 Z"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HeartOutlineIcon({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 27 C16 27 4 18 4 10.5 C4 7 6.5 4.5 10 4.5 C12.5 4.5 14.5 6 16 8 C17.5 6 19.5 4.5 22 4.5 C25.5 4.5 28 7 28 10.5 C28 18 16 27 16 27 Z"
        stroke="#FF5A1F"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HeartMountainsIcon({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 41.5C24 41.5 7 29.5 7 17.5C7 12.5 10.5 9 15.5 9C18.5 9 21 10.5 24 14C27 10.5 29.5 9 32.5 9C37.5 9 41 12.5 41 17.5C41 29.5 24 41.5 24 41.5Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 24.5L18.5 18.5L22 22.5L26 15.5L30.5 22L33.5 18"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HeroOrangeAccent({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 320 240" aria-hidden="true">
      <path
        d="M40,220 Q120,120 220,180 Q300,230 320,120 L320,240 L0,240 Q20,260 40,220 Z"
        fill="#FF5A1F"
        opacity="0.85"
      />
      <path
        d="M80,200 Q160,140 260,160 Q300,180 320,140 L320,240 L20,240 Q40,250 80,200 Z"
        fill="#FF5A1F"
        opacity="0.45"
      />
    </svg>
  )
}

export function HeroWaveTop({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 1440 360" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,220 C220,60 420,280 660,140 C900,0 1120,240 1440,120 L1440,0 L0,0 Z"
        fill="#B8E6E6"
        opacity="0.35"
      />
      <path
        d="M0,260 C180,100 400,300 640,180 C880,60 1120,260 1440,160 L1440,0 L0,0 Z"
        fill="#078C95"
        opacity="0.08"
      />
    </svg>
  )
}

export function HeroWaveBottom({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,80 C260,220 520,40 780,130 C1040,220 1260,60 1440,150 L1440,300 L0,300 Z"
        fill="#FFD4BC"
        opacity="0.45"
      />
      <path
        d="M0,120 C240,260 520,80 760,170 C1000,260 1220,100 1440,190 L1440,300 L0,300 Z"
        fill="#FF5A1F"
        opacity="0.07"
      />
      <path
        d="M700,100 C920,200 1120,120 1440,170 L1440,300 L520,300 Z"
        fill="#B8E6E6"
        opacity="0.25"
      />
    </svg>
  )
}

export function WaveDividerNavy({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,40 C180,80 360,10 540,45 C720,80 900,15 1080,40 C1260,65 1380,25 1440,35 L1440,80 L0,80 Z"
        fill="#0B2447"
      />
    </svg>
  )
}

/** Smooth top wave for the footer — cream/white content transitions into navy. */
export function FooterTopWave({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,78 C120,118 280,38 420,68 C560,98 720,28 900,58 C1060,88 1220,32 1360,52 C1400,58 1420,46 1440,48 L1440,140 L0,140 Z"
        fill="#0B2447"
      />
      <path
        d="M0,88 C160,118 340,52 520,78 C700,104 880,44 1060,68 C1200,86 1340,58 1440,62 L1440,140 L0,140 Z"
        fill="#0B2447"
        opacity="0.35"
      />
    </svg>
  )
}

/** Layered teal wave accent — bottom-left of footer. */
export function FooterLeftAccent({ className }: DecorativeProps) {
  const dots: Array<[number, number, number, number]> = [
    [210, 48, 3.2, 0.22], [238, 62, 2.4, 0.18], [268, 44, 3.6, 0.24], [296, 72, 2.2, 0.16],
    [228, 88, 2.8, 0.2], [256, 98, 2, 0.14], [284, 82, 3, 0.19], [312, 58, 2.6, 0.17],
    [190, 72, 2.4, 0.15], [320, 92, 2.2, 0.13], [342, 68, 2.8, 0.18], [176, 98, 2, 0.12],
    [248, 118, 2.2, 0.11], [276, 126, 1.8, 0.1], [304, 112, 2.4, 0.12], [330, 104, 2, 0.11],
  ]

  return (
    <svg className={className} viewBox="0 0 480 400" preserveAspectRatio="xMinYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="footer-left-teal-deep" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#04565C" />
          <stop offset="100%" stopColor="#078C95" />
        </linearGradient>
        <linearGradient id="footer-left-teal-main" x1="0%" y1="100%" x2="90%" y2="20%">
          <stop offset="0%" stopColor="#078C95" />
          <stop offset="55%" stopColor="#1CB5A8" />
          <stop offset="100%" stopColor="#3CB8B8" />
        </linearGradient>
      </defs>

      {dots.map(([cx, cy, r, opacity]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#9FE8EF" opacity={opacity} />
      ))}

      <path
        d="M-20,400 C40,320 120,360 190,290 C260,220 330,250 420,180 C450,160 470,140 480,120 L480,400 Z"
        fill="url(#footer-left-teal-deep)"
      />
      <path
        d="M-10,400 C30,310 110,340 175,255 C240,170 320,210 400,145 C430,120 455,105 480,88 L480,400 Z"
        fill="url(#footer-left-teal-main)"
        opacity="0.96"
      />
      <path
        d="M0,400 C20,330 70,300 120,250 C170,200 230,220 290,170 C330,140 360,120 390,100 L390,400 Z"
        fill="#3CB8B8"
        opacity="0.42"
      />
      <ellipse cx="58" cy="250" rx="72" ry="110" fill="#7ADCE6" opacity="0.34" />
      <path
        d="M0,400 C0,330 18,260 48,220 C78,180 110,200 130,240 C150,280 120,330 90,360 C60,385 30,395 0,400 Z"
        fill="#B8E6E6"
        opacity="0.28"
      />
    </svg>
  )
}

/** Orange wave accent with dot texture — bottom-right of footer. */
export function FooterRightAccent({ className }: DecorativeProps) {
  const dots = [
    [120, 260], [145, 245], [170, 270], [195, 250], [220, 280], [245, 265],
    [135, 290], [160, 305], [185, 295], [210, 315], [235, 300], [260, 320],
    [150, 330], [175, 345], [200, 335], [225, 355], [250, 340], [275, 325],
    [290, 290], [305, 310], [315, 270], [330, 295], [340, 255], [355, 280],
  ]

  return (
    <svg className={className} viewBox="0 0 520 420" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
      <path
        d="M520,420 C420,280 320,340 220,290 C120,240 60,350 -40,280 L-40,420 Z"
        fill="#E84E0F"
        opacity="0.95"
      />
      <path
        d="M520,420 C440,320 340,370 240,320 C140,270 80,360 0,310 L0,420 Z"
        fill="#FF5A1F"
        opacity="0.92"
      />
      <path
        d="M520,420 C460,350 360,390 260,350 C160,310 110,380 40,340 L40,420 Z"
        fill="#FF8A4C"
        opacity="0.42"
      />
      <g opacity="0.65">
        {dots.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.8" fill="white" />
        ))}
      </g>
    </svg>
  )
}

/** Palm silhouettes over the footer right accent. */
export function FooterPalmSilhouette({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 240 340" aria-hidden="true">
      <g fill="#142D52" opacity="0.72">
        <path d="M168,340 L176,210 Q180,160 188,115 Q192,88 184,62 Q198,98 202,135 Q208,98 218,72 Q212,118 210,165 Q208,215 198,265 Q192,300 186,340 Z" />
        <path d="M124,340 L132,230 Q136,185 140,148 Q144,112 136,82 Q148,118 152,155 Q158,122 168,96 Q162,138 160,185 Q158,235 150,285 Q144,318 138,340 Z" />
      </g>
    </svg>
  )
}

/** Scattered dots for footer navy background — left side. */
export function FooterDotPattern({ className }: DecorativeProps) {
  const dots: Array<[number, number, number, number]> = [
    [24, 18, 2.8, 0.2], [52, 10, 2.2, 0.16], [78, 26, 3.2, 0.22], [36, 38, 2.4, 0.15],
    [64, 48, 2, 0.13], [92, 32, 2.6, 0.18], [18, 58, 2.2, 0.14], [48, 68, 3, 0.19],
    [76, 62, 2.4, 0.16], [104, 44, 2, 0.12], [30, 82, 2.6, 0.17], [58, 88, 2.2, 0.14],
    [86, 78, 2.8, 0.18], [112, 66, 2.4, 0.15], [42, 104, 2, 0.11], [70, 98, 2.2, 0.12],
  ]

  return (
    <svg className={className} viewBox="0 0 128 120" aria-hidden="true">
      {dots.map(([cx, cy, r, opacity]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#9FE8EF" opacity={opacity} />
      ))}
    </svg>
  )
}

/** Subtle starfield texture across the footer navy background. */
export function FooterBackgroundTexture({ className }: DecorativeProps) {
  const dots = [
    [40, 30], [120, 55], [200, 25], [280, 70], [360, 40], [440, 85],
    [80, 110], [160, 95], [240, 130], [320, 105], [400, 140], [480, 90],
    [60, 170], [140, 155], [220, 185], [300, 160], [380, 195], [460, 175],
    [100, 220], [180, 205], [260, 235], [340, 210], [420, 245], [500, 225],
  ]

  return (
    <svg className={className} viewBox="0 0 540 260" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.8" fill="white" opacity="0.07" />
      ))}
    </svg>
  )
}

export function AboutPalmAccent({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 280 420" aria-hidden="true">
      <path
        d="M40,420 Q20,280 80,180 Q140,80 220,40 L280,0 L280,420 Z"
        fill="#078C95"
        opacity="0.92"
      />
      <path d="M200,120 Q210,90 230,95 Q215,110 200,120 Z" fill="white" opacity="0.25" />
      <path d="M230,180 Q245,150 260,160 Q240,175 230,180 Z" fill="white" opacity="0.2" />
      <path d="M210,250 Q225,220 240,230 Q220,245 210,250 Z" fill="white" opacity="0.18" />
    </svg>
  )
}

export function BlobShape({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <path
        d="M45,110 Q20,60 70,35 Q120,10 155,55 Q190,100 140,145 Q90,190 45,110 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function WaveDivider({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function DottedPattern({ className }: DecorativeProps) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={10 + col * 20}
            cy={10 + row * 20}
            r="2"
            fill="currentColor"
            opacity="0.3"
          />
        )),
      )}
    </svg>
  )
}
