import { useState } from 'react'
import { assetUrl, sameOriginAssetUrl } from '@/lib/assets'

interface BrandLogoProps {
  logoUrl?: string
  siteName?: string
  className?: string
  /** Use on navy/dark backgrounds — loads the light logo variant. */
  variant?: 'default' | 'onDark'
}

/** Bump when the logo files change: the file names stay the same, so this is what makes browsers refetch. */
const LOGO_CACHE = 'v=6'
export const SITE_LOGO_PATH = `/images/brand/artourismedia-logo.png?${LOGO_CACHE}`
export const SITE_LOGO_ON_DARK_PATH = `/images/brand/artourismedia-logo-dark.png?${LOGO_CACHE}`

function withLogoCache(path: string): string {
  const [base] = path.split('?')
  if (!base.includes('artourismedia-logo')) return path
  return `${base}?${LOGO_CACHE}`
}

function logoForVariant(logoUrl: string | undefined, variant: 'default' | 'onDark'): string {
  const defaultPath = variant === 'onDark' ? SITE_LOGO_ON_DARK_PATH : SITE_LOGO_PATH

  if (!logoUrl) return defaultPath

  if (variant === 'onDark' && logoUrl.includes('artourismedia-logo.png') && !logoUrl.includes('-dark')) {
    return withLogoCache(logoUrl.replace('artourismedia-logo.png', 'artourismedia-logo-dark.png'))
  }

  return withLogoCache(logoUrl)
}

export function BrandLogo({
  logoUrl,
  siteName = 'ArTourisMedia',
  className = 'h-10 w-auto md:h-11',
  variant = 'default',
}: BrandLogoProps) {
  const defaultPath = variant === 'onDark' ? SITE_LOGO_ON_DARK_PATH : SITE_LOGO_PATH
  const primaryPath = logoForVariant(logoUrl, variant)
  // sameOriginAssetUrl drops the query, so the version is put back on the bundled copies
  const fallbacks = [
    withLogoCache(sameOriginAssetUrl(primaryPath)),
    assetUrl(primaryPath),
    withLogoCache(sameOriginAssetUrl(defaultPath)),
    assetUrl(defaultPath),
  ]
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const src = fallbacks[Math.min(fallbackIndex, fallbacks.length - 1)]

  return (
    <img
      src={src}
      alt={siteName}
      className={className}
      onError={() => {
        setFallbackIndex((current) => Math.min(current + 1, fallbacks.length - 1))
      }}
    />
  )
}
