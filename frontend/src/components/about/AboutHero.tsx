import { LazyImage } from '@/components/ui/LazyImage'
import type { AboutPageMetadata } from '@/types'

export const ABOUT_HERO_PORTRAIT_FALLBACK = '/images/about/art-boncato-portrait.png?v=24'

interface AboutHeroProps {
  metadata: Pick<
    AboutPageMetadata,
    'eyebrow' | 'headline' | 'intro' | 'portrait_url' | 'signature_name' | 'signature_title' | 'quote'
  >
}

function heroPortraitSrc(metadataUrl?: string): string {
  if (!metadataUrl) return ABOUT_HERO_PORTRAIT_FALLBACK
  if (metadataUrl.includes('portrait-card')) return ABOUT_HERO_PORTRAIT_FALLBACK
  return metadataUrl
}

function AboutHeroWaves() {
  return (
    <div className="about-hero__waves" aria-hidden="true">
      <div className="about-hero__swoosh about-hero__swoosh--blue" />
      <div className="about-hero__swoosh about-hero__swoosh--peach" />
      <div className="about-hero__swoosh about-hero__swoosh--white" />
    </div>
  )
}

function AboutHeroHeadline({ headline }: { headline: string }) {
  const builtMatch = headline.match(/^(.*?\bBuilt)\s+(Around\s+)(Tourism)\s*$/i)

  if (builtMatch) {
    const [, lineOne, around, tourism] = builtMatch

    return (
      <h1 className="about-hero__title">
        {lineOne.trim()}
        <br />
        {around.trim()}{' '}
        <span className="about-hero__title-accent">{tourism}</span>
      </h1>
    )
  }

  const tourismMatch = headline.match(/^(.*?)(Tourism)\s*$/i)

  if (tourismMatch) {
    const [, prefix, accent] = tourismMatch

    return (
      <h1 className="about-hero__title">
        {prefix.trim()}
        <span className="about-hero__title-accent">{accent}</span>
      </h1>
    )
  }

  return <h1 className="about-hero__title">{headline}</h1>
}

function SignatureRole({ title }: { title: string }) {
  return <p className="about-hero__signature-role">{title}</p>
}

export function AboutHero({ metadata }: AboutHeroProps) {
  const portraitSrc = heroPortraitSrc(metadata.portrait_url)
  const portraitAlt = metadata.signature_name ?? 'Art Boncato'

  return (
    <section className="about-hero">
      <AboutHeroWaves />

      <div className="about-hero__portrait-stage">
        <div className="about-hero__portrait-bg" aria-hidden="true" />

        <LazyImage
          src={portraitSrc}
          alt={portraitAlt}
          priority
          fill
          wrapperClassName="about-hero__portrait-wrap !overflow-visible !bg-transparent"
          className="about-hero__portrait !object-contain !object-center"
        />
      </div>

      <div className="about-hero__inner">
        <div className="about-hero__copy">
          {metadata.eyebrow && <p className="about-hero__eyebrow">{metadata.eyebrow}</p>}
          {metadata.headline && <AboutHeroHeadline headline={metadata.headline} />}
          {metadata.intro && <p className="about-hero__intro">{metadata.intro}</p>}
        </div>

        <div className="about-hero__aside">
          {metadata.signature_name && (
            <div className="about-hero__signature">
              <p className="about-hero__signature-name font-display">{metadata.signature_name}</p>
              {metadata.signature_title && <SignatureRole title={metadata.signature_title} />}
            </div>
          )}

          {metadata.quote && (
            <blockquote className="about-hero__quote-card">
              <span className="about-hero__quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="about-hero__quote-text">{metadata.quote}</p>
              <span className="about-hero__quote-mark about-hero__quote-mark--end" aria-hidden="true">
                &rdquo;
              </span>
              <span className="about-hero__quote-line" aria-hidden="true" />
            </blockquote>
          )}
        </div>
      </div>
    </section>
  )
}
