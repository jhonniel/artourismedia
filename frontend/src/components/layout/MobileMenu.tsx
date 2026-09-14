import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { SocialIcon } from '@/components/ui/SocialIcon'
import type { NavigationItem, SiteSettings, SocialLink } from '@/types'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  navigation: NavigationItem[]
  settings: SiteSettings
  socialLinks?: SocialLink[]
}

const MENU_TRANSITION_MS = 360

function getSocialStyles(platform: string): { bg: string; text: string } {
  const p = platform.toLowerCase()

  if (p.includes('facebook')) return { bg: 'bg-[#1877F2]', text: 'text-white' }
  if (p.includes('instagram')) {
    return {
      bg: 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]',
      text: 'text-white',
    }
  }
  if (p.includes('linkedin')) return { bg: 'bg-[#0A66C2]', text: 'text-white' }
  if (p.includes('tiktok')) return { bg: 'bg-[#000000]', text: 'text-white' }

  return { bg: 'bg-navy/10', text: 'text-navy' }
}

export function MobileMenu({
  open,
  onClose,
  navigation,
  settings,
  socialLinks = [],
}: MobileMenuProps) {
  const location = useLocation()
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(open)
  const regularItems = navigation.filter((item) => !item.is_cta)
  const ctaItem = navigation.find((item) => item.is_cta)
  const sortedSocial = [...socialLinks].sort((a, b) => a.sort_order - b.sort_order)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setVisible(true))
      })
      return () => window.cancelAnimationFrame(frame)
    }

    setVisible(false)
    const timeout = window.setTimeout(() => setMounted(false), MENU_TRANSITION_MS)
    return () => window.clearTimeout(timeout)
  }, [open])

  useEffect(() => {
    if (!mounted) return

    const scrollY = window.scrollY
    const previousOverflow = document.body.style.overflow
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const previousWidth = document.body.style.width

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.documentElement.classList.add('mobile-menu-open')

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = previousWidth
      document.documentElement.classList.remove('mobile-menu-open')
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mounted, onClose])

  if (!mounted) {
    return null
  }

  return (
    <>
      <div
        className={cn('mobile-menu-backdrop fixed inset-0 z-[90] lg:hidden', visible && 'is-open')}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'mobile-menu-panel fixed z-[100] flex flex-col overflow-y-auto overscroll-contain bg-white lg:hidden',
          'pb-[env(safe-area-inset-bottom,0px)]',
          visible && 'is-open',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className={cn('mobile-menu-body flex min-h-0 flex-1 flex-col', visible && 'is-open')}>
        <nav className="flex-1 px-5 pt-0 pb-2 sm:px-6" aria-label="Mobile site navigation">
          <ul className="divide-y divide-navy/6">
            {regularItems.map((item, index) => {
              const isExternal = item.url.startsWith('http')
              const isActive =
                location.pathname === item.url ||
                (item.url !== '/' && location.pathname.startsWith(item.url))

              const className = cn(
                'mobile-menu-item flex min-h-[3.25rem] w-full items-center text-[1.0625rem] font-semibold leading-tight transition-colors',
                isActive ? 'text-teal' : 'text-navy active:text-teal',
              )

              return (
                <li key={item.uuid}>
                  {isExternal ? (
                    <a href={item.url} target={item.target} rel="noopener noreferrer" className={className}>
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.url} className={className} onClick={onClose}>
                      <span className="relative">
                        {item.label}
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-teal" aria-hidden="true" />
                        )}
                      </span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div
          className="mt-auto shrink-0 rounded-t-[1.75rem] border-t border-navy/8 bg-cream px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 shadow-[0_-12px_32px_rgba(11,36,71,0.06)] sm:px-6"
        >
          {ctaItem && (
            <Link
              to={ctaItem.url}
              target={ctaItem.target}
              onClick={onClose}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-orange px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white shadow-[0_8px_20px_rgba(255,90,31,0.24)] transition-[transform,background-color,box-shadow] duration-200 hover:bg-orange/90 active:scale-[0.98]"
            >
              {ctaItem.label} →
            </Link>
          )}

          {(settings.contact_email || sortedSocial.length > 0) && (
            <div className={cn('flex flex-col items-center gap-5 text-center', ctaItem && 'mt-5')}>
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-sm font-semibold text-navy/70 transition-colors hover:text-teal"
                >
                  {settings.contact_email}
                </a>
              )}

              {sortedSocial.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {sortedSocial.map((link) => {
                    const styles = getSocialStyles(link.platform)

                    return (
                      <a
                        key={link.uuid}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.platform}
                        className={cn(
                          'inline-flex h-10 w-10 items-center justify-center rounded-full transition-[transform,opacity] duration-200 hover:scale-105 active:scale-95',
                          styles.bg,
                          styles.text,
                        )}
                      >
                        <SocialIcon platform={link.platform} className="h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  )
}
