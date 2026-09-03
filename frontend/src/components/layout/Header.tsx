import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { NavigationItem, SiteSettings } from '@/types'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { HeaderLogo } from '@/components/ui/HeaderLogo'

interface HeaderProps {
  navigation: NavigationItem[]
  settings: SiteSettings
}

export function Header({ navigation, settings }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const navItems = [...navigation].sort((a, b) => a.sort_order - b.sort_order)
  const ctaItem = navItems.find((item) => item.is_cta)
  const regularItems = navItems.filter((item) => !item.is_cta)

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 py-3 shadow-soft backdrop-blur-sm lg:py-4 xl:py-5'
            : 'bg-white py-4 md:py-5 lg:py-6 xl:py-7',
        )}
      >
        <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:px-8 xl:gap-8 xl:px-10 2xl:px-12">
          <div className="flex min-w-0 justify-start">
            <Link to="/" className="shrink-0">
              <HeaderLogo />
            </Link>
          </div>

          <nav
            className="hidden items-center justify-center gap-5 lg:flex lg:gap-6 xl:gap-8 2xl:gap-10"
            aria-label="Main navigation"
          >
            {regularItems.map((item) => (
              <NavLink key={item.uuid} item={item} />
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-3">
            {ctaItem && (
              <Link
                to={ctaItem.url}
                target={ctaItem.target}
                className="hidden whitespace-nowrap rounded-full bg-orange px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-orange/90 lg:inline-flex lg:px-6 lg:py-3.5 lg:text-xs xl:px-7 xl:py-4 xl:text-[13px] 2xl:px-8 2xl:py-4 2xl:text-sm"
              >
                Schedule a Consultation →
              </Link>
            )}

            <button
              type="button"
              className="touch-target inline-flex items-center justify-center rounded-xl text-navy transition-colors hover:bg-navy/5 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navigation={navItems}
        settings={settings}
      />
    </>
  )
}

function NavLink({ item }: { item: NavigationItem }) {
  const location = useLocation()
  const isActive = location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url))

  const isExternal = item.url.startsWith('http')

  const className = cn(
    'whitespace-nowrap font-semibold capitalize transition-colors lg:text-[15px] xl:text-base 2xl:text-lg',
    isActive ? 'text-teal' : 'text-navy/80 hover:text-teal',
  )

  if (isExternal) {
    return (
      <a href={item.url} target={item.target} rel="noopener noreferrer" className={className}>
        {item.label}
      </a>
    )
  }

  return (
    <Link to={item.url} className={className}>
      {item.label}
    </Link>
  )
}
