import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { NavigationItem, SiteSettings, SocialLink } from '@/types'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { HeaderLogo } from '@/components/ui/HeaderLogo'
import { MobileNavToggle } from '@/components/ui/MobileNavToggle'

interface HeaderProps {
  navigation: NavigationItem[]
  settings: SiteSettings
  socialLinks?: SocialLink[]
}

export function Header({ navigation, settings, socialLinks = [] }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)

      if (location.pathname === '/') {
        const fadeEnd = 72
        const opacity = Math.max(0, 1 - scrollY / fadeEnd)
        document.documentElement.style.setProperty('--header-blur-opacity', opacity.toFixed(3))
      } else {
        document.documentElement.style.removeProperty('--header-blur-opacity')
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.documentElement.style.removeProperty('--header-blur-opacity')
    }
  }, [location.pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
    }

    syncHeaderHeight()

    const observer = new ResizeObserver(syncHeaderHeight)
    observer.observe(header)
    window.addEventListener('resize', syncHeaderHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncHeaderHeight)
    }
  }, [mobileOpen, scrolled])

  const isHome = location.pathname === '/'
  const heroOverlay = isHome && !mobileOpen
  const overlay = heroOverlay && !scrolled
  const navItems = [...navigation].sort((a, b) => a.sort_order - b.sort_order)
  const ctaItem = navItems.find((item) => item.is_cta)
  const regularItems = navItems.filter((item) => !item.is_cta)

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 duration-300',
          mobileOpen
            ? 'z-[101] bg-white py-3 shadow-none transition-[background-color,box-shadow] lg:shadow-soft'
            : 'z-50 transition-[background-color,box-shadow,padding,backdrop-filter]',
          !mobileOpen && heroOverlay && 'header-hero-overlay',
          !mobileOpen && overlay && 'header-at-hero-top py-4 lg:py-6 xl:py-7',
          !mobileOpen && !overlay && scrolled
            ? 'bg-white/95 py-3 shadow-soft backdrop-blur-sm lg:py-4 xl:py-5'
            : !mobileOpen && !overlay && 'bg-white py-4 md:py-5 lg:py-6 xl:py-7',
        )}
      >
        <div className="relative z-10 mx-auto flex h-11 w-full max-w-[90rem] items-center justify-between gap-3 px-4 sm:h-auto sm:gap-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:px-8 xl:gap-8 xl:px-10 2xl:px-12">
          <div className="flex min-w-0 flex-1 justify-start lg:flex-none">
            <Link
              to="/"
              className="block min-w-0 max-w-[calc(100vw-4.5rem)] sm:max-w-none"
              onClick={() => mobileOpen && setMobileOpen(false)}
            >
              <HeaderLogo
                logoUrl={settings.logo_url}
                siteName={settings.site_name}
                className="header-logo"
              />
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

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            {ctaItem && (
              <Link
                to={ctaItem.url}
                target={ctaItem.target}
                className="hidden whitespace-nowrap rounded-full bg-orange px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-orange/90 lg:inline-flex lg:px-4 lg:py-2 lg:text-[10px] xl:px-5 xl:py-2.5 xl:text-[11px]"
              >
                Schedule a Consultation →
              </Link>
            )}

            <MobileNavToggle
              open={mobileOpen}
              onClick={() => setMobileOpen((current) => !current)}
              label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="header-nav-toggle"
            />
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navigation={navItems}
        settings={settings}
        socialLinks={socialLinks}
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
