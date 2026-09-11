import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { LazyImage } from '@/components/ui/LazyImage'
import { FadeIn } from '@/components/ui/FadeIn'
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

export function About({ section, socialLinks = [] }: AboutProps) {
  const content = parseContent<AboutContent>(section.content)
  const sortedSocial = [...socialLinks].sort((a, b) => a.sort_order - b.sort_order)
  const headline = [content.title, content.title_accent].filter(Boolean).join(' ')

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20 lg:py-24">
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_1.15fr] lg:gap-8 xl:gap-10">
          <FadeIn className="lg:flex lg:justify-end">
            {content.image_url && (
              <LazyImage
                src={content.image_url}
                alt={content.image_alt ?? ''}
                wrapperClassName="mx-auto w-full max-w-[14rem] bg-transparent sm:max-w-[16rem] lg:ml-auto lg:mr-0 lg:max-w-[18rem]"
                className="!h-auto !w-full !object-contain !object-bottom"
              />
            )}
          </FadeIn>

          <FadeIn delay={80}>
            <div className="max-w-xl lg:max-w-none">
              {content.eyebrow && (
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-teal md:text-sm">
                  {content.eyebrow}
                </p>
              )}

              {headline && (
                <h2 className="font-serif text-[1.5rem] font-normal leading-[1.2] text-navy sm:text-[1.65rem] lg:text-[1.85rem] xl:text-[2rem]">
                  {headline}
                </h2>
              )}

              {content.body && (
                <div
                  className="prose-content mt-4 text-base leading-[1.6] text-navy/75 md:text-[1.0625rem]"
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
