import type { Page, Project, Service } from '@/types'

export function organizationJsonLd(settings: {
  site_name?: string
  tagline?: string
  logo_url?: string
  contact_email?: string
  contact_phone?: string
  contact_address?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.site_name ?? 'Destination Studio',
    description: settings.tagline,
    logo: settings.logo_url,
    email: settings.contact_email,
    telephone: settings.contact_phone,
    address: settings.contact_address,
  }
}

export function websiteJsonLd(siteName?: string, url?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName ?? 'Destination Studio',
    url,
  }
}

export function serviceJsonLd(service: Service, url?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    image: service.image_url,
    url,
    provider: {
      '@type': 'Organization',
      name: 'Destination Studio',
    },
  }
}

export function projectJsonLd(project: Project, url?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.excerpt ?? project.seo_description,
    image: project.cover_image_url,
    url,
  }
}

export function contactPageJsonLd(
  settings: {
    site_name?: string
    contact_email?: string
    contact_phone?: string
    contact_address?: string
  },
  url?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${settings.site_name ?? 'Destination Studio'}`,
    url,
    mainEntity: {
      '@type': 'Organization',
      name: settings.site_name ?? 'Destination Studio',
      email: settings.contact_email,
      telephone: settings.contact_phone,
      address: settings.contact_address,
    },
  }
}

export function webPageJsonLd(page: Pick<Page, 'title' | 'seo_description'>, url?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.seo_description,
    url,
  }
}

export function canonicalUrl(path: string): string | undefined {
  if (typeof window === 'undefined') return undefined
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${window.location.origin}${normalized}`
}
