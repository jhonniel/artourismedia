import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { HeaderLogo } from '@/components/ui/HeaderLogo'
import type { NavigationItem, SiteSettings } from '@/types'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  navigation: NavigationItem[]
  settings: SiteSettings
}

export function MobileMenu({ open, onClose, navigation }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-cream shadow-elevated transition-transform duration-300 lg:hidden',
          'max-h-[100dvh] safe-bottom',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-navy/10 px-4 py-4">
          <HeaderLogo compact />
          <button
            type="button"
            onClick={onClose}
            className="touch-target inline-flex items-center justify-center rounded-xl text-navy transition-colors hover:bg-navy/5"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
          {navigation.map((item) => {
            const isExternal = item.url.startsWith('http')
            const className = cn(
              'flex min-h-11 items-center rounded-2xl px-4 py-3 text-base font-medium transition-colors',
              item.is_cta
                ? 'bg-orange text-white hover:bg-orange/90'
                : 'text-navy hover:bg-white',
            )

            if (isExternal) {
              return (
                <a key={item.uuid} href={item.url} target={item.target} className={className}>
                  {item.label}
                </a>
              )
            }

            return (
              <Link key={item.uuid} to={item.url} className={className} onClick={onClose}>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
