import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { LazyImage } from '@/components/ui/LazyImage'
import { FadeIn } from '@/components/ui/FadeIn'
import { NavyBottomWave } from '@/components/ui/Decorative'
import type { HomepageSection, Project } from '@/types'

interface FeaturedProjectsProps {
  section: HomepageSection
  projects: Project[]
}

const LOGO_COVER_SLUGS = new Set(['clean-camiguin-pivot-transformation'])

/** Per-card crop so photo covers fill consistently. */
const COVER_OBJECT_POSITION: Partial<Record<string, string>> = {
  'mounts-timpoong-hibok-hibok-ecotourism-plan': 'object-[center_40%]',
}

export function FeaturedProjects({ section, projects }: FeaturedProjectsProps) {
  const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order).slice(0, 3)
  const ctaText = (section.content.cta_text as string) ?? 'View All Projects'
  const ctaUrl = (section.content.cta_url as string) ?? '/projects'

  if (sorted.length === 0) return null

  return (
    <section className="relative -mt-px bg-navy pt-0">
      <Container className="pt-10 pb-12 md:pt-12 md:pb-16">
        <FadeIn>
          <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 sm:mb-8 sm:text-xs">
            {section.title ?? 'Featured Projects'}
          </h2>
        </FadeIn>

        <div className="project-stack">
          {sorted.map((project, index) => {
            const isLogoCover = LOGO_COVER_SLUGS.has(project.slug)
            const imageFirst = index % 2 === 1
            const category = project.category_label ?? project.category?.name

            return (
              <article
                key={project.uuid}
                className="project-stack__card"
                style={{ '--stack-index': index } as CSSProperties}
              >
                {/* Title sits at the top of every card so the sticky peek is a readable stack, not a sliver of photo. */}
                <div className="project-stack__tab">
                  {category && (
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-orange sm:text-xs">
                      {category}
                    </p>
                  )}
                  <h3 className="font-serif text-[1.65rem] font-normal leading-[1.15] text-balance text-navy sm:text-[2rem] lg:text-[2.35rem]">
                    {project.title}
                  </h3>
                </div>

                <div
                  className={cn(
                    'mt-5 grid items-start gap-6 sm:mt-6 sm:gap-8 lg:mt-8 lg:grid-cols-2 lg:gap-12',
                  )}
                >
                  <div className={cn('order-2', imageFirst ? 'lg:order-2' : 'lg:order-1')}>
                    {project.excerpt && (
                      <p className="max-w-prose text-[15px] leading-relaxed text-navy/70 sm:text-base">
                        {project.excerpt}
                      </p>
                    )}
                    <Link
                      to={`/projects/${project.slug}`}
                      className="group mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-orange transition-colors hover:text-navy sm:mt-7"
                    >
                      View project
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    aria-label={project.title}
                    className={cn(
                      'group relative order-1 block aspect-[16/10] overflow-hidden rounded-[1.1rem] sm:rounded-[1.35rem] lg:aspect-[4/3]',
                      imageFirst ? 'lg:order-1' : 'lg:order-2',
                      isLogoCover && 'bg-teal',
                    )}
                  >
                    {isLogoCover ? (
                      <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10">
                        <LazyImage
                          src={project.cover_image_url}
                          alt={project.title}
                          wrapperClassName="relative w-full max-w-[80%] !overflow-visible bg-transparent"
                          className="!h-auto !w-full object-contain"
                        />
                      </div>
                    ) : (
                      <LazyImage
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        wrapperClassName="absolute inset-0 size-full"
                        className={cn(
                          'object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]',
                          COVER_OBJECT_POSITION[project.slug],
                        )}
                      />
                    )}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        <FadeIn className="mt-10 flex justify-center md:mt-12">
          <Link
            to={ctaUrl}
            className="inline-flex items-center gap-3 rounded-full bg-orange px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-elevated transition-transform hover:scale-[1.03]"
          >
            {ctaText}
            <span aria-hidden>→</span>
          </Link>
        </FadeIn>
      </Container>

      <NavyBottomWave
        topFill="cream"
        className="relative z-10 -mt-px -mb-px h-16 sm:h-20 md:h-24 lg:h-28"
      />
    </section>
  )
}
