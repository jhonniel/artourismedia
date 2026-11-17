import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { GroveContourLines } from '@/components/ui/Decorative'
import { ServicesBento } from '@/components/services/ServicesBento'
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
      <section className="services-page">
        <GroveContourLines className="services-page__grove" />
        <Container className="relative z-10 py-16 md:py-24">
          <FadeIn>
            <SectionHeading
              eyebrow="What we offer"
              title="Our"
              accent="Services"
              accentClassName="font-serif font-normal italic"
              eyebrowClassName="!text-xs !tracking-[0.3em]"
              description="Comprehensive tourism development and destination strategy solutions."
              align="center"
            />
          </FadeIn>

          <ServicesBento services={services} />
        </Container>
      </section>
    </>
  )
}
