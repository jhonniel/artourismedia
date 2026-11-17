import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from 'react'
import { Link } from 'react-router-dom'
import {
  ServiceIcon,
  serviceIconImageClass,
  serviceIconWrapperClass,
  usesImageServiceIcon,
} from '@/components/icons/ServiceIcons'
import { FadeIn } from '@/components/ui/FadeIn'
import { cn } from '@/lib/utils'
import type { Service } from '@/types'

/** Must match the column breakpoints the grid is designed for (1 / 2 / 3 columns). */
const TWO_COLUMNS = '(min-width: 640px)'
const THREE_COLUMNS = '(min-width: 1024px)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** How long the pointer must rest on a card before it opens — stops a sweep across the grid reshuffling it. */
const HOVER_INTENT_MS = 90
const MOVE_TIMING: KeyframeAnimationOptions = {
  duration: 520,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
}

interface Slot {
  row: number
  col: number
  span: number
}

/** Where every card sits, and which one is open across two columns. */
interface BentoLayout {
  /** Grid this layout was made for; a different grid starts again from the default layout. */
  cols: number
  count: number
  slots: Slot[]
  open: number
  /** The open card was in the last column, so it grew leftwards. */
  openedFromEnd: boolean
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function readColumns(): number {
  if (typeof window === 'undefined') return 1
  if (window.matchMedia(THREE_COLUMNS).matches) return 3
  if (window.matchMedia(TWO_COLUMNS).matches) return 2
  return 1
}

function useBentoColumns(): number {
  const [cols, setCols] = useState(readColumns)

  useEffect(() => {
    const queries = [TWO_COLUMNS, THREE_COLUMNS].map((query) => window.matchMedia(query))
    const sync = () => setCols(readColumns())

    sync()
    queries.forEach((query) => query.addEventListener('change', sync))
    return () => queries.forEach((query) => query.removeEventListener('change', sync))
  }, [])

  return cols
}

/**
 * Place every card from scratch: the open card takes two cells starting at (row, col),
 * the others fill the remaining cells in their normal order.
 */
function arrange(
  count: number,
  cols: number,
  open: number,
  row: number,
  col: number,
  openedFromEnd: boolean,
): BentoLayout {
  const taken = new Set([row * cols + col, row * cols + col + 1])

  let cell = 0
  const slots = Array.from({ length: count }, (_, index): Slot => {
    if (index === open) return { row, col, span: 2 }

    while (taken.has(cell)) cell += 1
    const slot = { row: Math.floor(cell / cols), col: cell % cols, span: 1 }
    cell += 1
    return slot
  })

  return { cols, count, slots, open, openedFromEnd }
}

/**
 * Open another card with as little movement as possible. It keeps the cell it is in and takes
 * the one beside it; the card that was open shrinks to one of its two cells, and the card that
 * was pushed out (if any) hops into the cell that frees up. Every other card stays put.
 */
function openCardIn(layout: BentoLayout, index: number): BentoLayout {
  const { cols, count, slots, open } = layout
  const slot = slots[index]
  const previous = slots[open]
  if (!slot || !previous || index === open) return layout

  // Grow rightwards, or leftwards from the last column
  const col = Math.min(slot.col, cols - 2)
  const openedFromEnd = col < slot.col
  const takenCol = openedFromEnd ? col : col + 1
  const next = slots.map((item) => ({ ...item }))
  next[index] = { row: slot.row, col, span: 2 }

  const previousCols = [previous.col, previous.col + 1]
  if (previous.row === slot.row && previousCols.includes(takenCol)) {
    // Growing into the open card: that one simply keeps its other cell
    next[open] = { row: previous.row, col: previousCols.find((item) => item !== takenCol) ?? previous.col, span: 1 }
    return { ...layout, slots: next, open: index, openedFromEnd }
  }

  const pushedOut = slots.findIndex(
    (item, itemIndex) => itemIndex !== index && item.row === slot.row && item.col === takenCol,
  )
  if (pushedOut === -1) {
    // The cell beside it was empty, so there is no one-for-one swap — lay the grid out again
    return arrange(count, cols, index, slot.row, col, openedFromEnd)
  }

  // Free whichever of the previously open card's cells is nearer to the card being pushed out
  const freedCol =
    Math.abs(previous.col + 1 - takenCol) <= Math.abs(previous.col - takenCol)
      ? previous.col + 1
      : previous.col
  next[open] = { row: previous.row, col: freedCol === previous.col ? previous.col + 1 : previous.col, span: 1 }
  next[pushedOut] = { row: previous.row, col: freedCol, span: 1 }
  return { ...layout, slots: next, open: index, openedFromEnd }
}

/** Soft hills in the card's bottom-right corner; the deepest one only shows on the open card. */
function CardWave() {
  return (
    <svg
      className="services-bento__wave"
      viewBox="0 0 320 140"
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden="true"
    >
      <path
        className="services-bento__wave-back"
        d="M150 140C190 132 215 70 262 44C285 31 305 22 320 20V140Z"
      />
      <path
        className="services-bento__wave-mid"
        d="M70 140C120 136 150 96 200 100C245 104 270 78 320 70V140Z"
      />
      <path
        className="services-bento__wave-deep"
        d="M176 140C222 137 262 114 320 98V140Z"
      />
      <path
        className="services-bento__wave-front"
        d="M0 140C36 138 58 84 104 78C150 72 168 118 214 122C250 125 285 112 320 118V140Z"
      />
    </svg>
  )
}

interface ServiceCardProps {
  service: Service
  index: number
  total: number
  /** Render the wide layout too, so the card can open. */
  expandable: boolean
  cardRef: (node: HTMLElement | null) => void
}

function ServiceCard({ service, index, total, expandable, cardRef }: ServiceCardProps) {
  const href = service.cta_url || `/services/${service.slug}`
  const external = Boolean(service.cta_url?.startsWith('http'))

  // The illustrated icons sit on a soft blob; the plain fallback tile keeps its own background
  const onBlob = usesImageServiceIcon(service.slug, service.icon)

  const icon = (size: 'sm' | 'lg') => (
    <div
      className={cn(
        'services-bento__icon flex shrink-0 items-center justify-center',
        size === 'lg' && 'services-bento__icon--lg',
        onBlob && 'services-bento__icon--blob',
        serviceIconWrapperClass(service.slug, service.icon, 'card', 'bg-teal/10 text-teal'),
      )}
    >
      <ServiceIcon
        slug={service.slug}
        icon={service.icon}
        className={cn('services-bento__icon-img', serviceIconImageClass(service.slug, service.icon, 'card'))}
      />
    </div>
  )

  // Each layer's direct children carry no outer margins: ServicesBento adds their heights up
  const body = (
    <article ref={cardRef} className="services-bento__card">
      <div className="services-bento__layer services-bento__layer--compact">
        <div className="services-bento__content">
          <div className="services-bento__head">
            {icon('sm')}
            <span className="services-bento__count">
              {pad(index + 1)} / {pad(total)}
            </span>
          </div>
          <h2 className="services-bento__title">{service.title}</h2>
          {service.description && (
            <p className="services-bento__body services-bento__body--clamp">{service.description}</p>
          )}
        </div>
        <span className="services-bento__link">
          Projects and Experience
          <span aria-hidden>→</span>
        </span>
      </div>

      {/* Same content in the wide layout; the two cross-fade, so it is hidden from assistive tech */}
      {expandable && (
        <div className="services-bento__layer services-bento__layer--wide" aria-hidden="true">
          <div className="services-bento__split">
            <div className="services-bento__aside">
              {icon('lg')}
              <span className="services-bento__count services-bento__count--wide">
                {pad(index + 1)} — {pad(total)}
              </span>
            </div>
            <div className="services-bento__main">
              <p className="services-bento__eyebrow">Our expertise</p>
              <p className="services-bento__title services-bento__title--wide">{service.title}</p>
              {service.description && <p className="services-bento__body">{service.description}</p>}
              <span className="services-bento__button">
                {service.cta_text || 'Explore Projects'}
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <CardWave />
    </article>
  )

  if (external) {
    return (
      <a href={href} className="services-bento__hit">
        {body}
      </a>
    )
  }

  return (
    <Link to={href} className="services-bento__hit">
      {body}
    </Link>
  )
}

interface ServicesBentoProps {
  services: Service[]
}

/**
 * Service cards as a bento grid. From two columns up, one card is always open across two
 * columns; resting the pointer on (or tabbing to) another card opens that one instead, and at
 * most one other card glides into the cell that frees up. The open card always keeps the cell
 * it was hovered in, so it never moves out from under the pointer, and every row has the same
 * fixed height, so nothing shifts vertically and the page height never changes.
 */
export function ServicesBento({ services }: ServicesBentoProps) {
  const cols = useBentoColumns()
  const count = services.length
  const expandable = cols > 1 && count > 1

  const [chosen, setChosen] = useState<BentoLayout | null>(null)
  const layout = useMemo<BentoLayout | null>(() => {
    if (!expandable) return null
    if (chosen && chosen.cols === cols && chosen.count === count) return chosen
    // Default: the first service is the open one
    return arrange(count, cols, 0, 0, 0, false)
  }, [expandable, chosen, cols, count])

  const gridRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const rectsBeforeMove = useRef<(DOMRect | null)[] | null>(null)
  const running = useRef<Animation[]>([])
  const intentTimer = useRef<number | undefined>(undefined)

  const openCard = (index: number) => {
    if (!layout || index === layout.open) return

    // Remember where every card is drawn right now (mid-glide included) to animate from there
    rectsBeforeMove.current = cardRefs.current.map((card) => card?.getBoundingClientRect() ?? null)
    setChosen(openCardIn(layout, index))
  }
  const openCardRef = useRef(openCard)
  openCardRef.current = openCard

  useEffect(() => () => window.clearTimeout(intentTimer.current), [])

  // Glide from where each card was drawn to its new cell (and width), instead of jumping
  useLayoutEffect(() => {
    const before = rectsBeforeMove.current
    rectsBeforeMove.current = null
    running.current.forEach((animation) => animation.cancel())
    running.current = []

    if (!before || window.matchMedia(REDUCED_MOTION).matches) return

    cellRefs.current.forEach((cell, index) => {
      const card = cardRefs.current[index]
      const from = before[index]
      if (!cell || !card || !from || typeof cell.animate !== 'function') return

      const to = cell.getBoundingClientRect()
      const dx = from.left - to.left
      const dy = from.top - to.top

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        running.current.push(
          // zIndex keeps a travelling card above the resting ones (the open card is above both)
          cell.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)`, zIndex: 1 },
              { transform: 'translate(0px, 0px)', zIndex: 1 },
            ],
            MOVE_TIMING,
          ),
        )
      }

      if (Math.abs(from.width - to.width) > 0.5) {
        running.current.push(
          card.animate([{ width: `${from.width}px` }, { width: `${to.width}px` }], MOVE_TIMING),
        )
      }
    })
  }, [layout])

  // One fixed row height — the tallest card in either layout — so opening a card never moves a row
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    if (!expandable) {
      grid.style.removeProperty('--bento-row-h')
      return
    }

    // The layers stretch to the card, so their own height says nothing: add up what is in them
    const layers = Array.from(grid.querySelectorAll<HTMLElement>('.services-bento__layer'))
    const blocks = layers.map((layer) => Array.from(layer.children) as HTMLElement[])
    const sync = () => {
      const tallest = layers.reduce((height, layer, index) => {
        const style = window.getComputedStyle(layer)
        const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
        const content = blocks[index].reduce((sum, block) => sum + block.offsetHeight, 0)
        return Math.max(height, padding + content)
      }, 0)
      // + the card's 1px top and bottom border
      grid.style.setProperty('--bento-row-h', `${Math.ceil(tallest) + 2}px`)
    }

    sync()
    const observer = new ResizeObserver(sync)
    blocks.flat().forEach((block) => observer.observe(block))
    return () => observer.disconnect()
  }, [expandable, services])

  const handlePointerEnter = (index: number) => (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    window.clearTimeout(intentTimer.current)
    intentTimer.current = window.setTimeout(() => openCardRef.current(index), HOVER_INTENT_MS)
  }

  const handlePointerLeave = () => window.clearTimeout(intentTimer.current)

  const handleFocus = (index: number) => (event: FocusEvent<HTMLDivElement>) => {
    // Keyboard focus only — a mouse click is already on its way to the service page
    if (!event.target.matches(':focus-visible')) return
    window.clearTimeout(intentTimer.current)
    openCard(index)
  }

  return (
    <div
      ref={gridRef}
      className={cn('services-bento', expandable && 'is-expandable')}
      style={{ ['--bento-cols' as string]: cols } as CSSProperties}
    >
      {services.map((service, index) => {
        const slot = layout?.slots[index]
        const isOpen = layout?.open === index

        return (
          <div
            key={service.uuid}
            ref={(node) => {
              cellRefs.current[index] = node
            }}
            className={cn(
              'services-bento__cell',
              isOpen && 'is-open',
              isOpen && layout?.openedFromEnd && 'is-open-from-end',
            )}
            style={
              slot ? { gridRow: slot.row + 1, gridColumn: `${slot.col + 1} / span ${slot.span}` } : undefined
            }
            onPointerEnter={expandable ? handlePointerEnter(index) : undefined}
            onPointerLeave={expandable ? handlePointerLeave : undefined}
            onFocus={expandable ? handleFocus(index) : undefined}
          >
            <FadeIn delay={index * 80} className="h-full">
              <ServiceCard
                service={service}
                index={index}
                total={count}
                expandable={expandable}
                cardRef={(node) => {
                  cardRefs.current[index] = node
                }}
              />
            </FadeIn>
          </div>
        )
      })}
    </div>
  )
}
