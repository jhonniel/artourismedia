import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LazyImage } from '@/components/ui/LazyImage'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const categoryName = project.category_label ?? project.category?.name
  const accentColor = project.color ?? project.category?.color

  return (
    <Link to={`/projects/${project.slug}`} className="group block h-full">
      <Card hover padding="none" className="h-full overflow-hidden">
        <LazyImage
          src={project.cover_image_url}
          alt={project.title}
          wrapperClassName="aspect-[16/10]"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="p-6">
          {categoryName && (
            <Badge
              variant="teal"
              style={accentColor ? { backgroundColor: `${accentColor}20`, color: accentColor } : undefined}
            >
              {categoryName}
            </Badge>
          )}
          <h3 className="mt-3 text-xl font-bold text-navy group-hover:text-teal transition-colors">
            {project.title}
          </h3>
          {project.excerpt && (
            <p className="mt-2 text-navy/60 leading-relaxed line-clamp-2">{project.excerpt}</p>
          )}
        </div>
      </Card>
    </Link>
  )
}
