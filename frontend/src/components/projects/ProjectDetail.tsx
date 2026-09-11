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
      <div className="relative bg-navy/95">
        <LazyImage
          src={project.cover_image_url}
          alt={project.title}
          wrapperClassName="mx-auto aspect-[4/3] w-full max-h-[480px] sm:aspect-[21/9]"
          className="object-cover"
        />
      </div>

      <Container className="py-10 md:py-14">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            {categoryName && (
              <Badge
                variant="teal"
                style={accentColor ? { backgroundColor: `${accentColor}20`, color: accentColor } : undefined}
              >
                {categoryName}
              </Badge>
            )}
            <h1 className="mt-4 text-2xl font-bold leading-tight text-navy sm:text-3xl md:text-4xl">
              {project.title}
            </h1>
            {project.content ? (
              <div
                className="prose-content mt-6 text-base leading-relaxed text-navy/75 sm:text-lg"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            ) : (
              project.excerpt && (
                <p className="mt-6 text-base leading-relaxed text-navy/75 sm:text-lg">{project.excerpt}</p>
              )
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
