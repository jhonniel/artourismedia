import { BrandLogo } from '@/components/ui/BrandLogo'

interface HeaderLogoProps {
  compact?: boolean
  logoUrl?: string
  siteName?: string
}

export function HeaderLogo({ compact = false, logoUrl, siteName = 'ArTourisMedia' }: HeaderLogoProps) {
  return (
    <BrandLogo
      logoUrl={logoUrl}
      siteName={siteName}
      variant="header"
      className={
        compact
          ? 'h-8 w-auto max-w-[9.5rem] rounded-md'
          : 'h-9 w-auto max-w-[10.5rem] rounded-md sm:h-10 sm:max-w-[11.5rem] md:h-11 md:max-w-[12.5rem] lg:h-12 lg:max-w-[13.5rem]'
      }
    />
  )
}
