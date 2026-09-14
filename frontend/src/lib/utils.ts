export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateString?: string): string {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function getShareUrl(platform: 'facebook' | 'twitter' | 'linkedin', url: string, title: string): string {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  }
}

export function parseContent<T>(content: Record<string, unknown>): T {
  return content as T
}

/** Prefer full-size featured art; thumbnails are capped at ~400px from CMS uploads. */
export function postDisplayImage(post: {
  featured_image_url?: string | null
  thumbnail_url?: string | null
}): string | undefined {
  return post.featured_image_url ?? post.thumbnail_url ?? undefined
}

/** Full-resolution featured image only — never the CMS thumbnail. */
export function postFeaturedImage(post: {
  featured_image_url?: string | null
}): string | undefined {
  return post.featured_image_url ?? undefined
}

/** Ensure footer copyright always shows the current calendar year. */
export function formatFooterCopyright(copyright: string | undefined, siteName: string): string {
  const year = new Date().getFullYear()
  const fallback = `© ${year} ${siteName}. All rights reserved.`
  if (!copyright?.trim()) return fallback
  if (/©\s*\d{4}/.test(copyright)) {
    return copyright.replace(/©\s*\d{4}/, `© ${year}`)
  }
  if (/^©\s?/.test(copyright)) {
    return copyright.replace(/^©\s?/, `© ${year} `)
  }
  return `© ${year} ${copyright}`
}
