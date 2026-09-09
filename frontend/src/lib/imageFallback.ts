import { assetUrl } from '@/lib/assets'

const CATEGORY_FALLBACKS: Record<string, string> = {
  hero: assetUrl('/images/hero/hero-slideshow-01-pamulak.jpg'),
  about: assetUrl('/images/about/studio-workspace.svg'),
  brand: assetUrl('/images/brand/artourismedia-logo.png'),
  projects: assetUrl('/images/projects/camiguin.svg'),
  posts: assetUrl('/images/posts/sustainable-tourism.svg'),
  services: assetUrl('/images/services/tourism-planning-development.jpg'),
  team: assetUrl('/images/team/maria-santos.png'),
}

function extensionAlternatives(src: string): string[] {
  const alternatives: string[] = []

  if (/\.png$/i.test(src)) {
    alternatives.push(src.replace(/\.png$/i, '.svg'))
    alternatives.push(src.replace(/\.png$/i, '.webp'))
  }

  if (/\.(jpe?g|webp)$/i.test(src)) {
    alternatives.push(src.replace(/\.(jpe?g|webp)$/i, '.svg'))
  }

  return alternatives
}

function categoryFallback(src: string): string | undefined {
  for (const [segment, fallback] of Object.entries(CATEGORY_FALLBACKS)) {
    if (src.includes(`/${segment}/`)) {
      return fallback
    }
  }

  return undefined
}

export function buildImageFallbackChain(src?: string | null): string[] {
  if (!src) return []

  const resolved = assetUrl(src)
  const chain = [resolved, ...extensionAlternatives(resolved)]
  const category = categoryFallback(src)

  if (category) {
    chain.push(category)
  }

  return [...new Set(chain.filter(Boolean))]
}
