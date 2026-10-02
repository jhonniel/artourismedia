import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LazyImage } from '@/components/ui/LazyImage'
import { FadeIn } from '@/components/ui/FadeIn'
import { RichContent } from '@/components/ui/RichContent'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { Button } from '@/components/ui/Button'
import { parseContent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { AboutContent, HomepageSection, SocialLink } from '@/types'

interface AboutProps {
  section: HomepageSection
  socialLinks?: SocialLink[]
}

function getSocialStyles(platform: string): { bg: string; text: string } {
  const p = platform.toLowerCase()

  if (p.includes('facebook')) return { bg: 'bg-[#1877F2]', text: 'text-white' }
  if (p.includes('instagram')) {
    return {
      bg: 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]',
      text: 'text-white',
    }
  }
  if (p.includes('linkedin')) return { bg: 'bg-[#0A66C2]', text: 'text-white' }
  if (p.includes('tiktok')) return { bg: 'bg-[#000000]', text: 'text-white' }

  return { bg: 'bg-teal', text: 'text-white' }
}

function AboutPortrait({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="home-about__figure">
      <div className="home-about__shapes" aria-hidden="true">
        <span className="home-about__circle home-about__circle--gold" />
        <span className="home-about__circle home-about__circle--orange" />
        <svg className="home-about__dots" viewBox="0 0 100 78" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 5 }).map((__, col) => (
              <circle key={`${row}-${col}`} cx={8 + col * 20} cy={8 + row * 18} r="2.1" fill="#f08a2a" />
            )),
          )}
        </svg>
      </div>
      <LazyImage
        src={src}
        alt={alt}
        priority
        wrapperClassName="home-about__photo !overflow-visible !bg-transparent"
        className="!h-auto !w-full !object-contain !object-bottom"
      />
    </div>
  )
}

function AboutHeadline({ title, accent }: { title?: string; accent?: string }) {
  const full = [title, accent].filter(Boolean).join(' ').trim()
  const match = full.match(/^(.*?\bBuilt)\s+(.+)$/i)

  if (!match) {
    return <h2 className="home-about__title">{full}</h2>
  }

  return (
    <h2 className="home-about__title">
      <span className="block">{match[1]}</span>
      <span className="home-about__title-accent block">{match[2]}</span>
    </h2>
  )
}

export function About({ section, socialLinks = [] }: AboutProps) {
  const content = parseContent<AboutContent>(section.content)
  const sortedSocial = [...socialLinks].sort((a, b) => a.sort_order - b.sort_order)
  const headline = [content.title, content.title_accent].filter(Boolean).join(' ')

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20 lg:py-24">
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_1.15fr] lg:gap-8 xl:gap-10">
          <FadeIn className="lg:flex lg:justify-end">
            {content.image_url && <AboutPortrait src={content.image_url} alt={content.image_alt ?? ''} />}
          </FadeIn>

          <FadeIn delay={80}>
            <div className="home-about__copy max-w-xl lg:max-w-none">
              {content.eyebrow && (
                <p className="home-about__eyebrow">
                  {content.eyebrow}
                  <span className="home-about__eyebrow-rule" aria-hidden="true" />
                </p>
              )}

              {headline && <AboutHeadline title={content.title} accent={content.title_accent} />}

              {content.body && (
                <RichContent html={content.body} className="prose-content home-about__body" />
              )}

              {sortedSocial.length > 0 && (
                <ul className="home-about__social">
                  {sortedSocial.map((link, index) => {
                    const styles = getSocialStyles(link.platform)

                    return (
                      <li key={link.uuid} className="home-about__social-item">
                        {index > 0 && <span className="home-about__social-rule" aria-hidden="true" />}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 text-navy transition-colors hover:text-orange"
                          title={link.username}
                        >
                          <span
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-soft sm:h-9 sm:w-9',
                              styles.bg,
                              styles.text,
                            )}
                          >
                            <SocialIcon platform={link.platform} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </span>
                          <span className="text-xs font-medium sm:text-sm">{link.username}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}

              {content.cta_text && content.cta_url && (
                <div className="mt-7">
                  {content.cta_url.startsWith('http') ? (
                    <a href={content.cta_url}>
                      <Button variant="orange" size="sm" className="home-about__cta w-full px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] sm:w-auto">
                        {content.cta_text} →
                      </Button>
                    </a>
                  ) : (
                    <Link to={content.cta_url}>
                      <Button variant="orange" size="sm" className="home-about__cta w-full px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] sm:w-auto">
                        {content.cta_text} →
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
