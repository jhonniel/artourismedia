import { cn } from '@/lib/utils'

interface MobileNavToggleProps {
  open?: boolean
  onClick: () => void
  label: string
  className?: string
}

export function MobileNavToggle({ open = false, onClick, label, className }: MobileNavToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-navy transition-colors hover:text-teal active:bg-navy/5 lg:hidden',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <g
          style={{ transformBox: 'fill-box', transformOrigin: '12px 6px' }}
          className={cn(
            'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            open && 'translate-y-[6px] rotate-45',
          )}
        >
          <path d="M5 6h14" />
        </g>

        <g
          className={cn(
            'transition-opacity duration-200 ease-out',
            open ? 'opacity-0' : 'opacity-100',
          )}
        >
          <path d="M5 12h14" />
        </g>

        <g
          style={{ transformBox: 'fill-box', transformOrigin: '12px 18px' }}
          className={cn(
            'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            open && '-translate-y-[6px] -rotate-45',
          )}
        >
          <path d="M5 18h14" />
        </g>
      </svg>
    </button>
  )
}
