import { SEO } from '@/components/ui/SEO'
import { ProjectsPortfolio } from '@/components/projects/ProjectsPortfolio'
import { useProjects } from '@/hooks'

export default function Projects() {
  const { data, isLoading, isError, refetch } = useProjects({ per_page: 100 })

  return (
    <>
      <SEO title="Projects" description="Explore our portfolio of tourism development projects." />
      <ProjectsPortfolio
        projects={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
    </>
  )
}
