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
        {open ? (
          <>
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </>
        ) : (
          <>
            <path d="M5 7h14" />
            <path d="M5 12h14" />
            <path d="M5 17h14" />
          </>
        )}
      </svg>
    </button>
  )
}
