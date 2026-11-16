import { useEffect, useRef, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { LazyImage } from '@/components/ui/LazyImage'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { FadeIn } from '@/components/ui/FadeIn'
import { RichContent } from '@/components/ui/RichContent'
import { COVER_OBJECT_POSITION, LOGO_COVER_SLUGS } from '@/lib/projectDisplay'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectDetailViewProps {
  project: Project
  related?: Project[]
}

function usePointerParallax(): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reduceMotion.matches || !finePointer.matches) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frame = 0
    let active = true

    const apply = () => {
      node.style.setProperty('--px', current.x.toFixed(4))
      node.style.setProperty('--py', current.y.toFixed(4))
    }

    const tick = () => {
      if (!active) return
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      apply()
      frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
      target.x = Math.max(-1, Math.min(1, x))
      target.y = Math.max(-1, Math.min(1, y))
    }

    const onLeave = () => {
      target.x = 0
      target.y = 0
    }

    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      active = false
      cancelAnimationFrame(frame)
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
      node.style.removeProperty('--px')
      node.style.removeProperty('--py')
    }
  }, [])

  return ref
}

export function ProjectDetailView({ project, related = [] }: ProjectDetailViewProps) {
  const categoryName = project.category_label ?? project.category?.name
  const objectPosition = COVER_OBJECT_POSITION[project.slug] ?? 'object-center'
  const isLogoCover = LOGO_COVER_SLUGS.has(project.slug)
  const stageRef = usePointerParallax()

  return (
    <article>
      <section
        ref={stageRef}
        className={cn('project-immersive', isLogoCover && 'project-immersive--logo')}
      >
        <div className="project-immersive__scene" aria-hidden="true">
          {project.cover_image_url ? (
            isLogoCover ? (
              <LazyImage
                src={project.cover_image_url}
                alt=""
                priority
                wrapperClassName="project-immersive__logo-wrap"
                className="!h-auto !w-full max-w-[28rem] object-contain"
              />
            ) : (
              <LazyImage
                src={project.cover_image_url}
                alt=""
                priority
                fill
                wrapperClassName="project-immersive__photo"
                className={cn('!object-cover', objectPosition)}
              />
            )
          ) : (
            <div className="project-immersive__fallback" />
          )}
          <div className="project-immersive__shade" />
          <div className="project-immersive__light" />
        </div>

        <Container className="project-immersive__stage">
          <div className="project-immersive__glass">
            {categoryName && <span className="project-immersive__badge">{categoryName}</span>}

            <h1 className="project-immersive__title">{project.title}</h1>

            {project.content ? (
              <RichContent html={project.content} className="prose-content prose-content-project project-immersive__copy" />
            ) : (
              project.excerpt && <p className="project-immersive__copy">{project.excerpt}</p>
            )}

            {project.cta_text && project.cta_url && (
              <div className="project-immersive__cta">
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

      {related.length === 0 && (
        <div className="bg-cream py-10">
          <Container>
            <FadeIn>
              <Link
                to="/projects"
                className="font-semibold text-teal transition-colors hover:text-orange"
              >
                ← Back to all projects
              </Link>
            </FadeIn>
          </Container>
        </div>
      )}
    </article>
  )
}
