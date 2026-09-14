const ASSETS_BASE = (import.meta.env.VITE_ASSETS_BASE_URL ?? '').replace(/\/$/, '')

const KNOWN_ASSET_HOSTS = [
  ASSETS_BASE,
  'https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static',
  'https://infosoft-playground.sgp1.digitaloceanspaces.com/tingog/reports/static',
]

function normalizeAssetPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function stripQuery(path: string): string {
  return path.split('?')[0] ?? path
}

/** Convert a CDN or relative asset path to `/images/...` form. */
export function toRelativeAssetPath(path: string): string {
  if (!path) return path

  if (path.startsWith('http://') || path.startsWith('https://')) {
    for (const base of KNOWN_ASSET_HOSTS) {
      if (base && path.startsWith(base)) {
        return normalizeAssetPath(stripQuery(path.slice(base.length)))
      }
    }

    return path
  }

  return normalizeAssetPath(stripQuery(path))
}

/** Same-origin URL for assets bundled into `public/images/`. */
export function sameOriginAssetUrl(path: string): string {
  const relative = toRelativeAssetPath(path)

  if (relative.startsWith('http://') || relative.startsWith('https://')) {
    return relative
  }

  return relative
}

/** Resolve a site static asset path (served from Spaces in production). */
export function assetUrl(path: string): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalized = normalizeAssetPath(path)

  return ASSETS_BASE ? `${ASSETS_BASE}${normalized}` : normalized
}

/** Spaces/CDN when configured, otherwise same-origin `/images/...`. */
export function localFirstAssetUrl(path: string): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  if (ASSETS_BASE) {
    return assetUrl(path)
  }

  return normalizeAssetPath(path)
}

/** CDN first, then bundled same-origin copy, for resilient production loading. */
export function buildAssetFallbackChain(path?: string | null): string[] {
  if (!path) return []

  const relative = toRelativeAssetPath(path)
  const chain: string[] = []

  if (path.startsWith('http://') || path.startsWith('https://')) {
    chain.push(path)
  }

  if (relative.startsWith('/')) {
    if (import.meta.env.DEV) {
      chain.push(sameOriginAssetUrl(relative))
      chain.push(assetUrl(relative))
    } else {
      chain.push(assetUrl(relative))
      chain.push(sameOriginAssetUrl(relative))
    }
  }

  return [...new Set(chain.filter(Boolean))]
}
