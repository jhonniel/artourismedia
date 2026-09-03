const ASSETS_BASE = (import.meta.env.VITE_ASSETS_BASE_URL ?? '').replace(/\/$/, '')

/** Resolve a site static asset path (served from Spaces in production). */
export function assetUrl(path: string): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalized = path.startsWith('/') ? path : `/${path}`

  return ASSETS_BASE ? `${ASSETS_BASE}${normalized}` : normalized
}
