import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { FadeIn } from '@/components/ui/FadeIn'
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
    <section className="relative bg-cream py-12 md:py-16 lg:py-20">
      <Container className="relative">
        <FadeIn>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10 xl:gap-14">
            <div>
              <h1 className="font-serif text-[2rem] leading-[1.08] text-navy sm:text-[2.35rem] lg:text-[2.65rem]">
                <span className="font-bold">Featured</span>{' '}
                <span className="italic text-teal">Projects</span>
              </h1>
              <p className="mt-3 max-w-lg font-body text-sm leading-relaxed text-navy/65 sm:text-base">
                Destination strategies and tourism initiatives we&apos;ve helped bring to life.
              </p>
            </div>

            <div className="border-l border-navy/20 pl-6 lg:pl-8">
              <p className="font-serif text-base italic leading-relaxed text-navy/60 sm:text-[1.0625rem] sm:leading-[1.65]">
                From islands to communities, we work with destinations to create a more sustainable
                and vibrant tomorrow.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="mt-10 flex flex-col gap-5 sm:mt-12">
            <div className="flex flex-wrap gap-2.5">
              {availableFilters.map((filter) => {
                const isActive = categoryFilter === filter

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => handleCategoryChange(filter)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:px-5 sm:py-2.5 sm:text-sm',
                      isActive
                        ? 'border-navy bg-navy text-white'
                        : 'border-navy/20 bg-white text-navy hover:border-navy/35',
                    )}
                  >
                    {filter}
                  </button>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  aria-label="Previous projects"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 bg-white text-navy/70 transition-colors hover:border-navy/30 hover:text-navy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←
                </button>
                <span className="min-w-[4.5rem] text-center text-sm font-medium tabular-nums text-navy/60">
                  {formatPageNumber(currentPage)} / {formatPageNumber(totalPages)}
                </span>
                <button
                  type="button"
                  aria-label="Next projects"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 bg-white text-navy/70 transition-colors hover:border-navy/30 hover:text-navy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </FadeIn>

        {featuredProject ? (
          <FadeIn delay={120}>
            <div className="mt-6 rounded-[1.5rem] bg-[#F3EDE3] p-4 sm:mt-8 sm:p-5 lg:p-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-5">
                <FeaturedProjectCard project={featuredProject} />
                <div className="flex flex-col gap-3 sm:gap-4">
                  {listProjects.map((project) => (
                    <ProjectListCard key={project.uuid} project={project} />
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={120}>
            <div className="mt-8 rounded-[1.5rem] border border-navy/10 bg-white p-10 text-center">
              <p className="text-navy/60">No projects match this category yet.</p>
            </div>
          </FadeIn>
        )}
      </Container>
    </section>
  )
}
