import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ServiceHeroImage } from '@/components/services/ServiceHeroImage'
import { ServiceHeroTitle } from '@/components/services/ServiceHeroTitle'
import { RichContent } from '@/components/ui/RichContent'
import { getServiceHeroOverrides } from '@/lib/serviceHeroConfig'
import { cn } from '@/lib/utils'
import type { Service } from '@/types'

interface ServiceDetailHeroProps {
  service: Service
  introHtml?: string
}

export function ServiceDetailHero({ service, introHtml }: ServiceDetailHeroProps) {
  const heroOverrides = getServiceHeroOverrides(service.slug)

  return (
    <section className="service-detail-hero overflow-hidden bg-white">
      <Container className="relative lg:pt-0">
        <div className="relative">
          {service.image_url && (
            <div
              className={cn(
                'service-detail-hero__image-blob pointer-events-none absolute inset-y-0 hidden lg:block',
                heroOverrides.blobClassName,
              )}
            >
              <ServiceHeroImage
                src={service.image_url}
                alt={service.title}
                surface="white"
                hideGradient
                imageWrapperClassName={heroOverrides.imageWrapperClassName}
                imageClassName={heroOverrides.imageClassName}
              />
            </div>
          )}

          <div className="relative z-[2] grid gap-8 lg:grid-cols-2 lg:gap-8 xl:gap-10">
            <div className="service-detail-hero__copy relative z-[2] py-10 md:py-12 lg:py-16 xl:py-[4.5rem] lg:pr-4 xl:pr-6">
              <p className="service-detail-hero__eyebrow">
                <span className="service-detail-hero__eyebrow-line" aria-hidden="true" />
                Our Services
              </p>

              <ServiceHeroTitle title={service.title} />

              {service.description && (
                <p className="service-detail-hero__body mt-5 max-w-[34rem] sm:mt-6">{service.description}</p>
              )}

              {introHtml && (
                <RichContent
                  html={introHtml}
                  className="service-detail-hero__body service-detail-hero__intro mt-4 max-w-[34rem] sm:mt-5"
                />
              )}

              {service.cta_text && service.cta_url && (
                <div className="mt-7 sm:mt-8">
                  {service.cta_url.startsWith('http') ? (
                    <a href={service.cta_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="orange">{service.cta_text}</Button>
                    </a>
                  ) : (
                    <Link to={service.cta_url}>
                      <Button variant="orange">{service.cta_text}</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {service.image_url && <div className="hidden min-h-[1px] lg:block" aria-hidden />}
          </div>

          {service.image_url && (
            <div
              className={cn(
                'service-detail-hero__image-mobile relative z-[2] mt-8 min-h-[18rem] overflow-hidden sm:min-h-[22rem] lg:hidden',
                heroOverrides.mobileBlobClassName,
              )}
            >
              <ServiceHeroImage
                src={service.image_url}
                alt={service.title}
                surface="white"
                hideGradient
                imageClassName={heroOverrides.imageClassName}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
