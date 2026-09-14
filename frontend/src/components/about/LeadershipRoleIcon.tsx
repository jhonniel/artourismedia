import {
  BriefcaseBusiness,
  Clapperboard,
  Hotel,
  Plane,
  Presentation,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AboutLeadershipItem, LeadershipIconKey } from '@/types'

interface LeadershipIconConfig {
  Icon: LucideIcon
  wrapper: string
  iconClass: string
}

const ICON_CONFIG: Record<LeadershipIconKey, LeadershipIconConfig> = {
  hotel: {
    Icon: Hotel,
    wrapper: 'bg-white ring-1 ring-orange/25 shadow-[0_2px_8px_rgb(255_90_31/0.12)]',
    iconClass: 'text-orange',
  },
  'convention-center': {
    Icon: Presentation,
    wrapper: 'bg-white ring-1 ring-purple/25 shadow-[0_2px_8px_rgb(118_80_168/0.12)]',
    iconClass: 'text-purple',
  },
  'government-tourism': {
    Icon: Plane,
    wrapper: 'bg-white ring-1 ring-teal/25 shadow-[0_2px_8px_rgb(7_140_149/0.12)]',
    iconClass: 'text-teal',
  },
  'trade-industry': {
    Icon: BriefcaseBusiness,
    wrapper: 'bg-white ring-1 ring-navy/20 shadow-[0_2px_8px_rgb(11_36_71/0.1)]',
    iconClass: 'text-navy',
  },
  'tourism-media': {
    Icon: Clapperboard,
    wrapper: 'bg-white ring-1 ring-orange/25 shadow-[0_2px_8px_rgb(255_90_31/0.12)]',
    iconClass: 'text-orange',
  },
}

function resolveLeadershipIconKey(item: AboutLeadershipItem): LeadershipIconKey {
  if (item.icon && item.icon in ICON_CONFIG) {
    return item.icon
  }

  const org = item.organization.toLowerCase()

  if (/megaworld|hotels and resorts/.test(org)) return 'hotel'
  if (/world trade center|wtc/.test(org)) return 'convention-center'
  if (/department of tourism|philippine department of tourism/.test(org)) return 'government-tourism'
  if (/trade and industry|adb summit/.test(org)) return 'trade-industry'
  if (/artouris|artourism/.test(org)) return 'tourism-media'

  return 'government-tourism'
}

export function LeadershipRoleIcon({ item }: { item: AboutLeadershipItem }) {
  const iconKey = resolveLeadershipIconKey(item)
  const { Icon, wrapper, iconClass } = ICON_CONFIG[iconKey]

  return (
    <span
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
        wrapper,
      )}
      aria-hidden
    >
      <Icon className={cn('h-[1.375rem] w-[1.375rem]', iconClass)} strokeWidth={1.75} />
    </span>
  )
}
