import { assetUrl } from '@/lib/assets'

interface BrandLogoProps {
  logoUrl?: string
  siteName?: string
  className?: string
  variant?: 'header' | 'footer' | 'mark'
}

const VARIANT_SRC: Record<string, string> = {
  header: assetUrl('/images/brand/artourismedia-logo.png'),
  footer: assetUrl('/images/brand/artourismedia-logo.png'),
  mark: assetUrl('/images/brand/artourismedia-logo.png'),
}

export function BrandLogo({
  logoUrl,
  siteName = 'ArTourisMedia',
  className = 'h-9 w-auto md:h-10',
  variant = 'header',
}: BrandLogoProps) {
  const src = logoUrl ? assetUrl(logoUrl) : VARIANT_SRC[variant]

  return (
    <img
      src={src}
      alt={siteName}
      className={className}
      onError={(event) => {
        const target = event.currentTarget
        const fallback = VARIANT_SRC.header

        if (target.src !== fallback) {
          target.src = fallback
        }
      }}
    />
  )
}
