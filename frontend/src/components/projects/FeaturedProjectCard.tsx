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
    <Link to={`/projects/${project.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-card transition-shadow duration-300 hover:shadow-elevated sm:rounded-[1.5rem]">
        <div className="relative aspect-[16/10] overflow-hidden bg-navy/5 sm:aspect-[16/9]">
          {isLogoCover ? (
            <>
              <div className="absolute inset-0 bg-teal" aria-hidden />
              <div className="absolute inset-x-0 top-0 flex h-[58%] items-start justify-center px-6 pt-6">
                <LazyImage
                  src={project.cover_image_url}
                  alt={project.title}
                  wrapperClassName="relative w-full max-w-[85%] !overflow-visible bg-transparent"
                  className="!h-auto !w-full object-contain object-top"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 top-[42%] bg-gradient-to-t from-navy/80 to-transparent" />
            </>
          ) : (
            <LazyImage
              src={project.cover_image_url}
              alt={project.title}
              fill
              wrapperClassName="absolute inset-0 size-full"
              className={cn(
                'object-cover transition-transform duration-500 group-hover:scale-[1.02]',
                COVER_OBJECT_POSITION[project.slug] ?? 'object-center',
              )}
            />
          )}

          {categoryName && (
            <span className="absolute left-4 top-4 z-10 rounded-md bg-teal px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:left-5 sm:top-5">
              {categoryName}
            </span>
          )}

          <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:right-5 sm:top-5">
            <span>Featured Project</span>
            <span aria-hidden className="text-sm text-orange">★</span>
          </div>

          {location && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-sm text-white sm:bottom-5 sm:left-5">
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
                <circle cx="12" cy="11" r="2" fill="currentColor" />
              </svg>
              <span className="font-medium drop-shadow-sm">{location}</span>
            </div>
          )}

          {!isLogoCover && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-navy/10" />
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
          <h3 className="font-serif text-xl font-normal leading-snug text-navy transition-colors group-hover:text-teal sm:text-2xl lg:text-[1.65rem]">
            {project.title}
          </h3>
          {project.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy/65 sm:text-[0.9375rem]">
              {project.excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="text-sm font-semibold text-navy transition-colors group-hover:text-teal">
              View Project
            </span>
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-lg text-white transition-transform group-hover:scale-105"
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
