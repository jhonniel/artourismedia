import { SocialIcon } from '@/components/ui/SocialIcon'
import { cn } from '@/lib/utils'
import type { SocialLink } from '@/types'

const WHAT_TO_EXPECT = [
  {
    title: 'Share your brief',
    description: 'Tell us about your destination, organization, or tourism initiative.',
  },
  {
    title: 'We review your goals',
    description: 'Our team assesses scope, priorities, and how we can best support you.',
  },
  {
    title: 'We follow up promptly',
    description: 'Expect a thoughtful response to explore next steps together.',
  },
] as const

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

function ContactRowIcon({ type }: { type: 'email' | 'location' }) {
  if (type === 'email') {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 7h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path d="m5 9 7 5 7-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-4.5 6-10a6 6 0 1 0-12 0c0 5.5 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  )
}

interface ContactSidebarProps {
  contactEmail?: string
  contactAddress?: string
  socialLinks?: SocialLink[]
}

export function ContactSidebar({
  contactEmail,
  contactAddress,
  socialLinks = [],
}: ContactSidebarProps) {
  const sortedSocial = [...socialLinks].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="space-y-4">
      <div className="contact-info-card relative overflow-hidden rounded-[1.25rem] bg-navy p-5 text-white shadow-elevated sm:rounded-[1.5rem] sm:p-6">
        <p className="relative z-[1] text-[11px] font-bold uppercase tracking-[0.18em] text-teal sm:text-xs">
          Contact
        </p>

        <ul className="relative z-[1] mt-4 space-y-4">
          {contactEmail && (
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0d2447] text-white ring-1 ring-white/10">
                <ContactRowIcon type="email" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal">Email</p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-1 block break-all text-sm text-white/85 transition-colors hover:text-white"
                >
                  {contactEmail}
                </a>
              </div>
            </li>
          )}

          {contactAddress && (
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0d2447] text-white ring-1 ring-white/10">
                <ContactRowIcon type="location" />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal">Location</p>
                <p className="mt-1 text-sm text-white/85">{contactAddress}</p>
              </div>
            </li>
          )}
        </ul>

        {sortedSocial.length > 0 && (
          <>
            <div className="relative z-[1] my-5 border-t border-white/10" aria-hidden />
            <div className="relative z-[1]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal sm:text-xs">
                Follow Us
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {sortedSocial.map((link) => {
                  const styles = getSocialStyles(link.platform)

                  return (
                    <a
                      key={link.uuid}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-85',
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
            </div>
          </>
        )}
      </div>

      <div className="rounded-[1.25rem] border border-navy/8 bg-white p-5 shadow-soft sm:rounded-[1.5rem] sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal sm:text-xs">
          What to Expect
        </p>

        <ol className="mt-4 space-y-4">
          {WHAT_TO_EXPECT.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/10 text-sm font-bold text-teal">
                {index + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-navy">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-navy/60">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
