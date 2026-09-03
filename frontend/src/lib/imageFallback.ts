const CATEGORY_FALLBACKS: Record<string, string> = {
  hero: '/images/hero/hero-beach.png',
  about: '/images/about/studio-workspace.svg',
  brand: '/images/brand/logo.svg',
  projects: '/images/projects/camiguin.svg',
  posts: '/images/posts/sustainable-tourism.svg',
  services: '/images/services/tourism-planning.svg',
  team: '/images/team/placeholder.svg',
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

  const chain = [src, ...extensionAlternatives(src)]
  const category = categoryFallback(src)

  if (category) {
    chain.push(category)
  }

  return [...new Set(chain.filter(Boolean))]
}
