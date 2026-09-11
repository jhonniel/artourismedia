import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/Input'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { NavySectionTopWave } from '@/components/ui/Decorative'
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

function FooterContactIcon({ type }: { type: 'email' | 'phone' | 'location' }) {
  const paths = {
    email: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5',
    phone: 'M8 3h2l1 4-2 1a11 11 0 0 0 5 5l1-2 4 1v2a2 2 0 0 1-2 2A15 15 0 0 1 6 5a2 2 0 0 1 2-2Z',
    location: 'M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Zm0-9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z',
  }

  return (
    <svg className="h-4 w-4 shrink-0 text-white/55" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[type]} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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
    <footer className="relative -mt-px w-full overflow-hidden">
      <NavySectionTopWave className="relative z-10 h-12 sm:h-16 md:h-20 lg:h-24" />

      <div className="relative bg-navy pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] text-white">
        <Container className="relative z-10 pt-10 pb-2 sm:pt-12 sm:pb-3 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            <div className="lg:col-span-4">
            <div className="mb-5">
              <BrandLogo
                logoUrl={logoUrl}
                siteName={siteName}
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
              <div className="min-w-0 lg:col-span-2 lg:border-l lg:border-white/12 lg:pl-8 xl:pl-10">
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

              <div className="min-w-0 lg:col-span-3 lg:border-l lg:border-white/12 lg:pl-8 xl:pl-10">
                <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                  {footer.contact_title ?? 'Contact'}
                </h4>
                <ul className="mt-4 space-y-3 text-sm text-white/80">
                  {footer.contact_email && (
                    <li>
                      <a
                        href={`mailto:${footer.contact_email}`}
                        className="inline-flex items-start gap-3 break-all transition-colors hover:text-white"
                      >
                        <FooterContactIcon type="email" />
                        <span>{footer.contact_email}</span>
                      </a>
                    </li>
                  )}
                  {footer.contact_address && (
                    <li className="flex items-start gap-3">
                      <FooterContactIcon type="location" />
                      <span>{footer.contact_address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3 lg:border-l lg:border-white/12 lg:pl-8 xl:pl-10">
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
                <form
                  onSubmit={handleSubmit}
                  className="mt-4 flex w-full max-w-md flex-col gap-2.5 sm:max-w-lg lg:mx-0 lg:max-w-none xl:flex-row xl:items-stretch xl:gap-0"
                >
                  <div className="min-w-0 xl:flex-1">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10 w-full min-w-0 rounded-full border-white/15 bg-white/10 text-sm text-white placeholder:text-white/45 xl:h-11 xl:rounded-r-none xl:border-r-0 xl:px-5"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={newsletter.isPending}
                    className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-orange px-5 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-orange/90 disabled:opacity-60 xl:h-11 xl:w-auto xl:rounded-l-none xl:rounded-r-full xl:px-6 xl:text-xs"
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

        </Container>

        <div className="relative z-20 border-t border-white/15 bg-navy">
          <Container className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 text-xs text-white/55 sm:py-4">
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
          </Container>
        </div>
      </div>
    </footer>
  )
}
