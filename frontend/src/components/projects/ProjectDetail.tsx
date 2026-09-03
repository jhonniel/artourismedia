import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LazyImage } from '@/components/ui/LazyImage'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { FadeIn } from '@/components/ui/FadeIn'
import type { Project } from '@/types'

interface ProjectDetailViewProps {
  project: Project
  related?: Project[]
}

export function ProjectDetailView({ project, related = [] }: ProjectDetailViewProps) {
  const categoryName = project.category_label ?? project.category?.name
  const accentColor = project.color ?? project.category?.color

  return (
    <article>
      <div className="relative">
        <LazyImage
          src={project.cover_image_url}
          alt={project.title}
          wrapperClassName="aspect-[4/3] max-h-[480px] sm:aspect-[21/9]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-6 sm:pb-10">
          <FadeIn>
            {categoryName && (
              <Badge
                variant="cream"
                className="mb-3 sm:mb-4"
                style={accentColor ? { backgroundColor: accentColor, color: '#fff', border: 'none' } : undefined}
              >
                {categoryName}
              </Badge>
            )}
            <h1 className="max-w-3xl text-2xl font-bold text-white sm:text-3xl md:text-5xl">{project.title}</h1>
            {project.excerpt && (
              <p className="mt-3 max-w-2xl text-base text-white/70 sm:mt-4 sm:text-lg">{project.excerpt}</p>
            )}
          </FadeIn>
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            {project.content && (
              <div
                className="prose-content text-lg"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            )}

            {project.cta_text && project.cta_url && (
              <div className="mt-10">
                {project.cta_url.startsWith('http') ? (
                  <a href={project.cta_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="orange" size="lg">{project.cta_text}</Button>
                  </a>
                ) : (
                  <Link to={project.cta_url}>
                    <Button variant="orange" size="lg">{project.cta_text}</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </FadeIn>
      </Container>

      {related.length > 0 && (
        <div className="bg-white/50 py-16">
          <Container>
            <h2 className="mb-8 text-2xl font-bold">Related Projects</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.slice(0, 3).map((item) => (
                <ProjectCard key={item.uuid} project={item} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/projects" className="font-semibold text-teal hover:text-orange transition-colors">
                ← Back to all projects
              </Link>
            </div>
          </Container>
        </div>
      )}
    </article>
  )
}
