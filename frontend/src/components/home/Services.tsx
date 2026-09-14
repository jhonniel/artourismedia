import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FadeIn } from '@/components/ui/FadeIn'
import { ServiceIcon, serviceIconImageClass, serviceIconWrapperClass } from '@/components/icons/ServiceIcons'
import type { HomepageSection, Service } from '@/types'
import { cn } from '@/lib/utils'

interface ServicesSectionProps {
  section: HomepageSection
  services: Service[]
}

export function ServicesSection({ section, services }: ServicesSectionProps) {
  const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order)
  const description = section.content.description as string | undefined
  const accent = section.content.title_accent as string | undefined

  if (sorted.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow={(section.content.eyebrow as string) ?? 'Our Services'}
            title={section.content.title as string ?? section.title ?? 'Our Services'}
            accent={accent}
            description={description}
            align="center"
            tone="landing"
          />
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
          {sorted.map((service, index) => (
            <FadeIn key={service.uuid} delay={index * 100} className="h-full">
              <Link to={`/services/${service.slug}`} className="group block h-full">
                <article className="flex h-full min-h-[12.5rem] flex-col rounded-[1.25rem] border border-navy/5 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated sm:min-h-[13.5rem] sm:rounded-[1.5rem] sm:p-6 lg:rounded-[1.75rem]">
                  <div
                    className={cn(
                      'mb-4 flex h-14 shrink-0 items-center justify-center sm:mb-5 sm:h-16',
                      serviceIconWrapperClass(service.slug, service.icon, 'home'),
                    )}
                  >
                    <ServiceIcon
                      slug={service.slug}
                      icon={service.icon}
                      className={serviceIconImageClass(service.slug, service.icon, 'home')}
                    />
                  </div>
                  <h3 className="min-h-[4.125rem] break-words text-base font-bold leading-snug text-navy transition-colors group-hover:text-teal sm:min-h-[4.75rem] sm:text-lg">
                    {service.title}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold uppercase tracking-[0.04em] text-orange sm:pt-5">
                    Projects & Experience
                    <span aria-hidden className="shrink-0">→</span>
                  </span>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
