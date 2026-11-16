import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FeaturedProjectCard } from '@/components/projects/FeaturedProjectCard'
import { ProjectListCard } from '@/components/projects/ProjectListCard'
import {
  filterProjectsByCategory,
  PROJECT_CATEGORY_FILTERS,
  PROJECTS_PER_PAGE,
  type ProjectCategoryFilter,
} from '@/lib/projectDisplay'
import type { Project } from '@/types'

interface ProjectsPortfolioProps {
  projects: Project[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

function formatPageNumber(value: number): string {
  return value.toString().padStart(2, '0')
}

export function ProjectsPortfolio({
  projects,
  isLoading,
  isError,
  onRetry,
}: ProjectsPortfolioProps) {
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategoryFilter>('All Projects')
  const [page, setPage] = useState(1)

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.sort_order - b.sort_order),
    [projects],
  )

  const availableFilters = useMemo(() => {
    const labels = new Set(
      sortedProjects
        .map((project) => project.category_label)
        .filter((label): label is string => Boolean(label)),
    )

    return PROJECT_CATEGORY_FILTERS.filter(
      (filter) => filter === 'All Projects' || labels.has(filter),
    )
  }, [sortedProjects])

  const filteredProjects = useMemo(
    () => filterProjectsByCategory(sortedProjects, categoryFilter),
    [sortedProjects, categoryFilter],
  )

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const currentPage = Math.min(page, totalPages)

  const pageProjects = useMemo(() => {
    const start = (currentPage - 1) * PROJECTS_PER_PAGE
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE)
  }, [filteredProjects, currentPage])

  const featuredProject = pageProjects[0]
  const listProjects = pageProjects.slice(1)

  const handleCategoryChange = (filter: ProjectCategoryFilter) => {
    setCategoryFilter(filter)
    setPage(1)
  }

  if (isLoading) {
    return (
      <Container className="py-24">
        <LoadingSpinner size="lg" />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container className="py-24">
        <ErrorMessage message="Unable to load projects." onRetry={onRetry} />
      </Container>
    )
  }

  return (
    <section className="projects-index bg-cream py-14 md:py-20 lg:py-24">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Our work"
            title="Featured"
            accent="Projects"
            description="Destination strategies and tourism initiatives we've helped bring to life — from islands to communities."
            align="center"
            tone="landing"
            className="mb-8 md:mb-10"
          />
        </FadeIn>

        <FadeIn delay={80}>
          <div className="projects-index__toolbar">
            <div className="projects-index__filters" aria-label="Filter projects by category">
              {availableFilters.map((filter) => {
                const isActive = categoryFilter === filter

                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleCategoryChange(filter)}
                    className={cn('projects-index__filter', isActive && 'is-active')}
                  >
                    {filter}
                  </button>
                )
              })}
            </div>
            <p className="projects-index__count">
              {filteredProjects.length.toString().padStart(2, '0')}{' '}
              {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>
        </FadeIn>

        {featuredProject ? (
          <>
            <FadeIn delay={120}>
              <FeaturedProjectCard project={featuredProject} />
            </FadeIn>

            {listProjects.length > 0 && (
              <FadeIn delay={160}>
                <div className="projects-index__grid">
                  {listProjects.map((project) => (
                    <ProjectListCard key={project.uuid} project={project} />
                  ))}
                </div>
              </FadeIn>
            )}
          </>
        ) : (
          <FadeIn delay={120}>
            <div className="projects-index__empty">
              <p>No projects match this category yet.</p>
            </div>
          </FadeIn>
        )}

        {totalPages > 1 && (
          <div className="projects-index__pager">
            <button
              type="button"
              aria-label="Previous projects"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="projects-index__page-btn"
            >
              ←
            </button>
            <span className="projects-index__page-status">
              {formatPageNumber(currentPage)} / {formatPageNumber(totalPages)}
            </span>
            <button
              type="button"
              aria-label="Next projects"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="projects-index__page-btn"
            >
              →
            </button>
          </div>
        )}
      </Container>
    </section>
  )
}
