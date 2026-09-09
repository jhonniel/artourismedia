const ASSETS_BASE = (import.meta.env.VITE_ASSETS_BASE_URL ?? '').replace(/\/$/, '')

function normalizeAssetPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

/** Resolve a site static asset path (served from Spaces in production). */
export function assetUrl(path: string): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalized = normalizeAssetPath(path)

  return ASSETS_BASE ? `${ASSETS_BASE}${normalized}` : normalized
}

/** Prefer the Vite public folder in dev — for assets not yet uploaded to Spaces. */
export function localFirstAssetUrl(path: string): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  if (import.meta.env.DEV) {
    return normalizeAssetPath(path)
  }

  return assetUrl(path)
}
