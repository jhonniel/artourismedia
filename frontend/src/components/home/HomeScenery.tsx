import { useId, useMemo, useState, type CSSProperties } from 'react'
import { NavyRibbonWave } from '@/components/ui/Decorative'
import { buildAssetFallbackChain } from '@/lib/assets'
import { cn } from '@/lib/utils'

type Point = [number, number]
type Segment = [Point, Point, Point, Point]

/**
 * Left edge of the desktop hero photo in frame units (0–100), from above the top-right corner down
 * to below the bottom-left. The frame box is the stage widened 60% to the left.
 *
 * Fitted to the reference as four tangent-continuous cubics: a diagonal in from the top, a flat
 * shelf under the nav, one large rounded corner into the vertical, then a long sweep to the
 * bottom-left corner. Curvature changes sign only twice on screen, so it reads as a single S.
 *
 * Single source of truth — the photo mask, the white rim and its shadow are all built from this.
 */
export const FRAME_OUTLINE: Segment[] = [
  [[87.1, -4.4], [82.68, -0.48], [74.53, 7.7], [70.22, 10.2]],
  [[70.22, 10.2], [63, 14.38], [54.53, 9.65], [48.38, 19.4]],
  [[48.38, 19.4], [35.52, 39.81], [47.46, 64.19], [31.9, 83]],
  [[31.9, 83], [21.93, 95.05], [8.71, 98.79], [-3.24, 101.2]],
]

