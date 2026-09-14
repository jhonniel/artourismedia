import { useParams, useSearchParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { Badge } from '@/components/ui/Badge'
import { ServiceDetailView } from '@/components/services/ServiceDetailView'
import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'

export default function ServicePreview() {
  const { uuid = '' } = useParams<{ uuid: string }>()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['service-preview', uuid, token],
    queryFn: () => endpoints.servicePreview(uuid, token),
    enabled: Boolean(uuid && token),
  })

  if (!token) {
    return (
      <Container className="py-24">
        <ErrorMessage message="Preview token is missing or invalid." />
      </Container>
    )
  }

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
        <ErrorMessage message="Preview unavailable or expired." onRetry={() => refetch()} />
      </Container>
    )
  }

  return (
    <>
      <div className="sticky top-20 z-40 border-b border-orange/20 bg-orange/10 py-2 text-center text-sm font-semibold text-orange">
        <Badge variant="orange" className="mr-2">Preview Mode</Badge>
        This inactive service is only visible with a valid preview link.
      </div>
      <SEO title={`Preview: ${data.title}`} description={data.description} noindex />
      <ServiceDetailView service={data} />
    </>
  )
}
