import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LazyImage } from '@/components/ui/LazyImage'
import { COVER_OBJECT_POSITION, getProjectLocation, LOGO_COVER_SLUGS } from '@/lib/projectDisplay'
import type { Project } from '@/types'

interface ProjectListCardProps {
  project: Project
}

export function ProjectListCard({ project }: ProjectListCardProps) {
  const categoryName = project.category_label ?? project.category?.name
  const location = getProjectLocation(project)
  const isLogoCover = LOGO_COVER_SLUGS.has(project.slug)

  return (
    <Link to={`/projects/${project.slug}`} className="projects-tile group">
      <article className="projects-tile__card">
        <div className="projects-tile__media">
          {isLogoCover ? (
            <div className="flex h-full w-full items-center justify-center bg-teal p-6">
              <LazyImage
                src={project.cover_image_url}
                alt={project.title}
                wrapperClassName="relative h-full w-full max-w-[12rem] !overflow-visible bg-transparent"
                className="!h-full !w-full object-contain"
              />
            </div>
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

        <div className="projects-tile__body">
          {categoryName && <p className="projects-tile__kicker">{categoryName}</p>}
          <h3 className="projects-tile__title">{project.title}</h3>
          {location && <p className="projects-tile__location">{location}</p>}
          {project.excerpt && <p className="projects-tile__excerpt">{project.excerpt}</p>}
          <span className="projects-tile__cta">
            View project
            <span aria-hidden>→</span>
          </span>
        </div>
      </article>
    </Link>
  )
}
