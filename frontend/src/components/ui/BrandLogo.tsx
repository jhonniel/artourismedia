interface BrandLogoProps {
  logoUrl?: string
  siteName?: string
  className?: string
  variant?: 'header' | 'footer' | 'mark'
}

export const SITE_LOGO_PATH = '/images/brand/artourismedia-logo.png?v=3'

export function BrandLogo({
  siteName = 'ArTourisMedia',
  className = 'h-10 w-auto md:h-11',
}: BrandLogoProps) {
  return (
    <img
      src={SITE_LOGO_PATH}
      alt={siteName}
      className={className}
      onError={(event) => {
        const target = event.currentTarget
        if (!target.src.endsWith(SITE_LOGO_PATH)) {
          target.src = SITE_LOGO_PATH
        }
      }}
    />
  )
}
