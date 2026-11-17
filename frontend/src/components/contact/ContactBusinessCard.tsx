import { LazyImage } from '@/components/ui/LazyImage'
import { cn } from '@/lib/utils'

/** Art Boncato Jr.'s digital business card (portrait 9:16, carries a QR code — never crop it). */
const BUSINESS_CARD_SRC = '/images/brand/art-boncato-business-card.jpg'

/** Quiet concentric rings behind the card, so the space either side of it reads as a stage. */
function StageRings() {
  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[150%] -translate-x-1/2 -translate-y-1/2 text-teal"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="52" stroke="currentColor" strokeOpacity="0.16" vectorEffect="non-scaling-stroke" />
      <circle cx="100" cy="100" r="68" stroke="currentColor" strokeOpacity="0.11" vectorEffect="non-scaling-stroke" />
      <circle cx="100" cy="100" r="84" stroke="currentColor" strokeOpacity="0.07" vectorEffect="non-scaling-stroke" />
      <circle cx="100" cy="100" r="100" stroke="currentColor" strokeOpacity="0.04" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

interface ContactBusinessCardProps {
  className?: string
}

/**
 * The digital business card, presented as its own titled panel.
 * Phones and desktop: caption on top, card centred below. Tablets: caption beside the card.
 */
export function ContactBusinessCard({ className }: ContactBusinessCardProps) {
  return (
    <div
      className={cn(
        'contact-card-stage relative isolate flex flex-col overflow-hidden rounded-[1.25rem] border border-teal/15 p-5 shadow-soft',
        'sm:flex-row sm:items-center sm:gap-8 sm:rounded-[1.5rem] sm:p-6 lg:flex-col lg:items-stretch lg:gap-0',
        className,
      )}
    >
      <div className="relative z-[1] sm:flex-1 lg:flex-none">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal sm:text-xs">
          Digital Business Card
        </p>
        <p className="mt-2 text-sm leading-relaxed text-navy/65">
          Scan with your phone camera to save our contact details.
        </p>
      </div>

      <div className="relative mt-5 flex flex-1 items-center justify-center sm:mt-0 sm:flex-none lg:mt-5 lg:flex-1">
        <StageRings />
        <LazyImage
          src={BUSINESS_CARD_SRC}
          alt="Digital business card of Art Boncato Jr., Managing Partner at ArTourisMedia. Scan the QR code to view the card and save his contact details."
          width={576}
          height={1024}
          wrapperClassName="aspect-[9/16] w-full max-w-[16.75rem] rounded-[1.125rem] !bg-white shadow-elevated ring-1 ring-navy/8 sm:w-[15rem] lg:w-full lg:max-w-[15.5rem] xl:max-w-[16.75rem]"
        />
      </div>
    </div>
  )
}
