import { assetUrl, buildAssetFallbackChain, sameOriginAssetUrl, toRelativeAssetPath } from '@/lib/assets'

const CATEGORY_FALLBACKS: Record<string, string> = {
  hero: assetUrl('/images/hero/hero-slideshow-01-pamulak-float.jpg'),
  about: assetUrl('/images/about/studio-workspace.svg'),
  brand: assetUrl('/images/brand/artourismedia-logo.png'),
  projects: assetUrl('/images/projects/camiguin.svg'),
  posts: assetUrl('/images/posts/sustainable-tourism.svg'),
  services: assetUrl('/images/services/tourism-planning-development.png'),
  team: assetUrl('/images/team/maria-santos.png'),
}

function hasConcreteProjectAsset(src: string): boolean {
  return /\/images\/projects\/[^/]+\.(png|jpe?g|webp)(\?|$)/i.test(src)
}

function extensionAlternatives(src: string): string[] {
  if (hasConcreteProjectAsset(src)) {
    return []
  }

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
  if (hasConcreteProjectAsset(src)) {
    return undefined
  }

  for (const [segment, fallback] of Object.entries(CATEGORY_FALLBACKS)) {
    if (src.includes(`/${segment}/`)) {
      return fallback
    }
  }

  return undefined
}

export function buildImageFallbackChain(src?: string | null): string[] {
  if (!src) return []

  const relative = toRelativeAssetPath(src)
  const chain = buildAssetFallbackChain(relative.startsWith('/') ? relative : src)

  for (const candidate of [...chain]) {
    chain.push(...extensionAlternatives(candidate))
    chain.push(...extensionAlternatives(sameOriginAssetUrl(relative)))
  }

  const category = categoryFallback(relative.startsWith('/') ? relative : src)

  if (category) {
    chain.push(category)
  }

  return [...new Set(chain.filter(Boolean))]
}
