import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FadeIn } from '@/components/ui/FadeIn'
import { ServiceIcon, serviceIconImageClass, serviceIconWrapperClass } from '@/components/icons/ServiceIcons'
import { ServicesScenery } from '@/components/home/HomeScenery'
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
    <section className="home-services relative overflow-hidden pt-14 md:pt-20">
      <ServicesScenery />
      <Container className="relative z-10">
        <FadeIn>
          <SectionHeading
            eyebrow={(section.content.eyebrow as string) ?? 'Our Services'}
            title={section.content.title as string ?? section.title ?? 'Our Services'}
            accent={accent}
            description={description}
            align="center"
            tone="landing"
            accentUnderline="squiggle"
            eyebrowClassName="!text-navy"
          />
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {sorted.map((service, index) => (
            <FadeIn
              key={service.uuid}
              delay={index * 100}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(20%-1.2rem)]"
            >
              <Link to={`/services/${service.slug}`} className="group block h-full">
                <article className="home-services__card flex h-full flex-col rounded-[1.25rem] p-5 transition-all duration-300 hover:-translate-y-1 sm:min-h-[13.5rem] sm:rounded-[1.5rem] sm:p-6">
                  <div
                    className={cn(
                      'mb-3 flex h-14 shrink-0 items-center justify-center sm:mb-5 sm:h-16',
                      serviceIconWrapperClass(service.slug, service.icon, 'home'),
                    )}
                  >
                    <ServiceIcon
                      slug={service.slug}
                      icon={service.icon}
                      className={serviceIconImageClass(service.slug, service.icon, 'home')}
                    />
                  </div>
                  <h3 className="break-words text-base font-bold leading-snug text-navy transition-colors group-hover:text-teal sm:min-h-[4.75rem] sm:text-lg">
                    {service.title}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-bold uppercase tracking-[0.06em] text-orange sm:pt-5">
                    View this service
                    <span aria-hidden className="shrink-0 transition-transform group-hover:translate-x-0.5">→</span>
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
