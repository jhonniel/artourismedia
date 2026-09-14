import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { LazyImage } from '@/components/ui/LazyImage'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { FadeIn } from '@/components/ui/FadeIn'
import { RichContent } from '@/components/ui/RichContent'
import { ProjectDetailLeafAccent } from '@/components/ui/Decorative'
import { COVER_OBJECT_POSITION } from '@/lib/projectDisplay'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectDetailViewProps {
  project: Project
  related?: Project[]
}

export function ProjectDetailView({ project, related = [] }: ProjectDetailViewProps) {
  const categoryName = project.category_label ?? project.category?.name
  const objectPosition = COVER_OBJECT_POSITION[project.slug] ?? 'object-center'

  return (
    <article>
      <section className="project-detail relative overflow-hidden bg-cream">
        <ProjectDetailLeafAccent className="project-detail__leaf project-detail__leaf--top" />
        <ProjectDetailLeafAccent className="project-detail__leaf project-detail__leaf--bottom" />

        <Container className="relative z-[1] py-10 md:py-14 lg:py-16 xl:py-20">
          <FadeIn>
            <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
              {project.cover_image_url && (
                <div className="project-detail__media">
                  <LazyImage
                    src={project.cover_image_url}
                    alt={project.title}
                    priority
                    fill
                    wrapperClassName="project-detail__image-wrap aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] xl:min-h-[32rem] xl:aspect-auto"
                    className={cn('!object-cover', objectPosition)}
                  />
                </div>
              )}

              <div className="project-detail__content min-w-0 lg:pt-1 xl:pt-3">
                {categoryName && (
                  <span className="project-detail__category">{categoryName}</span>
                )}

                <h1 className="project-detail__title mt-4 font-serif text-[1.65rem] font-bold leading-[1.18] text-navy sm:mt-5 sm:text-[1.85rem] md:text-[2rem] lg:text-[2.125rem] xl:text-[2.35rem]">
                  {project.title}
                </h1>

                <div className="project-detail__accent mt-4 sm:mt-5" aria-hidden="true" />

                {project.content ? (
                  <RichContent
                    html={project.content}
                    className="prose-content prose-content-project mt-5 sm:mt-6"
                  />
                ) : (
                  project.excerpt && (
                    <p className="project-detail__body mt-5 sm:mt-6">{project.excerpt}</p>
                  )
                )}

                {project.cta_text && project.cta_url && (
                  <div className="mt-8 sm:mt-10">
                    {project.cta_url.startsWith('http') ? (
                      <a href={project.cta_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="orange" size="lg">
                          {project.cta_text}
                        </Button>
                      </a>
                    ) : (
                      <Link to={project.cta_url}>
                        <Button variant="orange" size="lg">
                          {project.cta_text}
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {related.length > 0 && (
        <div className="bg-white py-14 md:py-16">
          <Container>
            <h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">Related Projects</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {related.slice(0, 3).map((item) => (
                <ProjectCard key={item.uuid} project={item} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/projects"
                className="font-semibold text-teal transition-colors hover:text-orange"
              >
                ← Back to all projects
              </Link>
            </div>
          </Container>
        </div>
      )}
    </article>
  )
}
