import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { LazyImage } from '@/components/ui/LazyImage'
import { FadeIn } from '@/components/ui/FadeIn'
import { NavySectionTopWave, NavyToWhiteWave } from '@/components/ui/Decorative'
import type { HomepageSection, Project } from '@/types'

interface FeaturedProjectsProps {
  section: HomepageSection
  projects: Project[]
}

const TAG_STYLES = [
  'bg-teal text-white',
  'bg-orange text-white',
  'bg-purple text-white',
] as const

const LOGO_COVER_SLUGS = new Set(['clean-camiguin-pivot-transformation'])

/** Per-card crop so photo covers fill consistently. */
const COVER_OBJECT_POSITION: Partial<Record<string, string>> = {
  'mounts-timpoong-hibok-hibok-ecotourism-plan': 'object-[center_35%]',
}

export function FeaturedProjects({ section, projects }: FeaturedProjectsProps) {
  const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order).slice(0, 3)
  const ctaText = (section.content.cta_text as string) ?? 'View All Projects'
  const ctaUrl = (section.content.cta_url as string) ?? '/projects'

  if (sorted.length === 0) return null

  return (
    <section className="relative bg-navy pt-0">
      <NavySectionTopWave className="relative z-10 h-10 sm:h-12 md:h-14" />

      <Container className="pt-10 pb-10 md:pt-12 md:pb-12">
        <FadeIn>
          <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 sm:mb-10 sm:text-xs">
            {section.title ?? 'Featured Projects'}
          </h2>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
          {sorted.map((project, index) => {
            const isLogoCover = LOGO_COVER_SLUGS.has(project.slug)

            return (
            <FadeIn key={project.uuid} delay={index * 120}>
              <Link to={`/projects/${project.slug}`} className="group block">
                <article className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[1.75rem]">
                  {isLogoCover ? (
                    <>
                      <div className="absolute inset-0 bg-teal" aria-hidden />
                      <div className="absolute inset-x-0 top-0 z-[1] flex h-[52%] items-start justify-center px-4 pt-4 sm:px-5 sm:pt-5">
                        <LazyImage
                          src={project.cover_image_url}
                          alt={project.title}
                          loading="eager"
                          wrapperClassName="relative w-full max-w-[92%] !overflow-visible bg-transparent"
                          className="!h-auto !w-full object-contain object-top"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 top-[46%] z-[1] bg-gradient-to-t from-navy from-0% via-navy/80 via-45% to-transparent" />
                    </>
                  ) : (
                    <>
                      <LazyImage
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        wrapperClassName="absolute inset-0 size-full"
                        className={cn(
                          'object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]',
                          COVER_OBJECT_POSITION[project.slug],
                        )}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy from-25% via-navy/70 via-60% to-transparent" />
                    </>
                  )}

                  {(project.category_label || project.category?.name) && (
                    <span
                      className={`absolute left-5 top-[48%] z-10 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] shadow-soft sm:left-6 sm:top-[46%] ${TAG_STYLES[index % TAG_STYLES.length]}`}
                    >
                      {project.category_label ?? project.category?.name}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 top-[54%] z-10 flex flex-col p-5 sm:top-[52%] sm:p-6">
                    <h3 className="line-clamp-3 font-serif text-xl font-normal leading-snug text-white sm:text-2xl">
                      {project.title}
                    </h3>
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-bold uppercase tracking-[0.1em] text-orange">
                      View project →
                    </span>
                  </div>
                </article>
              </Link>
            </FadeIn>
            )
          })}

          <FadeIn delay={360}>
            <Link
              to={ctaUrl}
              className="group flex aspect-[4/5] flex-col items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/5 p-6 text-center transition-colors hover:bg-white/10 sm:rounded-[1.5rem] lg:rounded-[1.75rem]"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange text-2xl text-white shadow-elevated transition-transform group-hover:scale-105 sm:h-20 sm:w-20 sm:text-3xl lg:h-24 lg:w-24">
                →
              </span>
              <span className="mt-4 max-w-[10rem] text-xs font-bold uppercase tracking-[0.12em] text-white sm:mt-5">
                {ctaText}
              </span>
            </Link>
          </FadeIn>
        </div>
      </Container>

      <NavyToWhiteWave className="relative z-10 h-10 sm:h-12 md:h-14" />
    </section>
  )
}
