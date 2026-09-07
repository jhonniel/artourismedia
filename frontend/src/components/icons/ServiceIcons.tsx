import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ServiceIconProps {
  className?: string
}

const s = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
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

/** Tourism planning — folded destination map with pin */
export function TourismPlanningIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <path {...s} d="M4 7.5 12 4l8 3.5v10L12 21 4 17.5V7.5z" />
      <path {...s} d="M12 4v17" opacity={0.22} />
      <path {...s} d="M12 9a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5z" />
      <circle cx="12" cy="11.25" r="0.85" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

/** Destination branding — megaphone / campaign reach */
export function DestinationBrandingIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <path {...s} d="M11 6v12" />
      <path {...s} d="M6 9.5h5l5.5-3v12l-5.5-3H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" />
      <path {...s} d="M17.5 9a2.75 2.75 0 0 1 0 6" />
      <path {...s} d="M4 10.5v3" strokeWidth={2} />
    </IconBase>
  )
}

/** MICE — conference presentation */
export function MiceManagementIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <rect {...s} x="3" y="5" width="18" height="12" rx="1.5" />
      <rect {...s} x="7.5" y="9" width="9" height="5" rx="0.75" />
      <path {...s} d="M12 17v3" />
      <path {...s} d="M8.5 20h7" />
      <path {...s} d="M7 20.5h1M16 20.5h1" strokeWidth={1.25} opacity={0.5} />
    </IconBase>
  )
}

/** Learning & development — graduation cap */
export function ThoughtLeadershipIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <path {...s} d="M12 3 3 7.5 12 12l9-4.5L12 3z" />
      <path {...s} d="M6 9.5V14c0 2.2 2.7 4 6 4s6-1.8 6-4V9.5" />
      <path {...s} d="M20 7.5V14" />
      <path {...s} d="M12 12v4" opacity={0.35} />
    </IconBase>
  )
}

/** Mindanao CONNECT — network hub */
export function MindanaoConnectIcon({ className }: ServiceIconProps) {
  return (
    <IconBase className={className}>
      <circle {...s} cx="12" cy="12" r="2.25" />
      <circle {...s} cx="6.5" cy="8" r="1.75" />
      <circle {...s} cx="17.5" cy="8" r="1.75" />
      <circle {...s} cx="6.5" cy="16" r="1.75" />
      <circle {...s} cx="17.5" cy="16" r="1.75" />
      <path {...s} d="M10.1 10.6 8 9.4M13.9 10.6 16 9.4M10.1 13.4 8 14.6M13.9 13.4 16 14.6" />
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
