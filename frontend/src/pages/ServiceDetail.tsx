import { Link, useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ServiceHeroImage } from '@/components/services/ServiceHeroImage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { RichContent } from '@/components/ui/RichContent'
import { canonicalUrl, serviceJsonLd } from '@/lib/structuredData'
import { useService } from '@/hooks'
import { getServiceHeroOverrides } from '@/lib/serviceHeroConfig'
import { ServiceVideoGallery } from '@/components/services/ServiceVideoGallery'

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
  const heroOverrides = getServiceHeroOverrides(data.slug)

  return (
    <>
      <SEO
        title={data.title}
        description={data.description}
        image={data.image_url}
        url={pageUrl}
        jsonLd={serviceJsonLd(data, pageUrl)}
      />
      <Container className="pt-6 pb-16 md:pt-8 md:pb-24 lg:pt-0">
        <FadeIn immediate>
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
              <div className="relative lg:pt-8 lg:pr-6">
                <Link to="/services" className="text-sm font-semibold text-teal hover:text-orange transition-colors">
                  ← All services
                </Link>

                <div className="mt-6">
                  <h1 className="text-4xl font-bold md:text-5xl">{data.title}</h1>
                  {data.description && (
                    <p className="mt-4 text-lg text-navy/70 leading-relaxed">{data.description}</p>
                  )}
                  {data.content && (
                    <RichContent
                      html={data.content}
                      className="prose-content prose-content-service mt-8"
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

          {data.videos && data.videos.length > 0 && (
            <ServiceVideoGallery videos={data.videos} title="Mindanao CONNECT Videos" />
          )}
        </FadeIn>
      </Container>
    </>
  )
}
