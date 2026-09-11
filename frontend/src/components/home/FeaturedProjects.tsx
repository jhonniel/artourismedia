import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LazyImage } from '@/components/ui/LazyImage'
import { FadeIn } from '@/components/ui/FadeIn'
import { FooterTopWave, NavyToWhiteWave } from '@/components/ui/Decorative'
import type { HomepageSection, Project } from '@/types'

interface FeaturedProjectsProps {
  section: HomepageSection
  projects: Project[]
}

const TAG_COLORS = ['text-teal', 'text-orange', 'text-purple', 'text-teal', 'text-orange']

export function FeaturedProjects({ section, projects }: FeaturedProjectsProps) {
  const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order).slice(0, 5)
  const ctaText = (section.content.cta_text as string) ?? 'View All Projects'
  const ctaUrl = (section.content.cta_url as string) ?? '/projects'

  if (sorted.length === 0) return null

  return (
    <section className="relative bg-navy pt-0">
      <FooterTopWave className="relative z-10 h-10 sm:h-12 md:h-14" />

      <Container className="pt-10 pb-10 md:pt-12 md:pb-12">
        <FadeIn>
          <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 sm:mb-10 sm:text-xs">
            {section.title ?? 'Featured Projects'}
          </h2>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 2xl:grid-cols-6 2xl:gap-5">
          {sorted.map((project, index) => (
            <FadeIn key={project.uuid} delay={index * 120}>
              <Link to={`/projects/${project.slug}`} className="group block h-full">
                <article className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[1.75rem]">
                  <LazyImage
                    src={project.cover_image_url}
                    alt={project.title}
                    wrapperClassName="absolute inset-0"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    {(project.category_label || project.category?.name) && (
                      <span
                        className={`mb-3 inline-block text-[10px] font-bold uppercase tracking-[0.16em] ${TAG_COLORS[index % TAG_COLORS.length]}`}
                      >
                        {project.category_label ?? project.category?.name}
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-normal leading-snug text-white sm:text-2xl">
                      {project.title}
                    </h3>
                    {project.excerpt && (
                      <p className="mt-2 text-sm leading-relaxed text-white/75 line-clamp-3">
                        {project.excerpt}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-orange">
                      View case study →
                    </span>
                  </div>
                </article>
              </Link>
            </FadeIn>
          ))}

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
