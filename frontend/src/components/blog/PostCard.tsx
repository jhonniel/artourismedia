import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LazyImage } from '@/components/ui/LazyImage'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  featured?: boolean
}

const CATEGORY_VARIANTS: Record<string, 'teal' | 'orange' | 'purple' | 'navy'> = {
  strategy: 'teal',
  marketing: 'orange',
  media: 'purple',
}

function categoryVariant(name?: string): 'teal' | 'orange' | 'purple' | 'navy' {
  if (!name) return 'teal'
  const key = name.toLowerCase()
  return CATEGORY_VARIANTS[key] ?? 'navy'
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const variant = categoryVariant(post.category?.name)

  return (
    <Link to={`/insights/${post.slug}`} className="group block h-full">
      <Card hover padding="none" className="h-full flex flex-col">
        <LazyImage
          src={post.thumbnail_url ?? post.featured_image_url}
          alt={post.title}
          wrapperClassName={featured ? 'aspect-[16/9]' : 'aspect-[16/10]'}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="flex flex-1 flex-col p-6">
          {post.category && (
            <Badge variant={variant} className="mb-3 w-fit">
              {post.category.name}
            </Badge>
          )}
          <h3 className={`font-bold text-navy group-hover:text-teal transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-3 text-navy/60 leading-relaxed line-clamp-3 flex-1">
              {post.excerpt}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-teal group-hover:text-orange transition-colors">
            Read more
            <span aria-hidden>→</span>
          </span>
        </div>
      </Card>
    </Link>
  )
}
