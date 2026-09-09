import { Link } from 'react-router-dom'
import { ServiceIcon, serviceIconImageClass, serviceIconWrapperClass } from '@/components/icons/ServiceIcons'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { useServices } from '@/hooks'

export default function Services() {
  const { data, isLoading, isError, refetch } = useServices()

  if (isLoading) {
    return (
      <Container className="py-24">
        <LoadingSpinner size="lg" />
      </Container>
    )
  }

  if (isError || !data) {
    return (
      <Container className="py-24">
        <ErrorMessage message="Unable to load services." onRetry={() => refetch()} />
      </Container>
    )
  }

  const services = [...data].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <>
      <SEO title="Services" description="Explore our tourism consultancy services." />
      <Container className="py-16 md:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow="What we offer"
            title="Our"
            accent="Services"
            description="Comprehensive tourism development and destination strategy solutions."
            align="center"
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <FadeIn key={service.uuid} delay={index * 80}>
              <Link to={`/services/${service.slug}`} className="block h-full group">
                <Card hover className="h-full">
                  <div
                    className={cn(
                      'mb-4 flex items-center justify-center transition-colors',
                      serviceIconWrapperClass(
                        service.slug,
                        service.icon,
                        'card',
                        'bg-teal text-white group-hover:bg-teal/90',
                      ),
                    )}
                  >
                    <ServiceIcon
                      slug={service.slug}
                      icon={service.icon}
                      className={serviceIconImageClass(service.slug, service.icon, 'card')}
                    />
                  </div>
                  <h2 className="text-xl font-bold group-hover:text-teal transition-colors">{service.title}</h2>
                  {service.description && (
                    <p className="mt-3 text-navy/60 leading-relaxed line-clamp-3">{service.description}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-base font-semibold text-teal md:text-lg">
                    Projects and Experience
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </>
  )
}
