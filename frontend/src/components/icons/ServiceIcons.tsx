import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ServiceIconProps {
  className?: string
}

const iconStroke = {
  stroke: 'currentColor',
  strokeWidth: 2.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function IconBase({ className, children }: ServiceIconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('h-8 w-8 shrink-0', className)}
    >
      {children}
    </svg>
  )
}

/** Tourism planning — destination pin on map */
export function TourismPlanningIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <path
        {...iconStroke}
        d="M4.5 7.5 12 4l7.5 3.5v9L12 20l-7.5-3.5v-9z"
      />
      <path
        {...iconStroke}
        d="M12 4v16"
        strokeWidth={1.75}
        opacity={0.35}
      />
      <path
        {...iconStroke}
        d="M12 8.5a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5z"
      />
      <circle cx="12" cy="11.25" r="0.9" fill="currentColor" />
    </IconBase>
  )
}

/** Destination branding — megaphone */
export function DestinationBrandingIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <path
        {...iconStroke}
        d="M6.5 9.5v7a1.75 1.75 0 0 0 1.75 1.75H10l4.25 3.25V6.25L10 9.5H8.25A1.75 1.75 0 0 1 6.5 7.75V9.5z"
      />
      <path {...iconStroke} d="M14.25 8.25 18 6v12l-3.75-2.25" />
      <path {...iconStroke} d="M5 11h1.25M5 14h1.75" strokeWidth={2} />
    </IconBase>
  )
}

/** MICE — stage screen and audience */
export function MiceManagementIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <rect {...iconStroke} x="3.5" y="8.5" width="17" height="10.5" rx="1.75" />
      <rect {...iconStroke} x="8" y="11.5" width="8" height="4.5" rx="0.75" strokeWidth={2} />
      <path {...iconStroke} d="M12 16v2.75M9.75 18.75h4.5" />
      <circle cx="8" cy="6.25" r="1.1" fill="currentColor" />
      <circle cx="12" cy="5.25" r="1.1" fill="currentColor" />
      <circle cx="16" cy="6.25" r="1.1" fill="currentColor" />
    </IconBase>
  )
}

/** Learning & development — open book with insight */
export function ThoughtLeadershipIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <path
        {...iconStroke}
        d="M5 8.25v11c0 .75.8 1.15 1.55.75L12 17.75l5.45 2.25c.75.4 1.55 0 1.55-.75V8.25"
      />
      <path
        {...iconStroke}
        d="M5 8.25c0-1 2.5-2.25 7-2.25s7 1.25 7 2.25"
      />
      <path {...iconStroke} d="M12 6v11.75" strokeWidth={1.75} opacity={0.35} />
      <path {...iconStroke} d="M9 11.5h6M9.5 14.25h5" strokeWidth={2} />
    </IconBase>
  )
}

/** Mindanao CONNECT — linked nodes */
export function MindanaoConnectIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <circle {...iconStroke} cx="12" cy="12" r="7.25" strokeWidth={1.75} opacity={0.35} />
      <circle cx="8" cy="10" r="2" {...iconStroke} />
      <circle cx="16" cy="10" r="2" {...iconStroke} />
      <circle cx="12" cy="16.5" r="2" {...iconStroke} />
      <path {...iconStroke} d="M9.75 11.25 10.75 12M14.25 11.25 13.25 12M12 14.25v.75" strokeWidth={2} />
      <circle cx="12" cy="12" r="1.35" fill="currentColor" />
    </IconBase>
  )
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
