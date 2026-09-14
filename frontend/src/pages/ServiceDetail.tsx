import { useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { ServiceDetailView } from '@/components/services/ServiceDetailView'
import { canonicalUrl, serviceJsonLd } from '@/lib/structuredData'
import { useService } from '@/hooks'

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, isError, refetch } = useService(slug ?? '')

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
        <ErrorMessage message="Service not found." onRetry={() => refetch()} />
      </Container>
    )
  }

  const pageUrl = canonicalUrl(`/services/${data.slug}`)

  return (
    <>
      <SEO
        title={data.title}
        description={data.description}
        image={data.image_url}
        url={pageUrl}
        jsonLd={serviceJsonLd(data, pageUrl)}
      />
      <ServiceDetailView service={data} />
    </>
  )
}
