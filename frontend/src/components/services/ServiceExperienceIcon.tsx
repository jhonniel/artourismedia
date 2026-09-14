import {
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  Globe,
  GraduationCap,
  Landmark,
  Leaf,
  Lighthouse,
  LineChart,
  Megaphone,
  Mountain,
  Palmtree,
  Palette,
  PartyPopper,
  Presentation,
  Sparkles,
  Sun,
  UsersRound,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ServiceExperienceIconType } from '@/lib/serviceExperienceConfig'

interface IconConfig {
  Icon: LucideIcon
  wrapper: string
}

const ICON_CONFIG: Record<ServiceExperienceIconType, IconConfig> = {
  plan: {
    Icon: ClipboardList,
    wrapper: 'bg-[#078C95] text-white',
  },
  mountain: {
    Icon: Mountain,
    wrapper: 'bg-teal text-white',
  },
  palm: {
    Icon: Lighthouse,
    wrapper: 'bg-[#7EC8D8] text-white',
  },
  island: {
    Icon: Palmtree,
    wrapper: 'bg-[#5EAAA8] text-white',
  },
  gear: {
    Icon: Sun,
    wrapper: 'bg-[#056B72] text-white',
  },
  leaf: {
    Icon: Leaf,
    wrapper: 'bg-[#8BC9A8] text-white',
  },
  marketing: {
    Icon: Megaphone,
    wrapper: 'bg-[#078C95] text-white',
  },
  brand: {
    Icon: Palette,
    wrapper: 'bg-[#7EC8D8] text-white',
  },
  chart: {
    Icon: LineChart,
    wrapper: 'bg-[#056B72] text-white',
  },
  sparkles: {
    Icon: Sparkles,
    wrapper: 'bg-[#8BC9A8] text-white',
  },
  building: {
    Icon: Building2,
    wrapper: 'bg-[#078C95] text-white',
  },
  globe: {
    Icon: Globe,
    wrapper: 'bg-teal text-white',
  },
  landmark: {
    Icon: Landmark,
    wrapper: 'bg-[#7EC8D8] text-white',
  },
  briefcase: {
    Icon: Briefcase,
    wrapper: 'bg-[#056B72] text-white',
  },
  festival: {
    Icon: PartyPopper,
    wrapper: 'bg-[#5EAAA8] text-white',
  },
  presentation: {
    Icon: Presentation,
    wrapper: 'bg-[#8BC9A8] text-white',
  },
  users: {
    Icon: UsersRound,
    wrapper: 'bg-[#078C95] text-white',
  },
  graduation: {
    Icon: GraduationCap,
    wrapper: 'bg-teal text-white',
  },
  report: {
    Icon: FileText,
    wrapper: 'bg-[#078C95] text-white',
  },
  video: {
    Icon: Video,
    wrapper: 'bg-[#7EC8D8] text-white',
  },
  book: {
    Icon: BookOpen,
    wrapper: 'bg-[#5EAAA8] text-white',
  },
}

interface ServiceExperienceIconProps {
  type: ServiceExperienceIconType
  className?: string
}

export function ServiceExperienceIcon({ type, className }: ServiceExperienceIconProps) {
  const { Icon, wrapper } = ICON_CONFIG[type]

  return (
    <span
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12',
        wrapper,
        className,
      )}
      aria-hidden
    >
      <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2} />
    </span>
  )
}
