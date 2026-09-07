import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PartnerIconProps {
  className?: string
}

const s = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
}

function IconShell({ className, children }: PartnerIconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={cn('h-6 w-6 shrink-0', className)}>
      {children}
    </svg>
  )
}

export function LocalGovernmentIcon({ className }: PartnerIconProps) {
  return (
    <IconShell className={className}>
      <path {...s} d="M4 20V10l8-5 8 5v10" />
      <path {...s} d="M9 20v-6h6v6" />
      <path {...s} d="M10 14h4" />
      <path {...s} d="M12 5v2" />
    </IconShell>
  )
}

export function DevelopmentPartnersIcon({ className }: PartnerIconProps) {
  return (
    <IconShell className={className}>
      <path {...s} d="M16 19.5v-1.75a3 3 0 0 0-2.25-2.9" />
      <path {...s} d="M8 19.5v-1.75a3 3 0 0 1 2.25-2.9" />
      <circle {...s} cx="12" cy="8.5" r="2.5" />
      <path {...s} d="M5.5 19.5v-1.25a2.75 2.75 0 0 1 2.75-2.75h.5" />
      <path {...s} d="M18.5 19.5v-1.25a2.75 2.75 0 0 0-2.75-2.75h-.5" />
    </IconShell>
  )
}

export function PrivateSectorIcon({ className }: PartnerIconProps) {
  return (
    <IconShell className={className}>
      <path {...s} d="M4 19V5" />
      <path {...s} d="M4 19h16" />
      <path {...s} d="m8 15 3-3 3 2 5-6" />
    </IconShell>
  )
}

export function AcademeResearchIcon({ className }: PartnerIconProps) {
  return (
    <IconShell className={className}>
      <path {...s} d="M12 3 4 7v10l8 4 8-4V7l-8-4z" />
      <path {...s} d="M12 7v14" opacity={0.25} />
      <path {...s} d="M8.5 11h7M9 13.5h6" strokeWidth={1.35} />
    </IconShell>
  )
}

export function InvestorsStakeholdersIcon({ className }: PartnerIconProps) {
  return (
    <IconShell className={className}>
      <path {...s} d="M11 12.5 9 14.5a2.5 2.5 0 0 0 3.5 3.5l1-1" />
      <path {...s} d="M13 12.5 15 14.5a2.5 2.5 0 0 1-3.5 3.5l-1-1" />
      <path {...s} d="M9 11.5 10.5 13M15 11.5 13.5 13" />
    </IconShell>
  )
}

export const PARTNER_ICON_BY_NAME: Record<string, ComponentType<PartnerIconProps>> = {
  building: LocalGovernmentIcon,
  'users-group': DevelopmentPartnersIcon,
  users: DevelopmentPartnersIcon,
  'chart-growth': PrivateSectorIcon,
  'chart-line': PrivateSectorIcon,
  'graduation-cap': AcademeResearchIcon,
  handshake: InvestorsStakeholdersIcon,
}
