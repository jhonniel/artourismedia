import { useState } from 'react'
import { assetUrl, sameOriginAssetUrl } from '@/lib/assets'

interface BrandLogoProps {
  logoUrl?: string
  siteName?: string
  className?: string
}

export const SITE_LOGO_PATH = '/images/brand/artourismedia-logo.png?v=3'
export function BrandLogo({
  logoUrl,
  siteName = 'ArTourisMedia',
  className = 'h-10 w-auto md:h-11',
}: BrandLogoProps) {
  const defaultPath = SITE_LOGO_PATH
  const primaryPath = logoUrl || defaultPath
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
