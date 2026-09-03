import { Link, useParams } from 'react-router-dom'
import { ServiceIcon } from '@/components/icons/ServiceIcons'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { LazyImage } from '@/components/ui/LazyImage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
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
      <Container className="py-16 md:py-24">
        <FadeIn>
          <Link to="/services" className="text-sm font-semibold text-teal hover:text-orange transition-colors">
            ← All services
          </Link>

          <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal text-white shadow-soft">
                <ServiceIcon slug={data.slug} icon={data.icon} className="h-8 w-8" />
              </span>
              <h1 className="text-4xl font-bold md:text-5xl">{data.title}</h1>
              {data.description && (
                <p className="mt-4 text-lg text-navy/70 leading-relaxed">{data.description}</p>
              )}
              {data.content && (
                <div
                  className="prose-content mt-8"
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
