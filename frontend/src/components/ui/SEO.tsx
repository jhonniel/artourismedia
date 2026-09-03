import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  siteName?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = 'Destination Studio',
  jsonLd,
  noindex = false,
}: SEOProps) {
  const pageTitle = title ? `${title} | ${siteName}` : siteName

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={pageTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd && (
        (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((schema, index) => (
          <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>
        ))
      )}
    </Helmet>
  )
}
