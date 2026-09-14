import { useState, type FormEvent, type ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { canonicalUrl, contactPageJsonLd } from '@/lib/structuredData'
import { useContactMutation } from '@/hooks/useMutations'
import { useSite } from '@/hooks'
import { cn } from '@/lib/utils'
import type { ContactFormData } from '@/types'

const CONSULTATION_STEPS = [
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

function ContactDetail({
  label,
  icon,
  children,
}: {
  label: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/80">
        {icon}
      </span>
      <div className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-teal">{label}</span>
        <div className="mt-1 text-sm leading-relaxed text-white/80">{children}</div>
      </div>
    </li>
  )
}

function ContactIcon({ type }: { type: 'email' | 'phone' | 'location' }) {
  const paths = {
    email: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5',
    phone: 'M8 3h2l1 4-2 1a11 11 0 0 0 5 5l1-2 4 1v2a2 2 0 0 1-2 2A15 15 0 0 1 6 5a2 2 0 0 1 2-2Z',
    location: 'M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Zm0-9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z',
  }

  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[type]} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Contact() {
  const { data: site } = useSite()
  const contact = useContactMutation()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: 'Schedule a Consultation',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})

  const settings = site?.settings
  const footer = site?.footer
  const socialLinks = [...(site?.social_links ?? [])].sort((a, b) => a.sort_order - b.sort_order)

  const contactEmail = footer?.contact_email ?? settings?.contact_email
  const contactPhone = footer?.contact_phone ?? settings?.contact_phone
  const contactAddress = footer?.contact_address ?? settings?.contact_address

  const validate = (): boolean => {
    const next: Partial<Record<keyof ContactFormData, string>> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email'
    if (!form.message.trim()) next.message = 'Message is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await contact.mutateAsync(form)
      setSubmitted(true)
      setForm({ name: '', email: '', company: '', phone: '', subject: 'Schedule a Consultation', message: '' })
    } catch {
      // handled by mutation state
    }
  }

  const pageUrl = canonicalUrl('/contact')

  return (
    <>
      <SEO
        title="Schedule a Consultation"
        description="Request a consultation with Art! Boncato Tourism Consultancy."
        url={pageUrl}
        jsonLd={contactPageJsonLd(settings ?? {}, pageUrl)}
      />
      <section className="bg-cream py-16 md:py-24">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Schedule a Consultation"
              title="Let's start a"
              accent="conversation"
              description="Tell us about your destination or tourism project — we'll review your request and get back to you."
              align="center"
              tone="landing"
            />
          </FadeIn>

          <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-5 lg:gap-8">
            <FadeIn delay={100} className="flex w-full flex-col gap-4 lg:col-span-2">
              <div className="rounded-[1.5rem] bg-navy p-5 text-white shadow-elevated sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal">Contact</p>
                <ul className="mt-4 space-y-4">
                  {contactEmail && (
                    <ContactDetail label="Email" icon={<ContactIcon type="email" />}>
                      <a href={`mailto:${contactEmail}`} className="break-all transition-colors hover:text-white">
                        {contactEmail}
                      </a>
                    </ContactDetail>
                  )}
                  {contactPhone && (
                    <ContactDetail label="Phone" icon={<ContactIcon type="phone" />}>
                      <a href={`tel:${contactPhone}`} className="transition-colors hover:text-white">
                        {contactPhone}
                      </a>
                    </ContactDetail>
                  )}
                  {contactAddress && (
                    <ContactDetail label="Location" icon={<ContactIcon type="location" />}>
                      {contactAddress}
                    </ContactDetail>
                  )}
                </ul>
                {socialLinks.length > 0 && (
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Follow us</p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {socialLinks.map((link) => (
                        <a
                          key={link.uuid}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                          aria-label={link.platform}
                        >
                          <SocialIcon platform={link.platform} className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal">What to expect</p>
                <ol className="mt-4 space-y-4">
                  {CONSULTATION_STEPS.map((step, index) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-navy">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-navy/65">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </FadeIn>

            <FadeIn delay={200} className="lg:col-span-3">
              {submitted ? (
                <div className="flex min-h-full flex-col items-center justify-center rounded-[1.5rem] border border-teal/20 bg-white px-6 py-14 text-center shadow-soft sm:px-10">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-2xl text-teal">
                    ✓
                  </span>
                  <h3 className="mt-6 font-serif text-3xl font-normal text-navy">Request received</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-navy/70">
                    Thank you for reaching out. We&apos;ll review your consultation request and respond soon.
                  </p>
                  <Button variant="outline" className="mt-8" onClick={() => setSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-[1.5rem] border border-navy/8 bg-white p-5 shadow-soft sm:p-8"
                >
                  <div className="border-b border-navy/8 pb-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal">Consultation request</p>
                    <h2 className="mt-2 font-serif text-2xl font-normal text-navy">Share your project details</h2>
                    <p className="mt-2 text-sm leading-relaxed text-navy/65">
                      Complete the form below and our team will be in touch to discuss how we can help.
                    </p>
                  </div>

                  <input type="hidden" name="subject" value={form.subject} />

                  <div className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        label="Full name *"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        error={errors.name}
                        placeholder="Your name"
                      />
                      <Input
                        label="Email address *"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        error={errors.email}
                        placeholder="you@organization.com"
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        label="Organization"
                        value={form.company ?? ''}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Company or destination"
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        value={form.phone ?? ''}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+63 ..."
                      />
                    </div>
                    <Textarea
                      label="How can we help? *"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      error={errors.message}
                      placeholder="Briefly describe your destination, goals, timeline, or the challenge you'd like to address."
                      rows={6}
                    />
                    {contact.isError && (
                      <p className="rounded-2xl bg-orange/10 px-4 py-3 text-sm text-orange">{contact.error.message}</p>
                    )}
                    <div className="flex flex-col gap-4 border-t border-navy/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-relaxed text-navy/50">
                        By submitting, you agree to be contacted about your consultation request.
                      </p>
                      <Button
                        type="submit"
                        variant="orange"
                        size="lg"
                        disabled={contact.isPending}
                        className={cn('w-full shrink-0 sm:w-auto', contact.isPending && 'opacity-80')}
                      >
                        {contact.isPending ? 'Sending…' : 'Schedule Consultation →'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  )
}
