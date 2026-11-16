import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LazyImage } from '@/components/ui/LazyImage'
import {
  COVER_OBJECT_POSITION,
  getProjectLocation,
  LOGO_COVER_SLUGS,
} from '@/lib/projectDisplay'
import type { Project } from '@/types'

interface FeaturedProjectCardProps {
  project: Project
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const categoryName = project.category_label ?? project.category?.name
  const location = getProjectLocation(project)
  const isLogoCover = LOGO_COVER_SLUGS.has(project.slug)

  return (
    <Link to={`/projects/${project.slug}`} className="projects-featured group">
      <article className="projects-featured__card">
        <div className="projects-featured__media">
          {isLogoCover ? (
            <>
              <div className="absolute inset-0 bg-teal" aria-hidden />
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <LazyImage
                  src={project.cover_image_url}
                  alt={project.title}
                  wrapperClassName="relative w-full max-w-[22rem] !overflow-visible bg-transparent"
                  className="!h-auto !w-full object-contain"
                />
              </div>
            </>
          ) : (
            <LazyImage
              src={project.cover_image_url}
              alt={project.title}
              fill
              wrapperClassName="absolute inset-0 size-full"
              className={cn(
                'object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]',
                COVER_OBJECT_POSITION[project.slug] ?? 'object-center',
              )}
            />
          )}
        </div>

        <div className="projects-featured__body">
          {categoryName && <p className="projects-featured__kicker">{categoryName}</p>}
          <h2 className="projects-featured__title">{project.title}</h2>
          {location && (
            <p className="projects-featured__location">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
                <circle cx="12" cy="11" r="2" fill="currentColor" />
              </svg>
              {location}
            </p>
          )}
          {project.excerpt && <p className="projects-featured__excerpt">{project.excerpt}</p>}
          <span className="projects-featured__cta">
            View project
            <span aria-hidden>→</span>
          </span>
        </div>
      </article>
    </Link>
  )
}
