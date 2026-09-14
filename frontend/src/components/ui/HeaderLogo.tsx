import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/ui/BrandLogo'

interface HeaderLogoProps {
  compact?: boolean
  logoUrl?: string
  siteName?: string
  className?: string
}

export function HeaderLogo({
  compact = false,
  logoUrl,
  siteName = 'ArTourisMedia',
  className,
}: HeaderLogoProps) {
  return (
    <BrandLogo
      logoUrl={logoUrl}
      siteName={siteName}
      className={cn(
        compact
          ? 'h-9 w-auto max-w-[11rem]'
          : 'h-10 w-auto max-w-[12rem] sm:h-11 sm:max-w-[13rem] md:h-12 md:max-w-[14rem] lg:h-[3.25rem] lg:max-w-[15rem]',
        className,
      )}
    />
  )
}
