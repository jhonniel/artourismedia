import { assetUrl } from '@/lib/assets'

interface BrandLogoProps {
  logoUrl?: string
  siteName?: string
  className?: string
  variant?: 'header' | 'footer' | 'mark'
}

export const SITE_LOGO_PATH = '/images/brand/artourismedia-logo.png?v=3'
export const FOOTER_LOGO_PATH = '/images/brand/artourismedia-logo-dark.png?v=1'

export function BrandLogo({
  logoUrl,
  siteName = 'ArTourisMedia',
  className = 'h-10 w-auto md:h-11',
  variant = 'header',
}: BrandLogoProps) {
  const defaultPath = variant === 'footer' ? FOOTER_LOGO_PATH : SITE_LOGO_PATH
  const src = assetUrl(variant === 'footer' ? defaultPath : logoUrl || defaultPath)
  const fallback = assetUrl(defaultPath)

  return (
    <img
      src={src}
      alt={siteName}
      className={className}
      onError={(event) => {
        const target = event.currentTarget

        if (target.src !== fallback) {
          target.src = fallback
        }
      }}
    />
  )
}
