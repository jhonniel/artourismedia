import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { AboutSections } from '@/components/about/AboutSections'
import { canonicalUrl, webPageJsonLd } from '@/lib/structuredData'
import { usePage } from '@/hooks'

export default function About() {
  const { data, isLoading, isError, refetch } = usePage('about')

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
        <ErrorMessage message="Unable to load about page." onRetry={() => refetch()} />
      </Container>
    )
  }

  const pageUrl = canonicalUrl('/about')

  return (
    <>
      <SEO
        title={data.seo_title ?? data.title}
        description={data.seo_description}
        url={pageUrl}
        jsonLd={webPageJsonLd(data, pageUrl)}
      />
      <Container className="py-16 md:py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">{data.title}</h1>
            {data.content && (
              <div
                className="prose-content mt-6 text-lg text-navy/70"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            )}
          </div>
        </FadeIn>
        <AboutSections metadata={data.metadata} />
      </Container>
    </>
  )
}
