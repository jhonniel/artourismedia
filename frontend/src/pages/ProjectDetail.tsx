import { useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { ProjectDetailView } from '@/components/projects/ProjectDetail'
import { canonicalUrl, projectJsonLd } from '@/lib/structuredData'
import { useProject } from '@/hooks'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, isError, refetch } = useProject(slug ?? '')

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
        <ErrorMessage message="Project not found." onRetry={() => refetch()} />
      </Container>
    )
  }

  const pageUrl = canonicalUrl(`/projects/${data.slug}`)

  return (
    <>
      <SEO
        title={data.seo_title ?? data.title}
        description={data.seo_description ?? data.excerpt}
        image={data.cover_image_url}
        url={pageUrl}
        jsonLd={projectJsonLd(data, pageUrl)}
      />
      <ProjectDetailView project={data} related={data.related} />
    </>
  )
}
