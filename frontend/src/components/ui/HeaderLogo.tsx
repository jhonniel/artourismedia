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
          ? 'h-12 w-auto max-w-[9rem]'
          : 'h-12 w-auto max-w-[9.5rem] sm:h-14 sm:max-w-[11rem] md:h-16 md:max-w-[12.5rem] lg:h-[4.5rem] lg:max-w-[14rem]',
        className,
      )}
    />
  )
}
