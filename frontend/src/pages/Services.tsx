import { Link } from 'react-router-dom'
import { ServiceIcon, serviceIconImageClass, serviceIconWrapperClass } from '@/components/icons/ServiceIcons'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { GroveContourLines } from '@/components/ui/Decorative'
import { useServices } from '@/hooks'
import type { Service } from '@/types'

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

const CARD_WAVE_PALETTES = [
  { back: '#efe6d4', front: '#d7eee4' },
  { back: '#efe6d4', front: '#d9edf3' },
  { back: '#f3eee4', front: '#d7eee4' },
  { back: '#efe6d4', front: '#e3f0dc' },
  { back: '#f3eee4', front: '#d9edf3' },
]

function CardWave({ index }: { index: number }) {
  const palette = CARD_WAVE_PALETTES[index % CARD_WAVE_PALETTES.length]

  return (
    <svg
      className="services-bento__wave"
      viewBox="0 0 320 160"
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden="true"
    >
      <ellipse cx="262" cy="136" rx="118" ry="102" fill={palette.back} />
      <ellipse cx="148" cy="152" rx="108" ry="78" fill={palette.front} />
    </svg>
  )
}

function ServiceOfferCard({
  service,
  index,
  total,
}: {
  service: Service
  index: number
  total: number
}) {
  const href = service.cta_url || `/services/${service.slug}`
  const external = Boolean(service.cta_url?.startsWith('http'))
  const compactCta = 'Projects and Experience'
  const expandedCta = service.cta_text || 'Explore Projects'
  const count = `${pad(index + 1)} / ${pad(total)}`

  const body = (
    <article className="services-bento__card">
      <p className="services-bento__eyebrow">Our expertise</p>

      <div className="services-bento__top">
        <div className="services-bento__icon-col">
          <div
            className={cn(
              'services-bento__icon flex items-center justify-center',
              serviceIconWrapperClass(service.slug, service.icon, 'card', 'bg-teal/10 text-teal'),
            )}
          >
            <ServiceIcon
              slug={service.slug}
              icon={service.icon}
              className={cn(
                'services-bento__icon-img',
                serviceIconImageClass(service.slug, service.icon, 'card'),
              )}
            />
          </div>
          <span className="services-bento__count">{count}</span>
        </div>

        <div className="services-bento__copy">
          <h2 className="services-bento__title">{service.title}</h2>
          {service.description && <p className="services-bento__body">{service.description}</p>}
          <span className="services-bento__link">
            {compactCta}
            <span aria-hidden>→</span>
          </span>
          <span className="services-bento__button">
            {expandedCta}
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>

      <CardWave index={index} />
    </article>
  )

  const className = 'services-bento__hit'

  if (external) {
    return (
      <a href={href} className={className}>
        {body}
      </a>
    )
  }

  return (
    <Link to={href} className={className}>
      {body}
    </Link>
  )
}

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
      <section className="services-page">
        <GroveContourLines className="services-page__grove" />
        <Container className="relative z-10 py-16 md:py-24">
          <FadeIn>
            <SectionHeading
              eyebrow="What we offer"
              title="Our"
              accent="Services"
              description="Comprehensive tourism development and destination strategy solutions."
              align="center"
            />
          </FadeIn>

          <div className="services-bento">
            {services.map((service, index) => (
              <FadeIn key={service.uuid} delay={index * 80} className="services-bento__cell">
                <ServiceOfferCard service={service} index={index} total={services.length} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
