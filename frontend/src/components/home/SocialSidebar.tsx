import type { SocialLink } from '@/types'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { cn } from '@/lib/utils'

interface SocialSidebarProps {
  links: SocialLink[]
}

const linkClassName = cn(
  'flex h-10 w-10 items-center justify-center rounded-full',
  'border border-navy/10 bg-white/80 text-navy/60 backdrop-blur-sm',
  'transition-all duration-200 hover:border-teal hover:bg-teal hover:text-white hover:scale-110',
)

export function SocialSidebar({ links }: SocialSidebarProps) {
  const sorted = [...links].sort((a, b) => a.sort_order - b.sort_order)

  if (sorted.length === 0) return null

  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <aside
        className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
        aria-label="Social media links"
      >
        {sorted.map((link) => (
          <a
            key={link.uuid}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
            aria-label={link.platform}
          >
            <SocialIcon platform={link.platform} />
          </a>
        ))}
      </aside>

      {/* Mobile / tablet: fixed bottom bar */}
      <nav
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-full border border-navy/10 bg-white/90 px-3 py-2 shadow-elevated backdrop-blur-sm xl:hidden"
        aria-label="Social media links"
      >
        {sorted.map((link) => (
          <a
            key={link.uuid}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
            aria-label={link.platform}
          >
            <SocialIcon platform={link.platform} />
          </a>
        ))}
      </nav>
    </>
  )
}
