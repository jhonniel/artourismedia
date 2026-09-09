import { Link, useParams } from 'react-router-dom'
import { ServiceIcon, serviceIconImageClass, serviceIconWrapperClass } from '@/components/icons/ServiceIcons'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { LazyImage } from '@/components/ui/LazyImage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { canonicalUrl, serviceJsonLd } from '@/lib/structuredData'
import { useService } from '@/hooks'
import { ServiceVideoGallery } from '@/components/services/ServiceVideoGallery'
import { FeaturedMostWatchedVideos } from '@/components/services/FeaturedMostWatchedVideos'

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
  const featuredVideos = data.featured_videos ?? []
  const showFeaturedPanel = data.slug === 'mindanao-connect' && featuredVideos.length > 0

  return (
    <>
      <SEO
        title={data.title}
        description={data.description}
        image={data.image_url}
        url={pageUrl}
        jsonLd={serviceJsonLd(data, pageUrl)}
      />
      <Container className="pt-6 pb-16 md:pt-8 md:pb-24">
        <FadeIn immediate>
          <Link to="/services" className="text-sm font-semibold text-teal hover:text-orange transition-colors">
            ← All services
          </Link>

          <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              {data.slug !== 'mindanao-connect' && (
                <span
                  className={cn(
                    'mb-4 inline-flex items-center justify-center',
                    serviceIconWrapperClass(data.slug, data.icon, 'detail'),
                  )}
                >
                  <ServiceIcon
                    slug={data.slug}
                    icon={data.icon}
                    className={serviceIconImageClass(data.slug, data.icon, 'detail')}
                  />
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

            {showFeaturedPanel ? (
              <FeaturedMostWatchedVideos videos={featuredVideos} />
            ) : (
              data.image_url && (
                <LazyImage
                  src={data.image_url}
                  alt={data.title}
                  wrapperClassName="rounded-3xl shadow-elevated aspect-[4/3]"
                />
              )
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
