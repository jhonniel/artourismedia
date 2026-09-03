import { useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { PostDetailView } from '@/components/blog/PostDetail'
import { usePost } from '@/hooks'

export default function InsightDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, isError, refetch } = usePost(slug ?? '')

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
        <ErrorMessage message="Insight not found." onRetry={() => refetch()} />
      </Container>
    )
  }

  return (
    <>
      <SEO
        title={data.seo_title ?? data.title}
        description={data.seo_description ?? data.excerpt}
        image={data.featured_image_url}
        type="article"
        url={typeof window !== 'undefined' ? `${window.location.origin}/insights/${data.slug}` : undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.excerpt,
          image: data.featured_image_url,
          datePublished: data.published_at,
          author: data.author ? { '@type': 'Person', name: data.author.name } : undefined,
        }}
      />
      <PostDetailView post={data} related={data.related} previous={data.previous} next={data.next} />
    </>
  )
}
