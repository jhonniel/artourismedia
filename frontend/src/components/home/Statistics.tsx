import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { CountUp } from '@/components/ui/CountUp'
import { CmsIcon } from '@/components/ui/CmsIcon'
import type { HomepageSection, Statistic } from '@/types'

interface StatisticsProps {
  section: HomepageSection
  statistics: Statistic[]
}

const STAT_BG = '/images/projects/camiguin.png'

export function Statistics({ section, statistics }: StatisticsProps) {
  const sorted = [...statistics].sort((a, b) => a.sort_order - b.sort_order)

  if (sorted.length === 0) return null

  return (
    <section className="relative overflow-hidden py-14 md:py-16">
      <img
        src={STAT_BG}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/78" aria-hidden="true" />

      <Container className="relative">
        {section.title && (
          <FadeIn>
            <p className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
              {section.title}
            </p>
          </FadeIn>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-dashed lg:divide-white/15">
          {sorted.map((stat, index) => (
            <FadeIn key={stat.uuid} delay={index * 100}>
              <div className="px-2 text-center lg:px-6">
                {stat.icon && (
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/80 text-white sm:h-14 sm:w-14">
                    <CmsIcon name={stat.icon} size="md" light />
                  </div>
                )}
                <div className="text-2xl font-bold text-white md:text-3xl">
                  <CountUp
                    value={stat.number ?? ''}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    delay={index * 100}
                  />
                </div>
                <h3 className="mt-2 text-sm font-bold text-white sm:text-base">{stat.title}</h3>
                {stat.description && (
                  <p className="mt-1 text-xs text-white/70 sm:text-sm">{stat.description}</p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
