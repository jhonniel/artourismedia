import { useLocation } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { RichContent } from '@/components/ui/RichContent'
import { canonicalUrl, webPageJsonLd } from '@/lib/structuredData'
import { usePage } from '@/hooks'

export default function CmsPage() {
  const location = useLocation()
  const slug = location.pathname.replace(/^\//, '')
  const { data, isLoading, isError, refetch } = usePage(slug)

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
        <ErrorMessage message="Page not found." onRetry={() => refetch()} />
      </Container>
    )
  }

  const canonical = canonicalUrl(`/${slug}`)

  return (
    <>
      <SEO
        title={data.seo_title ?? data.title}
        description={data.seo_description}
        url={canonical}
        jsonLd={webPageJsonLd(data, canonical)}
      />
      <Container className="py-16 md:py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold md:text-5xl">{data.title}</h1>
            {data.content && (
              <RichContent html={data.content} className="prose-content mt-8 text-lg" />
            )}
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
