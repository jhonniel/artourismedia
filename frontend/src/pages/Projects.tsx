import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Button } from '@/components/ui/Button'
import { useProjects } from '@/hooks'
import { useState } from 'react'

export default function Projects() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useProjects({ page, per_page: 9 })

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
        <ErrorMessage message="Unable to load projects." onRetry={() => refetch()} />
      </Container>
    )
  }

  return (
    <>
      <SEO title="Projects" description="Explore our portfolio of tourism development projects." />
      <Container className="py-16 md:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow="Portfolio"
            title="Featured"
            accent="Projects"
            description="Destination strategies and tourism initiatives we've helped bring to life."
            align="center"
          />
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((project, index) => (
            <FadeIn key={project.uuid} delay={index * 60}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>

        {data.meta.last_page > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-navy/60">
              Page {data.meta.current_page} of {data.meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Container>
    </>
  )
}
