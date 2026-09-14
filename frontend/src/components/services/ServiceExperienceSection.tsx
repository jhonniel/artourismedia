import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { ServiceExperienceIcon } from '@/components/services/ServiceExperienceIcon'
import { getExperienceItemIcon, getServiceExperienceConfig } from '@/lib/serviceExperienceConfig'

interface ServiceExperienceSectionProps {
  slug: string
  items: string[]
}

export function ServiceExperienceSection({ slug, items }: ServiceExperienceSectionProps) {
  const { sectionDescription } = getServiceExperienceConfig(slug)

  return (
    <section className="service-experience bg-white py-14 md:py-16 lg:py-20">
      <Container>
        <FadeIn>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end lg:gap-10">
            <div>
              <p className="service-experience__eyebrow">Projects and Experience</p>
              <h2 className="service-experience__title mt-3 text-[1.85rem] font-bold leading-tight text-navy sm:text-[2.1rem] lg:text-[2.35rem]">
                Projects and Experience
              </h2>
            </div>
            <p className="service-experience__description max-w-xl text-base leading-relaxed lg:pb-1 lg:text-[1.05rem]">
              {sectionDescription}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:grid-cols-3 lg:gap-5">
            {items.map((item, index) => {
              const icon = getExperienceItemIcon(slug, index)

              return (
                <article
                  key={`${index}-${item}`}
                  className="service-experience__card flex min-h-[5.5rem] items-center gap-4 rounded-[1.15rem] border border-navy/[0.06] bg-white px-4 py-4 shadow-[0_8px_28px_rgb(11_36_71/0.045)] sm:min-h-[6rem] sm:rounded-[1.25rem] sm:px-5"
                >
                  {icon && <ServiceExperienceIcon type={icon} />}
                  <p className="text-sm font-medium leading-snug text-navy sm:text-[0.9375rem]">{item}</p>
                </article>
              )
            })}
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
