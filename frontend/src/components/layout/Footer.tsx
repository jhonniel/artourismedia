import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/Input'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { BrandLogo } from '@/components/ui/BrandLogo'
import {
  FooterDotPattern,
  FooterLeftAccent,
  FooterPalmSilhouette,
  FooterRightAccent,
  FooterTopWave,
} from '@/components/ui/Decorative'
import { useNewsletterMutation } from '@/hooks/useMutations'
import type { FooterData, SocialLink } from '@/types'
import { cn } from '@/lib/utils'

interface FooterProps {
  footer: FooterData
  socialLinks: SocialLink[]
  siteName: string
  logoUrl?: string
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

  return { bg: 'bg-white/15', text: 'text-white' }
}

export function Footer({ footer, socialLinks, siteName, logoUrl }: FooterProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const newsletter = useNewsletterMutation()
  const sortedSocial = [...socialLinks].sort((a, b) => a.sort_order - b.sort_order)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      await newsletter.mutateAsync({ email })
      setSubmitted(true)
      setEmail('')
    } catch {
      // error handled by mutation state
    }
  }

  return (
    <footer className="relative mt-0 w-full overflow-hidden bg-navy pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] text-white">
      <FooterTopWave className="relative z-10 -mt-px block h-14 w-full rotate-180 sm:h-16 md:h-20 lg:h-24" />

      <FooterLeftAccent className="pointer-events-none absolute bottom-0 left-0 z-0 h-44 w-56 sm:h-52 sm:w-64 md:h-60 md:w-72" />
      <FooterDotPattern className="pointer-events-none absolute bottom-16 left-6 z-0 h-16 w-16 opacity-80 sm:bottom-20 sm:left-10 md:bottom-24" />
      <FooterRightAccent className="pointer-events-none absolute bottom-0 right-0 z-0 h-48 w-60 sm:h-56 sm:w-72 md:h-64 md:w-80" />
      <FooterPalmSilhouette className="pointer-events-none absolute bottom-0 right-4 z-[1] h-40 w-28 sm:right-8 sm:h-48 sm:w-32 md:h-56 md:w-36" />

      <Container className="relative z-10 pt-10 pb-2 sm:pt-12 sm:pb-3 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="lg:col-span-4">
            <div className="mb-5">
              <BrandLogo
                logoUrl={logoUrl}
                siteName={siteName}
                variant="footer"
                className="h-[4.5rem] w-auto max-w-[20rem] sm:h-16 sm:max-w-[22rem] lg:h-16 lg:max-w-[18rem]"
              />
            </div>
            {footer.description && (
              <p className="max-w-sm text-sm leading-relaxed text-white/75">{footer.description}</p>
            )}
            {sortedSocial.length > 0 && (
              <div className="mt-5 flex gap-2.5">
                {sortedSocial.map((link) => {
                  const styles = getSocialStyles(link.platform)

                  return (
                    <a
                      key={link.uuid}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-full transition-opacity hover:opacity-85',
                        styles.bg,
                        styles.text,
                      )}
                      aria-label={link.platform}
                    >
                      <SocialIcon platform={link.platform} className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:contents">
            <div className="min-w-0 lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                Quick Links
              </h4>
              <ul className="mt-4 space-y-1">
                {(footer.quick_links ?? []).map((link) => (
                  <li key={link.url}>
                    {link.url.startsWith('http') ? (
                      <a href={link.url} className="inline-flex min-h-9 items-center text-sm text-white/80 transition-colors hover:text-white">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.url} className="inline-flex min-h-9 items-center text-sm text-white/80 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 lg:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                {footer.contact_title ?? 'Contact'}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                {footer.contact_email && (
                  <li>
                    <a
                      href={`mailto:${footer.contact_email}`}
                      className="break-all transition-colors hover:text-white"
                    >
                      {footer.contact_email}
                    </a>
                  </li>
                )}
                {footer.contact_phone && <li>{footer.contact_phone}</li>}
                {footer.contact_address && <li>{footer.contact_address}</li>}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
              {footer.newsletter_title ?? 'Stay Connected'}
            </h4>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {footer.newsletter_description ??
                'Get the latest insights on tourism development and destination strategy.'}
            </p>

            {submitted ? (
              <p className="mx-auto mt-4 max-w-xs rounded-full bg-white/10 px-4 py-2.5 text-sm text-white lg:mx-0">
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-4 max-w-xs space-y-2.5 lg:mx-0 lg:max-w-none lg:space-y-3">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9 w-full rounded-full border-white/15 bg-white/10 text-sm text-white placeholder:text-white/45 lg:h-11"
                />
                <button
                  type="submit"
                  disabled={newsletter.isPending}
                  className="inline-flex h-9 w-full items-center justify-center rounded-full bg-orange px-5 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange/90 disabled:opacity-60 lg:h-11 lg:px-6 lg:text-xs"
                >
                  Subscribe →
                </button>
              </form>
            )}
            {newsletter.isError && (
              <p className="mx-auto mt-2 max-w-xs text-sm text-orange lg:mx-0">{newsletter.error.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-white/15 pt-3 text-xs text-white/55 sm:mt-8 md:mt-12 md:pt-6">
          <p className="min-w-0 shrink">{footer.copyright ?? `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}</p>
          {(footer.legal_links ?? []).length > 0 && (
            <div className="flex shrink-0 flex-wrap gap-4 md:gap-6">
              {footer.legal_links!.map((link) => (
                <Link key={link.url} to={link.url} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </footer>
  )
}
