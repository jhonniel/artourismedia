import { useState } from 'react'
import { assetUrl, sameOriginAssetUrl } from '@/lib/assets'

interface BrandLogoProps {
  logoUrl?: string
  siteName?: string
  className?: string
  /** Use on navy/dark backgrounds — loads the light logo variant. */
  variant?: 'default' | 'onDark'
}

export const SITE_LOGO_PATH = '/images/brand/artourismedia-logo.png?v=3'
export const SITE_LOGO_ON_DARK_PATH = '/images/brand/artourismedia-logo-dark.png?v=3'

function logoForVariant(logoUrl: string | undefined, variant: 'default' | 'onDark'): string {
  const defaultPath = variant === 'onDark' ? SITE_LOGO_ON_DARK_PATH : SITE_LOGO_PATH

  if (!logoUrl) return defaultPath

  if (variant === 'onDark' && logoUrl.includes('artourismedia-logo.png') && !logoUrl.includes('-dark')) {
    return logoUrl.replace('artourismedia-logo.png', 'artourismedia-logo-dark.png')
  }

  return logoUrl
}

export function BrandLogo({
  logoUrl,
  siteName = 'ArTourisMedia',
  className = 'h-10 w-auto md:h-11',
  variant = 'default',
}: BrandLogoProps) {
  const defaultPath = variant === 'onDark' ? SITE_LOGO_ON_DARK_PATH : SITE_LOGO_PATH
  const primaryPath = logoForVariant(logoUrl, variant)
  const fallbacks = [assetUrl(primaryPath), sameOriginAssetUrl(defaultPath)]
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
