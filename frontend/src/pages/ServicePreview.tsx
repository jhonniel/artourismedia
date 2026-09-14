import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ServiceHeroImage } from '@/components/services/ServiceHeroImage'
import { FadeIn } from '@/components/ui/FadeIn'
import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { getServiceHeroOverrides } from '@/lib/serviceHeroConfig'

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

  const heroOverrides = getServiceHeroOverrides(data.slug)

  return (
    <>
      <div className="sticky top-20 z-40 border-b border-orange/20 bg-orange/10 py-2 text-center text-sm font-semibold text-orange">
        <Badge variant="orange" className="mr-2">Preview Mode</Badge>
        This inactive service is only visible with a valid preview link.
      </div>
      <SEO title={`Preview: ${data.title}`} description={data.description} noindex />
      <Container className="pt-6 pb-16 md:pt-8 md:pb-24 lg:pt-0">
        <FadeIn>
          <div className="relative lg:min-h-[calc(100vh-var(--header-height))]">
            {data.image_url && (
              <div className="absolute inset-y-0 hidden overflow-hidden lg:block lg:left-[8%] lg:-right-8 xl:-right-10">
                <ServiceHeroImage
                  src={data.image_url}
                  alt={data.title}
                  imageWrapperClassName={heroOverrides.imageWrapperClassName}
                  imageClassName={heroOverrides.imageClassName}
                  gradientStyle={heroOverrides.gradientStyle}
                />
              </div>
            )}

            <div className="relative z-10 grid gap-12 lg:grid-cols-2">
              <div className="lg:pt-8">
                <Link to="/services" className="text-sm font-semibold text-teal hover:text-orange transition-colors">
                  ← All services
                </Link>

                <div className="mt-6">
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
              </div>

              {data.image_url && <div className="hidden lg:block" aria-hidden />}
            </div>

            {data.image_url && (
              <div className="relative z-10 mt-8 min-h-[18rem] sm:min-h-[22rem] lg:hidden">
                <ServiceHeroImage src={data.image_url} alt={data.title} />
              </div>
            )}
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
