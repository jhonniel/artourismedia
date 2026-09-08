import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LazyImage } from '@/components/ui/LazyImage'
import { FadeIn } from '@/components/ui/FadeIn'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { AboutPalmAccent } from '@/components/ui/Decorative'
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
  if (p.includes('tiktok')) return { bg: 'bg-navy', text: 'text-white' }

  return { bg: 'bg-teal', text: 'text-white' }
}

export function About({ section, socialLinks = [] }: AboutProps) {
  const content = parseContent<AboutContent>(section.content)
  const sortedSocial = [...socialLinks].sort((a, b) => a.sort_order - b.sort_order)
  const headline = [content.title, content.title_accent].filter(Boolean).join(' ')

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20 lg:py-24">
      <AboutPalmAccent className="pointer-events-none absolute -right-8 top-8 hidden h-[22rem] w-48 opacity-90 lg:block xl:-right-4 xl:top-4 xl:h-[26rem] xl:w-56" />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <FadeIn>
            {content.image_url && (
              <LazyImage
                src={content.image_url}
                alt={content.image_alt ?? ''}
                wrapperClassName="w-full overflow-hidden rounded-[1.5rem] bg-white shadow-card sm:rounded-[1.75rem] xl:rounded-[2rem]"
                className="!h-auto !w-full !object-contain"
              />
            )}
          </FadeIn>

          <FadeIn delay={80}>
            <div className="max-w-xl lg:max-w-none">
              {content.eyebrow && (
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-teal md:text-base">
                  {content.eyebrow}
                </p>
              )}

              {headline && (
                <h2 className="font-serif text-[1.85rem] font-normal leading-[1.15] text-navy sm:text-[2.1rem] lg:text-[2.35rem] xl:text-[2.5rem]">
                  {headline}
                </h2>
              )}

              {content.body && (
                <div
                  className="prose-content mt-5 text-lg leading-[1.65] text-navy/75 md:text-xl"
                  dangerouslySetInnerHTML={{ __html: content.body }}
                />
              )}

              {sortedSocial.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-3">
                  {sortedSocial.map((link) => {
                    const styles = getSocialStyles(link.platform)

                    return (
                      <li key={link.uuid}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2.5 text-navy/85 transition-colors hover:text-teal"
                          title={link.username}
                        >
                          <span
                            className={cn(
                              'flex h-11 w-11 items-center justify-center rounded-full shadow-soft',
                              styles.bg,
                              styles.text,
                            )}
                          >
                            <SocialIcon platform={link.platform} className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium">{link.username}</span>
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
                      <Button size="lg" className="w-full px-6 text-xs uppercase tracking-[0.1em] sm:w-auto">
                        {content.cta_text} →
                      </Button>
                    </a>
                  ) : (
                    <Link to={content.cta_url}>
                      <Button size="lg" className="w-full px-6 text-xs uppercase tracking-[0.1em] sm:w-auto">
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
