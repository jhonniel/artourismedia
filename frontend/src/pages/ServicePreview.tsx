import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CmsIcon } from '@/components/ui/CmsIcon'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LazyImage } from '@/components/ui/LazyImage'
import { FadeIn } from '@/components/ui/FadeIn'
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
      <Container className="pt-6 pb-16 md:pt-8 md:pb-24">
        <FadeIn>
          <Link to="/services" className="text-sm font-semibold text-teal hover:text-orange transition-colors">
            ← All services
          </Link>

          <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              {data.icon && (
                <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal/10 text-teal">
                  <CmsIcon name={data.icon} size="lg" />
                </span>
              )}
              <h1 className="text-4xl font-bold md:text-5xl">{data.title}</h1>
              {data.description && (
                <p className="mt-4 text-lg text-navy/70 leading-relaxed">{data.description}</p>
              )}
              {data.content && (
                <div
                  className="prose-content prose-content-service mt-8"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              )}
              {data.cta_text && data.cta_url && (
                <div className="mt-8">
                  {data.cta_url.startsWith('http') ? (
                    <a href={data.cta_url}>
                      <Button variant="orange">{data.cta_text}</Button>
                    </a>
                  ) : (
                    <Link to={data.cta_url}>
                      <Button variant="orange">{data.cta_text}</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {data.image_url && (
              <LazyImage
                src={data.image_url}
                alt={data.title}
                wrapperClassName="rounded-3xl shadow-elevated aspect-[4/3]"
              />
            )}
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
