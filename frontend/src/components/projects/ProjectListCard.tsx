import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LazyImage } from '@/components/ui/LazyImage'
import { COVER_OBJECT_POSITION, LOGO_COVER_SLUGS } from '@/lib/projectDisplay'
import type { Project } from '@/types'

interface ProjectListCardProps {
  project: Project
}

export function ProjectListCard({ project }: ProjectListCardProps) {
  const categoryName = project.category_label ?? project.category?.name
  const isLogoCover = LOGO_COVER_SLUGS.has(project.slug)

  return (
    <Link to={`/projects/${project.slug}`} className="group block h-full">
      <article className="flex h-full gap-3 rounded-[1rem] bg-white p-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card sm:gap-4 sm:rounded-[1.125rem] sm:p-4">
        <div className="relative h-[4.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-lg bg-navy/5 sm:h-[5rem] sm:w-[6.25rem]">
          {isLogoCover ? (
            <div className="flex h-full w-full items-center justify-center bg-teal p-1.5">
              <LazyImage
                src={project.cover_image_url}
                alt={project.title}
                wrapperClassName="relative h-full w-full !overflow-visible bg-transparent"
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
                'object-cover',
                COVER_OBJECT_POSITION[project.slug] ?? 'object-center',
              )}
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0 flex-1">
            {categoryName && (
              <span className="inline-block rounded bg-teal/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-teal">
                {categoryName}
              </span>
            )}
            <h3 className="mt-1.5 line-clamp-2 font-serif text-sm font-normal leading-snug text-navy transition-colors group-hover:text-teal sm:text-[0.9375rem]">
              {project.title}
            </h3>
            {project.excerpt && (
              <p className="mt-1 hidden line-clamp-2 text-xs leading-relaxed text-navy/60 sm:block">
                {project.excerpt}
              </p>
            )}
          </div>

          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors group-hover:border-teal group-hover:text-teal"
          >
            →
          </span>
        </div>
      </article>
    </Link>
  )
}
