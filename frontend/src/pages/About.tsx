import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { AboutPageView } from '@/components/about/AboutPageView'
import { canonicalUrl, webPageJsonLd } from '@/lib/structuredData'
import { mergeAboutMetadata } from '@/lib/aboutDefaults'
import { usePage } from '@/hooks'

export default function About() {
  const { data, isLoading, isError, refetch } = usePage('about')

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="px-4 py-24">
        <ErrorMessage message="Unable to load about page." onRetry={() => refetch()} />
      </div>
    )
  }

  const pageUrl = canonicalUrl('/about')
  const metadata = mergeAboutMetadata(data.metadata, data.content)

  return (
    <>
      <SEO
        title={data.seo_title ?? data.title}
        description={data.seo_description}
        url={pageUrl}
        jsonLd={webPageJsonLd(data, pageUrl)}
      />
      <AboutPageView metadata={metadata} />
    </>
  )
}
