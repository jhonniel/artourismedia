import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { SectionRenderer } from '@/components/home/SectionRenderer'
import { organizationJsonLd, websiteJsonLd } from '@/lib/structuredData'
import { useHomepage, useSite } from '@/hooks'

export default function Home() {
  const { data: site } = useSite()
  const { data, isLoading, isError, refetch } = useHomepage()

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
        <ErrorMessage message="Unable to load homepage." onRetry={() => refetch()} />
      </Container>
    )
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : undefined

  return (
    <>
      <SEO
        title={site?.settings.site_name}
        description={site?.settings.tagline ?? site?.settings.default_seo_description}
        jsonLd={[
          organizationJsonLd(site?.settings ?? {}),
          websiteJsonLd(site?.settings.site_name, siteUrl),
        ]}
      />
      <SectionRenderer data={data} socialLinks={site?.social_links ?? []} />
    </>
  )
}
