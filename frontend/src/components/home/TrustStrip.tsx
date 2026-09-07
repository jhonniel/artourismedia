import { Link } from 'react-router-dom'
import { FadeIn } from '@/components/ui/FadeIn'
import { CmsIcon } from '@/components/ui/CmsIcon'
import type { TrustStripItem } from '@/types'
import { cn } from '@/lib/utils'

interface TrustStripProps {
  items: TrustStripItem[]
  title?: string
  embedded?: boolean
}

const TRUST_COLORS = ['bg-teal', 'bg-orange', 'bg-navy', 'bg-purple', 'bg-teal']

export function TrustStrip({ items, title, embedded = false }: TrustStripProps) {
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)

  if (sorted.length === 0) return null

  return (
    <section className={cn('relative z-30 bg-white', embedded ? 'pt-2 pb-8 md:pb-10' : 'py-10 md:py-12')}>
      <FadeIn>
        <div
          className={cn(
            'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 xl:px-10',
            embedded ? undefined : 'rounded-[1.75rem] border border-navy/5 bg-white px-4 py-6 shadow-card sm:px-6 md:rounded-[2rem]',
          )}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
            {title && (
              <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-teal sm:text-[11px] lg:max-w-[9rem] lg:leading-relaxed">
                {title}
              </p>
            )}

            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {sorted.map((item, index) => (
                <FadeIn key={item.uuid} delay={index * 60}>
                  <TrustItem item={item} colorClass={TRUST_COLORS[index % TRUST_COLORS.length]} />
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

function TrustItem({ item, colorClass }: { item: TrustStripItem; colorClass: string }) {
  const content = (
    <div className="flex items-center gap-3 rounded-full border border-navy/8 bg-white px-3 py-2.5 shadow-soft sm:px-3.5">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white sm:h-11 sm:w-11',
          colorClass,
        )}
      >
        <CmsIcon name={item.icon} size="md" light />
      </div>
      <div className="min-w-0 text-left">
        <h3 className="text-[11px] font-bold leading-tight text-navy">{item.title}</h3>
        {item.description && (
          <p className="mt-0.5 text-[10px] leading-snug text-navy/50">{item.description}</p>
        )}
      </div>
    </div>
  )

  if (item.link) {
    return item.link.startsWith('http') ? (
      <a href={item.link} className="block transition-opacity hover:opacity-85">{content}</a>
    ) : (
      <Link to={item.link} className="block transition-opacity hover:opacity-85">{content}</Link>
    )
  }

  return content
}
