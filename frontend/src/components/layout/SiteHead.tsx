import { Helmet } from 'react-helmet-async'
import { sameOriginAssetUrl } from '@/lib/assets'

/** Bump when the favicon files change (also in index.html) so browsers refetch them. */
const FAVICON_CACHE = 'v=6'

interface SiteHeadProps {
  siteName?: string
  faviconUrl?: string | null
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  defaultTitle?: string
  defaultDescription?: string
}

export function SiteHead({
  siteName = 'Destination Studio',
  faviconUrl,
  primaryColor = '#078C95',
  secondaryColor = '#FF5A1F',
  accentColor = '#0B2447',
  defaultTitle,
  defaultDescription,
}: SiteHeadProps) {
  // The site's own /favicon.* ships with every deploy, so use that copy rather than the CDN's.
  // Anything else (a favicon uploaded in the admin) is used exactly as the API sends it.
  const bundledFavicon = faviconUrl ? sameOriginAssetUrl(faviconUrl).split('?')[0] : ''
  const faviconHref = /^\/favicon[^/]*$/.test(bundledFavicon)
    ? `${bundledFavicon}?${FAVICON_CACHE}`
    : faviconUrl

  return (
    <Helmet>
      <title>{defaultTitle || siteName}</title>
      {defaultDescription && <meta name="description" content={defaultDescription} />}
      {faviconHref && <link rel="icon" type="image/png" href={faviconHref} />}
      <link rel="icon" type="image/png" sizes="192x192" href={`/favicon-192.png?${FAVICON_CACHE}`} />
      <link rel="apple-touch-icon" href={`/apple-touch-icon.png?${FAVICON_CACHE}`} />
      <meta name="theme-color" content={primaryColor} />
      <style>{`
        :root {
          --color-primary: ${primaryColor};
          --color-secondary: ${secondaryColor};
          --color-accent: ${accentColor};
        }
      `}</style>
    </Helmet>
  )
}
