import { useState, type ComponentType } from 'react'
import { assetUrl, sameOriginAssetUrl } from '@/lib/assets'
import { cn } from '@/lib/utils'

interface ServiceIconProps {
  className?: string
}

export const TOURISM_PLANNING_ICON_PATH = '/images/services/tourism-planning-development.png?v=2'
export const DESTINATION_BRANDING_ICON_PATH = '/images/services/destination-branding-marketing.png?v=2'
export const MICE_MANAGEMENT_ICON_PATH = '/images/services/mice-management.png?v=2'
export const THOUGHT_LEADERSHIP_ICON_PATH = '/images/services/thought-leadership-learning-development.png?v=3'
export const MINDANAO_CONNECT_ICON_PATH = '/images/services/mindanao-connect.png?v=2'

const IMAGE_SERVICE_ICON_KEYS = new Set([
  'tourism-planning-development',
  'tourism-planning',
  'destination-branding-marketing',
  'destination-branding',
  'mice-management',
  'mice-events',
  'thought-leadership-learning-development',
  'learning-leadership',
  'thought-leadership',
  'mindanao-connect',
])

type ServiceIconLayout = 'home' | 'card' | 'detail'

const IMAGE_ICON_LAYOUT: Record<ServiceIconLayout, { wrapper: string; image: string }> = {
  home: {
    wrapper: 'h-12 w-12 sm:h-14 sm:w-14',
    image: 'h-12 w-12 sm:h-14 sm:w-14',
  },
  card: {
    wrapper: 'h-12 w-12 sm:h-14 sm:w-14',
    image: 'h-12 w-12 sm:h-14 sm:w-14',
  },
  detail: {
    wrapper: 'h-14 w-14 sm:h-16 sm:w-16',
    image: 'h-14 w-14 sm:h-16 sm:w-16',
  },
}

function ImageServiceIcon({ src, className }: ServiceIconProps & { src: string }) {
  const [useFallback, setUseFallback] = useState(false)
  const resolvedSrc = useFallback ? sameOriginAssetUrl(src) : assetUrl(src)

  return (
    <img
      src={resolvedSrc}
      alt=""
      aria-hidden
      className={cn('object-contain', className)}
      onError={() => {
        if (!useFallback) {
          setUseFallback(true)
        }
      }}
    />
  )
}

export function TourismPlanningIcon({ className }: ServiceIconProps) {
  return <ImageServiceIcon src={TOURISM_PLANNING_ICON_PATH} className={className} />
}

export function DestinationBrandingIcon({ className }: ServiceIconProps) {
  return <ImageServiceIcon src={DESTINATION_BRANDING_ICON_PATH} className={className} />
}

export function MiceManagementIcon({ className }: ServiceIconProps) {
  return <ImageServiceIcon src={MICE_MANAGEMENT_ICON_PATH} className={className} />
}

export function ThoughtLeadershipIcon({ className }: ServiceIconProps) {
  return <ImageServiceIcon src={THOUGHT_LEADERSHIP_ICON_PATH} className={className} />
}

export function MindanaoConnectIcon({ className }: ServiceIconProps) {
  return <ImageServiceIcon src={MINDANAO_CONNECT_ICON_PATH} className={className} />
}

export const SERVICE_ICON_BY_SLUG: Record<string, ComponentType<ServiceIconProps>> = {
  'tourism-planning-development': TourismPlanningIcon,
  'destination-branding-marketing': DestinationBrandingIcon,
  'mice-management': MiceManagementIcon,
  'thought-leadership-learning-development': ThoughtLeadershipIcon,
  'mindanao-connect': MindanaoConnectIcon,
}

export const SERVICE_ICON_BY_NAME: Record<string, ComponentType<ServiceIconProps>> = {
  'tourism-planning': TourismPlanningIcon,
  'destination-branding': DestinationBrandingIcon,
  'mice-events': MiceManagementIcon,
  'mice-management': MiceManagementIcon,
  'learning-leadership': ThoughtLeadershipIcon,
  'thought-leadership': ThoughtLeadershipIcon,
  'mindanao-connect': MindanaoConnectIcon,
}

export function usesImageServiceIcon(slug?: string, icon?: string | null): boolean {
  const key = slug ?? (icon ? resolveIconKey(icon) : '')

  return IMAGE_SERVICE_ICON_KEYS.has(key)
}

export function serviceIconWrapperClass(
  slug?: string,
  icon?: string | null,
  layout: ServiceIconLayout = 'card',
  fallback = 'bg-teal text-white',
): string {
  if (usesImageServiceIcon(slug, icon)) {
    return cn('bg-transparent p-0 shadow-none', IMAGE_ICON_LAYOUT[layout].wrapper)
  }

  return cn(
    layout === 'detail' ? 'h-16 w-16' : 'h-14 w-14 sm:h-16 sm:w-16',
    'rounded-2xl shadow-soft',
    fallback,
  )
}

export function serviceIconImageClass(
  slug?: string,
  icon?: string | null,
  layout: ServiceIconLayout = 'card',
): string {
  if (usesImageServiceIcon(slug, icon)) {
    return IMAGE_ICON_LAYOUT[layout].image
  }

  return layout === 'detail' ? 'h-8 w-8' : 'h-8 w-8 sm:h-10 sm:w-10'
}

export function ServiceIcon({
  slug,
  icon,
  className,
}: {
  slug?: string
  icon?: string | null
  className?: string
}) {
  const Icon =
    (slug && SERVICE_ICON_BY_SLUG[slug]) ||
    (icon && SERVICE_ICON_BY_NAME[resolveIconKey(icon)]) ||
    null

  if (!Icon) return null
  return <Icon className={className} />
}

function resolveIconKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}
