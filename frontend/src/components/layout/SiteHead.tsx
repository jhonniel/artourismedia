import { Helmet } from 'react-helmet-async'

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
  return (
    <Helmet>
      <title>{defaultTitle || siteName}</title>
      {defaultDescription && <meta name="description" content={defaultDescription} />}
      {faviconUrl && (
        <link
          rel="icon"
          type="image/png"
          href={
            faviconUrl.includes('/favicon')
              ? `${faviconUrl.split('?')[0]}?v=5`
              : faviconUrl
          }
        />
      )}
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png?v=5" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" />
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