function outlineToPath(segments: Segment[]): string {
  const start = segments[0][0]
  let d = `M${start[0]},${start[1]}`
  for (const [, c1, c2, end] of segments) {
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${end[0]},${end[1]}`
  }
  return d
}

const FRAME_EDGE_PATH = outlineToPath(FRAME_OUTLINE)

/**
 * Bottom edge of the mobile hero photo in photo-box units (0–100), right to left: a shallow wave
 * that sits a little higher on the right. Same role as FRAME_OUTLINE — mask, rim and shadow all
 * follow it.
 */
const MOBILE_EDGE_PATH = 'M104,91 C74,96 40,94 -4,97'

/** CSS `mask-image` value that keeps the side of `edge` closed off by `closing` (0–100 box units). */
function maskFrom(edge: string, closing: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${edge} ${closing} Z"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/** Desktop photo: everything right of / below the S, closed off outside the frame box. */
export const HERO_FRAME_MASK = maskFrom(FRAME_EDGE_PATH, 'L-8,108 L108,108 L108,-8')

/** Mobile photo: everything above the wave. */
export const HERO_MOBILE_MASK = maskFrom(MOBILE_EDGE_PATH, 'L-4,-4 L104,-4')

/** One edge path stroked at a constant screen width, however the 100×100 box is stretched. */
function EdgeStroke({ className, d }: { className: string; d: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** Soft shadow hugging the rim on the cream side. Sits behind the masked frame, in the same box. */
export function HeroFrameShadow() {
  return <EdgeStroke className="hero-frame__shadow" d={FRAME_EDGE_PATH} />
}

/** White paper rim along the photo edge. Lives inside the masked frame, so only its inner half shows. */
export function HeroFrameEdge() {
  return <EdgeStroke className="hero-frame__edge" d={FRAME_EDGE_PATH} />
}

/** Mobile counterpart of HeroFrameShadow — behind the masked photo, falling onto the cream below it. */
export function HeroMobileShadow() {
  return <EdgeStroke className="hero-mobile-photo__shadow" d={MOBILE_EDGE_PATH} />
}

/** Mobile counterpart of HeroFrameEdge — inside the masked photo, along its wave. */
export function HeroMobileEdge() {
  return <EdgeStroke className="hero-mobile-photo__edge" d={MOBILE_EDGE_PATH} />
}

/** Deterministic PRNG so procedural scenery is identical on every render and build. */
function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const fmt = (value: number) => Math.round(value * 100) / 100

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
}

/**
 * Sky behind the About shoreline: pale blue that deepens toward the horizon, a warm sun glow,
 * soft clouds, a few birds and two faint islands. Covers the section (`slice`) so shapes keep
 * their proportions at every width; everything sits in the lower half to stay clear of copy.
 */
function TropicalSky() {
  const id = useSvgId('sky')
  // Clouds live on two depth layers. Each layer is a 1440-wide band that is drawn twice (the copy
  // sits one band-width to the left) and the whole layer slides right by exactly one band-width per
  // cycle, so the stream is seamless and never empties. Near clouds are bigger and move faster.
  const cloudLayers: { name: string; duration: number; opacity: number; clouds: [number, number, number][] }[] = [
    { name: 'far', duration: 190, opacity: 0.75, clouds: [[980, 128, 0.55], [1420, 340, 0.6], [420, 170, 0.5]] },
    { name: 'near', duration: 120, opacity: 0.9, clouds: [[110, 262, 1], [1300, 215, 0.85], [760, 312, 0.7]] },
  ]
  const birds: [number, number, number][] = [
    [90, 215, 1],
    [124, 203, 0.8],
    [150, 222, 0.65],
  ]

  return (
    <svg
      className="home-scenery__sky"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-air`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#eef6fb" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d9ecf6" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffe3c2" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffe9d2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffe9d2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <rect width="1440" height="600" fill={`url(#${id}-air)`} />
      <circle cx="1130" cy="470" r="260" fill={`url(#${id}-sun)`} />
      <circle cx="1130" cy="470" r="46" fill="#ffd7b0" opacity="0.55" />

      {/* Distant islands, just above the horizon */}
      <g fill="#9fc9d6" opacity="0.55">
        <path d="M70,556 C110,540 170,536 230,544 C270,549 300,556 320,560 Z" />
        <path d="M1250,554 C1290,541 1340,538 1390,546 C1415,550 1432,556 1440,560 L1250,560 Z" />
      </g>
      <rect y="470" width="1440" height="90" fill={`url(#${id}-haze)`} />

      {/* Clouds — endless left → right conveyor, two depth layers */}
      {cloudLayers.map((layer) => (
        <g
          key={layer.name}
          className="sky-cloud-layer"
          style={{ animationDuration: `${layer.duration}s` } as CSSProperties}
          fill="#ffffff"
          opacity={layer.opacity}
        >
          {[0, -1440].map((offset) => (
            <g key={offset} transform={`translate(${offset} 0)`}>
              {layer.clouds.map(([x, y, s]) => (
                <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
                  <ellipse cx="0" cy="0" rx="78" ry="18" />
                  <ellipse cx="-30" cy="-8" rx="34" ry="20" />
                  <ellipse cx="14" cy="-14" rx="40" ry="26" />
                  <ellipse cx="50" cy="-6" rx="30" ry="18" />
                </g>
              ))}
            </g>
          ))}
        </g>
      ))}

      {/* Birds */}
      <g className="sky-birds" fill="none" stroke="#0B2447" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round">
        {birds.map(([x, y, s], index) => (
          <g
            key={`${x}-${y}`}
            className="sky-bird"
            style={{ animationDuration: `${2.6 + index * 0.5}s`, animationDelay: `${-index * 0.9}s` }}
          >
            <path transform={`translate(${x} ${y}) scale(${s})`} d="M-10,2 Q-5,-5 0,1 Q5,-5 10,2" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------------------------------------- */
/* Tropical shoreline for the About section: sea + sandy bay (full width) and coconut palm clusters */
/* ---------------------------------------------------------------------------------------------- */

const SHORE_WIDTH = 1440
const SHORE_HEIGHT = 220
/** Runs past both edges so the sea can drift sideways without exposing a gap. */
const SHORE_HORIZON =
  'M-120,64 C-60,63 -30,62 0,62 C300,50 620,76 940,60 C1140,50 1320,56 1440,62 C1480,64 1520,64 1560,64'
/** Beach sits high on the left (under the portrait) and opens into a bay toward the centre-right. */
const SHORE_SAND =
  'M0,84 C150,80 280,82 400,90 C510,97 590,122 690,146 C800,170 920,172 1040,156 C1150,142 1240,118 1330,106 C1380,100 1420,98 1440,100'

function TropicalShore() {
  const id = useSvgId('shore')
  const fill = (crest: string) => `${crest} L${SHORE_WIDTH + 120},${SHORE_HEIGHT + 1} L-120,${SHORE_HEIGHT + 1} Z`
  const ripples = [
    { y: 92, from: 120, to: 640, opacity: 0.55, duration: 9 },
    { y: 104, from: 520, to: 1100, opacity: 0.45, duration: 11 },
    { y: 118, from: 860, to: 1380, opacity: 0.4, duration: 8 },
    { y: 128, from: 40, to: 420, opacity: 0.35, duration: 12 },
  ]

  return (
    <svg
      className="home-scenery__shore"
      viewBox={`0 0 ${SHORE_WIDTH} ${SHORE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fc7dc" />
          <stop offset="55%" stopColor="#b7dcea" />
          <stop offset="100%" stopColor="#d6ecf3" />
        </linearGradient>
        <linearGradient id={`${id}-sand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1e2c4" />
          <stop offset="45%" stopColor="#f5ecda" />
          <stop offset="100%" stopColor="#f6f9fb" />
        </linearGradient>
        <linearGradient id={`${id}-wet`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9c7a3" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#d9c7a3" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sea — drifts sideways and rises/falls slightly */}
      <g className="shore-sea">
        <path d={fill(SHORE_HORIZON)} fill={`url(#${id}-sea)`} />
        <path
          d={SHORE_HORIZON}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.85"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      {ripples.map(({ y, from, to, opacity, duration }, index) => {
        const span = to - from
        return (
          <path
            key={`${y}-${from}`}
            className="shore-ripple"
            style={{ animationDuration: `${duration}s`, animationDelay: `${-index * 2.3}s` }}
            d={`M${from},${y} C${from + span * 0.3},${y - 4} ${from + span * 0.6},${y + 4} ${to},${y}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={opacity}
            strokeWidth="1.25"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )
      })}

      {/* Beach + wet sand + foam move together so the water appears to wash up and recede */}
      <g className="shore-tide">
        <path d={fill(SHORE_SAND)} fill={`url(#${id}-sand)`} />
        <g transform="translate(0, 5)">
          <path d={`${SHORE_SAND} L${SHORE_WIDTH},150 L0,150 Z`} fill={`url(#${id}-wet)`} />
        </g>
        <path
          d={SHORE_SAND}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.95"
          strokeWidth="4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}

interface PalmSpec {
  x: number
  height: number
  lean: number
  seed: number
}

const PALM_BOX: Point = [520, 400]
const PALM_GREENS = ['#3f7350', '#4f8a5e', '#67a06d', '#5b955f'] as const

function quadPoint(p0: Point, c: Point, p1: Point, t: number): Point {
  const u = 1 - t
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]
}

/** Tapered, optionally serrated ribbon along a quadratic curve (used for trunks and fronds). */
function ribbonPath(
  p0: Point,
  c: Point,
  p1: Point,
  width: (t: number) => number,
  { steps = 14, serrate = false } = {},
): string {
  const left: Point[] = []
  const right: Point[] = []

  for (let k = 0; k <= steps; k += 1) {
    const t = k / steps
    const [x, y] = quadPoint(p0, c, p1, t)
    const [nx, ny] = quadPoint(p0, c, p1, Math.min(1, t + 0.01))
    const [px, py] = quadPoint(p0, c, p1, Math.max(0, t - 0.01))
    const len = Math.hypot(nx - px, ny - py) || 1
    const normal: Point = [-(ny - py) / len, (nx - px) / len]
    const notch = serrate && k > 1 && k < steps - 1 && k % 2 === 0 ? 0.58 : 1
    const half = (width(t) / 2) * notch
    left.push([x + normal[0] * half, y + normal[1] * half])
    right.push([x - normal[0] * half, y - normal[1] * half])
  }

  return `M${[...left, ...right.reverse()].map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(' L')} Z`
}

interface PalmArt {
  trunk: string
  rings: string[]
  fronds: { d: string; rib: string; fill: string }[]
  coconuts: { cx: number; cy: number; r: number }[]
  base: Point
  crown: Point
  height: number
  /** Sway timing so each palm moves on its own rhythm. */
  sway: { duration: number; delay: number }
}

function buildPalm({ x, height, lean, seed }: PalmSpec): PalmArt {
  const random = seededRandom(seed * 31 + 5)
  const base: Point = [x, PALM_BOX[1]]
  const crown: Point = [x + lean, PALM_BOX[1] - height]
  const trunkCtrl: Point = [x + lean * 0.18, PALM_BOX[1] - height * 0.5]
  const trunkWidth = (t: number) => Math.max(7, height * 0.07) * (1 - t * 0.42)

  const rings: string[] = []
  for (let t = 0.1; t < 0.93; t += 0.075) {
    const [cx, cy] = quadPoint(base, trunkCtrl, crown, t)
    const [nx, ny] = quadPoint(base, trunkCtrl, crown, t + 0.01)
    const len = Math.hypot(nx - cx, ny - cy) || 1
    const normal: Point = [-(ny - cy) / len, (nx - cx) / len]
    const half = trunkWidth(t) / 2 - 0.6
    rings.push(
      `M${fmt(cx - normal[0] * half)},${fmt(cy - normal[1] * half)} Q${fmt(cx)},${fmt(cy + 2.2)} ${fmt(cx + normal[0] * half)},${fmt(cy + normal[1] * half)}`,
    )
  }

  const fronds: PalmArt['fronds'] = []
  const count = 9
  for (let i = 0; i < count; i += 1) {
    const angle = (-180 + (180 / count) * (i + 0.5) + (random() - 0.5) * 14) * (Math.PI / 180)
    const length = height * (0.4 + random() * 0.14)
    const dir: Point = [Math.cos(angle), Math.sin(angle)]
    const horizontal = Math.abs(dir[0])
    const ctrl: Point = [crown[0] + dir[0] * length * 0.55, crown[1] + dir[1] * length * 0.55 - length * 0.16 * horizontal]
    const tip: Point = [crown[0] + dir[0] * length, crown[1] + dir[1] * length + length * (0.12 + 0.34 * horizontal)]
    const width = length * (0.2 + random() * 0.05)
    fronds.push({
      d: ribbonPath(crown, ctrl, tip, (t) => width * Math.sin(Math.PI * t) ** 0.55, { steps: 18, serrate: true }),
      rib: `M${fmt(crown[0])},${fmt(crown[1])} Q${fmt(ctrl[0])},${fmt(ctrl[1])} ${fmt(tip[0])},${fmt(tip[1])}`,
      fill: PALM_GREENS[(i + seed) % PALM_GREENS.length],
    })
  }
  // Two low fronds drooping down either side of the crown
  for (const side of [-1, 1]) {
    const length = height * 0.34
    const ctrl: Point = [crown[0] + side * length * 0.5, crown[1] + length * 0.1]
    const tip: Point = [crown[0] + side * length * 0.72, crown[1] + length * 0.72]
    fronds.unshift({
      d: ribbonPath(crown, ctrl, tip, (t) => length * 0.2 * Math.sin(Math.PI * t) ** 0.55, { steps: 16, serrate: true }),
      rib: `M${fmt(crown[0])},${fmt(crown[1])} Q${fmt(ctrl[0])},${fmt(ctrl[1])} ${fmt(tip[0])},${fmt(tip[1])}`,
      fill: PALM_GREENS[0],
    })
  }

  const r = Math.max(3.2, height * 0.02)
  const coconuts = [
    { cx: crown[0] - r * 1.1, cy: crown[1] + r * 1.6, r },
    { cx: crown[0] + r * 1.2, cy: crown[1] + r * 1.9, r: r * 0.92 },
    { cx: crown[0] + r * 0.05, cy: crown[1] + r * 3.2, r: r * 0.85 },
  ]

  return {
    trunk: ribbonPath(base, trunkCtrl, crown, trunkWidth, { steps: 12 }),
    rings,
    fronds,
    coconuts,
    base,
    crown,
    height,
    sway: { duration: 5.5 + random() * 2.5, delay: -random() * 6 },
  }
}

const PALM_CLUSTERS: Record<'left' | 'right', PalmArt[]> = {
  left: [
    { x: 150, height: 300, lean: 58, seed: 1 },
    { x: 58, height: 214, lean: -26, seed: 2 },
    { x: 246, height: 150, lean: 22, seed: 3 },
  ].map(buildPalm),
  right: [
    { x: 436, height: 284, lean: 36, seed: 4 },
    { x: 352, height: 168, lean: -22, seed: 5 },
    { x: 492, height: 136, lean: -10, seed: 6 },
  ].map(buildPalm),
}

function PalmCluster({ side }: { side: 'left' | 'right' }) {
  const id = useSvgId('palm')
  const palms = PALM_CLUSTERS[side]

  return (
    <svg
      className={cn('home-scenery__palms', `home-scenery__palms--${side}`)}
      viewBox={`0 0 ${PALM_BOX[0]} ${PALM_BOX[1]}`}
      preserveAspectRatio={side === 'left' ? 'xMinYMax meet' : 'xMaxYMax meet'}
      overflow="visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-trunk`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7d5b3c" />
          <stop offset="55%" stopColor="#a67c52" />
          <stop offset="100%" stopColor="#8a6543" />
        </linearGradient>
      </defs>

      {/* Ground: sand mounds + grass tufts so the trunks are rooted, not floating */}
      {palms.map(({ base, height }) => (
        <g key={`ground-${base[0]}`}>
          <ellipse cx={base[0]} cy={base[1] - 2} rx={height * 0.16} ry={height * 0.03} fill="#dcc9a4" opacity="0.55" />
          <ellipse cx={base[0] - height * 0.07} cy={base[1] - 4} rx={height * 0.075} ry={height * 0.03} fill="#5b955f" />
          <ellipse cx={base[0] + height * 0.08} cy={base[1] - 3} rx={height * 0.085} ry={height * 0.034} fill="#4f8a5e" />
          <ellipse cx={base[0]} cy={base[1] - 5} rx={height * 0.06} ry={height * 0.032} fill="#67a06d" />
        </g>
      ))}

      {palms.map(({ trunk, rings, fronds, coconuts, base, crown, sway }) => {
        const timing = { animationDuration: `${sway.duration.toFixed(2)}s`, animationDelay: `${sway.delay.toFixed(2)}s` }
        return (
          <g
            key={`palm-${base[0]}`}
            className="palm"
            style={{ transformOrigin: `${base[0]}px ${base[1]}px`, ...timing }}
          >
            <path d={trunk} fill={`url(#${id}-trunk)`} />
            <g fill="none" stroke="#5e4128" strokeOpacity="0.35" strokeWidth="1.1" strokeLinecap="round">
              {rings.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            <g className="palm__crown" style={{ transformOrigin: `${crown[0]}px ${crown[1]}px`, ...timing }}>
              {fronds.map(({ d, rib, fill }) => (
                <g key={d}>
                  <path d={d} fill={fill} />
                  <path d={rib} fill="none" stroke="#dff0d8" strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round" />
                </g>
              ))}
              {coconuts.map(({ cx, cy, r }) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#6b4a2e" stroke="#8a6543" strokeWidth="0.8" />
              ))}
            </g>
          </g>
        )
      })}
    </svg>
  )
}

function SceneryPhoto({ path, className }: { path: string; className: string }) {
  const chain = useMemo(() => buildAssetFallbackChain(path), [path])
  const [index, setIndex] = useState(0)
  const src = chain[index]

  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      loading="eager"
      decoding="async"
      className={className}
      onError={() => setIndex((value) => (value + 1 < chain.length ? value + 1 : value))}
    />
  )
}

/**
 * Desktop hero foot, as in the reference: the white rim carries on along the bottom of the photo,
 * over a pale-blue strip that melts into the About section (#fdfefe). 1440×200 box; the crest
 * starts low at the left, where the photo edge sweeps into the corner, and peaks under the photo.
 */
const RIBBON_CREST = 'M0,164 C150,162 300,152 518,120 C700,93 820,60 1037,57 C1180,55 1320,72 1440,100'

function HeroRibbon() {
  const id = useSvgId('ribbon')

  return (
    <svg className="hero-scenery__waves" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-water`} gradientUnits="userSpaceOnUse" x1="0" y1="96" x2="0" y2="200">
          <stop offset="0%" stopColor="#b4d0df" />
          <stop offset="48%" stopColor="#bfd7e4" />
          <stop offset="100%" stopColor="#fdfefe" />
        </linearGradient>
      </defs>

      <path d={`${RIBBON_CREST} L1440,201 L0,201 Z`} fill={`url(#${id}-water)`} />
      <path className="hero-scenery__ribbon-crest" d={RIBBON_CREST} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/**
 * Mobile hero foot: a pale cream swell in the 1440×200 box, almost flat under the copy, handing
 * off to About at #fdfefe. Soft white bloom, no outline, no drop-shadow.
 */
const WAVE_CREST = 'M0,176 C340,178 560,170 780,148 C1000,122 1140,108 1280,132 C1360,146 1410,160 1440,166'

function HeroWaves() {
  const id = useSvgId('wave')
  const paper = `${WAVE_CREST} L1440,201 L0,201 Z`

  return (
    <svg className="hero-scenery__waves" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id={`${id}-bloom`} x="-8%" y="-80%" width="116%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#fdfefe" />
          <stop offset="100%" stopColor="#fdfefe" />
        </linearGradient>
      </defs>

      <path d={paper} fill="#ffffff" opacity="0.85" filter={`url(#${id}-bloom)`} transform="translate(0 -8)" />
      <path d={paper} fill={`url(#${id}-paper)`} />
    </svg>
  )
}

export function HeroScenery({ className }: { className?: string }) {
  return (
    <div className={cn('home-scenery hero-scenery', className)} aria-hidden="true">
      <SceneryPhoto
        path="/images/hero/hero-slideshow-03-mountain-valley.jpg"
        className="hero-scenery__photo hero-scenery__photo--left"
      />
    </div>
  )
}

export function HeroBottomWaves({
  className,
  variant = 'paper',
}: {
  className?: string
  variant?: 'paper' | 'ribbon'
}) {
  return (
    <div className={cn('home-scenery hero-waves', className)} aria-hidden="true">
      {variant === 'ribbon' ? <HeroRibbon /> : <HeroWaves />}
    </div>
  )
}

export function AboutScenery() {
  return (
    <div className="home-scenery home-scenery--about" aria-hidden="true">
      <TropicalSky />
      <TropicalShore />
      <PalmCluster side="left" />
      <PalmCluster side="right" />
    </div>
  )
}

export function ServicesScenery() {
  return (
    <div className="home-scenery home-scenery--services" aria-hidden="true">
      <NavyRibbonWave className="home-scenery__ridge" />
    </div>
  )
}
