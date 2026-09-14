import { useState, type FormEvent } from 'react'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { ContactSidebar } from '@/components/contact/ContactSidebar'
import { canonicalUrl, contactPageJsonLd } from '@/lib/structuredData'
import { useContactMutation } from '@/hooks/useMutations'
import { useSite } from '@/hooks'
import { cn } from '@/lib/utils'
import type { ContactFormData } from '@/types'

const MESSAGE_MAX = 500

function FormHeaderIcon() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-navy">
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="15" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M17 17l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-teal" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 6v6c0 4.2 3 7.8 7 9 4-1.2 7-4.8 7-9V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9.5 12 11 13.5 14.5 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
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
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})

  const settings = site?.settings
  const footer = site?.footer

  const contactEmail = footer?.contact_email ?? settings?.contact_email
  const contactAddress = footer?.contact_address ?? settings?.contact_address ?? 'Philippines'

  const validate = (): boolean => {
    const next: Partial<Record<keyof ContactFormData, string>> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email'
    if (!form.subject?.trim()) next.subject = 'Subject is required'
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
      setForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch {
      // handled by mutation state
    }
  }

  const pageUrl = canonicalUrl('/contact')
  const fieldClassName = 'rounded-xl border-navy/10 py-2.5 text-sm'

  return (
    <>
      <SEO
        title="Schedule a Consultation"
        description="Request a consultation with Art! Boncato Tourism Consultancy."
        url={pageUrl}
        jsonLd={contactPageJsonLd(settings ?? {}, pageUrl)}
      />

      <section className="bg-cream py-10 md:py-14 lg:py-16">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal sm:text-xs">
                  Schedule a Consultation
                </p>
                <h1 className="mt-3 max-w-md font-serif text-[1.85rem] font-normal leading-[1.12] text-navy sm:text-[2.15rem] lg:text-[2.35rem]">
                  <span className="block">Let&apos;s plan your</span>
                  <span className="mt-1 block font-display text-[2rem] leading-[1.05] text-teal sm:text-[2.35rem] lg:text-[2.5rem]">
                    next destination
                  </span>
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-navy/65 sm:text-base">
                  Tell us about your destination or tourism project — we&apos;ll review your request and get back to you.
                </p>
              </FadeIn>

              <FadeIn delay={80} className="mt-8">
                <ContactSidebar
                  contactEmail={contactEmail}
                  contactAddress={contactAddress}
                  socialLinks={site?.social_links ?? []}
                />
              </FadeIn>
            </div>

            <div className="lg:col-span-7">
              <FadeIn delay={120}>
                <div className="mb-5 flex justify-center">
                  <p
                    className="rotate-[4deg] text-center font-display text-[1.35rem] leading-[1.2] text-navy/85 sm:text-[1.45rem] xl:text-[1.5rem]"
                    aria-hidden
                  >
                    <span className="block">Turning Places into</span>
                    <span className="mt-0.5 block">
                      Meaningful{' '}
                      <span className="text-teal underline decoration-teal/45 underline-offset-[5px]">
                        Experiences
                      </span>
                    </span>
                  </p>
                </div>

                {submitted ? (
                  <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-[1.25rem] border border-teal/20 bg-white px-6 py-14 text-center shadow-elevated sm:rounded-[1.5rem] sm:px-10">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-2xl text-teal">
                      ✓
                    </span>
                    <h2 className="mt-6 font-serif text-3xl font-normal text-navy">Request received</h2>
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
                    className="rounded-[1.25rem] border border-navy/8 bg-white p-5 shadow-elevated sm:rounded-[1.5rem] sm:p-7 lg:p-8"
                  >
                    <div className="flex flex-col items-center border-b border-navy/8 pb-5 text-center">
                      <FormHeaderIcon />
                      <h2 className="mt-3 font-serif text-xl font-normal text-navy sm:text-[1.65rem]">
                        Schedule a Consultation
                      </h2>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-navy/60">
                        Fill out the form below and we&apos;ll be in touch shortly.
                      </p>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="Name *"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          error={errors.name}
                          placeholder="Your full name"
                          className={fieldClassName}
                        />
                        <Input
                          label="Email *"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          error={errors.email}
                          placeholder="you@example.com"
                          className={fieldClassName}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="Company / Organization"
                          value={form.company ?? ''}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          placeholder="Company name"
                          className={fieldClassName}
                        />
                        <Input
                          label="Phone"
                          type="tel"
                          value={form.phone ?? ''}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+63 9XX XXX XXXX"
                          className={fieldClassName}
                        />
                      </div>

                      <Input
                        label="Subject *"
                        value={form.subject ?? ''}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        error={errors.subject}
                        placeholder="Schedule a Consultation"
                        className={fieldClassName}
                      />

                      <div className="w-full">
                        <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-navy">
                          Message *
                        </label>
                        <div className="relative">
                          <textarea
                            id="contact-message"
                            value={form.message}
                            maxLength={MESSAGE_MAX}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Tell us about your destination or tourism project..."
                            rows={5}
                            className={cn(
                              'w-full resize-y rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy',
                              'placeholder:text-navy/40 transition-colors duration-200',
                              'focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20',
                              errors.message && 'border-orange focus:border-orange focus:ring-orange/20',
                            )}
                          />
                          <span className="pointer-events-none absolute bottom-3 right-3 text-[11px] text-navy/40">
                            {form.message.length}/{MESSAGE_MAX}
                          </span>
                        </div>
                        {errors.message && <p className="mt-1.5 text-sm text-orange">{errors.message}</p>}
                      </div>

                      {contact.isError && (
                        <p className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange">{contact.error.message}</p>
                      )}

                      <div className="flex flex-col gap-4 border-t border-navy/8 pt-5 lg:flex-row lg:items-center lg:justify-between">
                        <p className="flex max-w-sm items-start gap-2 text-xs leading-relaxed text-navy/55">
                          <ShieldIcon />
                          Your information is secure and will only be used to process your consultation request.
                        </p>
                        <Button
                          type="submit"
                          variant="orange"
                          size="sm"
                          disabled={contact.isPending}
                          className={cn(
                            'w-full shrink-0 gap-1.5 rounded-xl px-5 py-2.5 text-sm lg:w-auto',
                            contact.isPending && 'opacity-80',
                          )}
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M22 3 11 14M22 3l-7 18-4-7-7-4 18-7Z"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {contact.isPending ? 'Sending…' : 'Send'}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
