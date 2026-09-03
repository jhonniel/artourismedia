import { cn } from '@/lib/utils'
import { assetUrl } from '@/lib/assets'
import { SERVICE_ICON_BY_NAME } from '@/components/icons/ServiceIcons'

const ICON_FILES: Record<string, string> = {
  building: assetUrl('/images/icons/building.svg'),
  handshake: assetUrl('/images/icons/handshake.svg'),
  'chart-line': assetUrl('/images/icons/chart-growth.svg'),
  'chart-growth': assetUrl('/images/icons/chart-growth.svg'),
  'graduation-cap': assetUrl('/images/icons/graduation-cap.svg'),
  layers: assetUrl('/images/icons/layers.svg'),
  'stacked-layers': assetUrl('/images/icons/layers.svg'),
  users: assetUrl('/images/icons/users-group.svg'),
  'users-group': assetUrl('/images/icons/users-group.svg'),
  briefcase: assetUrl('/images/icons/briefcase.svg'),
  award: assetUrl('/images/icons/award.svg'),
  'map-pin': assetUrl('/images/icons/map-pin.svg'),
  globe: assetUrl('/images/icons/globe.svg'),
  clipboard: assetUrl('/images/icons/clipboard.svg'),
  tag: assetUrl('/images/icons/tag.svg'),
  video: assetUrl('/images/icons/video.svg'),
  'tourism-planning': assetUrl('/images/icons/services/tourism-planning.svg'),
  'destination-branding': assetUrl('/images/icons/services/destination-branding.svg'),
  'mice-events': assetUrl('/images/icons/services/mice-events.svg'),
  'learning-leadership': assetUrl('/images/icons/services/learning-leadership.svg'),
  'mindanao-connect': assetUrl('/images/icons/services/mindanao-connect.svg'),
  palette: assetUrl('/images/icons/tag.svg'),
  route: assetUrl('/images/icons/chart-growth.svg'),
  megaphone: assetUrl('/images/icons/tag.svg'),
  leaf: assetUrl('/images/icons/globe.svg'),
  target: assetUrl('/images/icons/award.svg'),
}

const EMOJI_MAP: Record<string, string> = {
  '🎯': 'target',
  '🤝': 'handshake',
  '📈': 'chart-line',
  '🏛️': 'building',
  '💼': 'briefcase',
  '🎓': 'graduation-cap',
  '🏆': 'award',
  '🌏': 'globe',
  '📍': 'map-pin',
  '🎨': 'palette',
  '🗺️': 'route',
  '📣': 'megaphone',
  '🌿': 'leaf',
}

interface BrandIconProps {
  name?: string | null
  className?: string
  size?: 'sm' | 'md' | 'lg'
  light?: boolean
}

const SIZE_MAP = {
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
}

function resolveIconName(name?: string | null): string | null {
  if (!name) return null

  const normalized = name.trim().toLowerCase()

  if (EMOJI_MAP[normalized]) {
    return EMOJI_MAP[normalized]
  }

  return normalized.replace(/\s+/g, '-')
}

export function BrandIcon({ name, className, size = 'md', light = false }: BrandIconProps) {
  const iconName = resolveIconName(name)
  const ServiceComponent = iconName ? SERVICE_ICON_BY_NAME[iconName] : null

  if (ServiceComponent) {
    return (
      <ServiceComponent
        className={cn(
          SIZE_MAP[size],
          light && 'text-white',
          className,
        )}
      />
    )
  }

  const src = iconName ? ICON_FILES[iconName] : null

  if (!src) {
    return (
      <span className={cn('inline-flex items-center justify-center font-semibold', SIZE_MAP[size], className)} aria-hidden>
        ✦
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={cn(SIZE_MAP[size], 'object-contain', light && 'brightness-0 invert', className)}
    />
  )
}

export const ICON_RING_COLORS = ['bg-teal', 'bg-orange', 'bg-navy', 'bg-purple', 'bg-teal'] as const

export { resolveIconName, ICON_FILES }
