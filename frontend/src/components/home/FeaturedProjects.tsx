import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LazyImage } from '@/components/ui/LazyImage'
import { FadeIn } from '@/components/ui/FadeIn'
import { WaveDividerNavy } from '@/components/ui/Decorative'
import type { HomepageSection, Project } from '@/types'

interface FeaturedProjectsProps {
  section: HomepageSection
  projects: Project[]
}

const TAG_COLORS = ['text-teal', 'text-orange', 'text-purple']

export function FeaturedProjects({ section, projects }: FeaturedProjectsProps) {
  const sorted = [...projects].sort((a, b) => a.sort_order - b.sort_order).slice(0, 3)
  const ctaText = (section.content.cta_text as string) ?? 'View All Projects'
  const ctaUrl = (section.content.cta_url as string) ?? '/projects'

  if (sorted.length === 0) return null

  return (
    <section className="relative bg-navy pb-16 pt-0 md:pb-20 md:pt-0">
      <WaveDividerNavy className="-mt-px block h-10 w-full rotate-180 text-white sm:h-12 md:h-14" />

      <Container className="pt-10 md:pt-12">
        <FadeIn>
          <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 sm:mb-10 sm:text-xs">
            {section.title ?? 'Featured Projects'}
          </h2>
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
          {sorted.map((project, index) => (
            <FadeIn key={project.uuid} delay={index * 120}>
              <Link to={`/projects/${project.slug}`} className="group block h-full">
                <article className="relative min-h-[18rem] overflow-hidden rounded-[1.25rem] sm:min-h-[22rem] sm:rounded-[1.5rem] lg:min-h-[24rem] lg:rounded-[1.75rem]">
                  <LazyImage
                    src={project.cover_image_url}
                    alt={project.title}
                    wrapperClassName="absolute inset-0 h-full w-full"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />

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
              className="group flex h-full min-h-[18rem] flex-col items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/5 p-6 text-center transition-colors hover:bg-white/10 sm:min-h-[22rem] sm:rounded-[1.5rem] lg:min-h-[24rem] lg:rounded-[1.75rem]"
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
    </section>
  )
}
