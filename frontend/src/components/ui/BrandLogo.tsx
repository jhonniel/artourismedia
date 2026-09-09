import { assetUrl } from '@/lib/assets'

interface BrandLogoProps {
  logoUrl?: string
  siteName?: string
  className?: string
  variant?: 'header' | 'footer' | 'mark'
}

export const SITE_LOGO_PATH = '/images/brand/artourismedia-logo.png?v=3'

export function BrandLogo({
  logoUrl,
  siteName = 'ArTourisMedia',
  className = 'h-10 w-auto md:h-11',
}: BrandLogoProps) {
  const src = assetUrl(logoUrl || SITE_LOGO_PATH)

  return (
    <img
      src={src}
      alt={siteName}
      className={className}
      onError={(event) => {
        const target = event.currentTarget
        const fallback = assetUrl(SITE_LOGO_PATH)

        if (target.src !== fallback) {
          target.src = fallback
        }
      }}
    />
  )
}
