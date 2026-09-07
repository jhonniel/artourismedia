import { useState, type FormEvent } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { canonicalUrl, contactPageJsonLd } from '@/lib/structuredData'
import { useContactMutation } from '@/hooks/useMutations'
import { useSite } from '@/hooks'
import type { ContactFormData } from '@/types'

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

  const settings = site?.settings
  const pageUrl = canonicalUrl('/contact')

  return (
    <>
      <SEO
        title="Schedule a Consultation"
        description="Request a consultation with Art! Boncato Tourism Consultancy."
        url={pageUrl}
        jsonLd={contactPageJsonLd(settings ?? {}, pageUrl)}
      />
      <Container className="py-16 md:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow="Schedule a Consultation"
            title="Let's start a"
            accent="conversation"
            description="Tell us about your destination or tourism project — we'll review your request and get back to you."
            align="center"
          />
        </FadeIn>

        <div className="mx-auto grid max-w-5xl gap-8 sm:gap-10 lg:grid-cols-5 lg:gap-12">
          <FadeIn delay={100} className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl bg-navy p-5 text-white sm:p-8">
              <h3 className="text-xl font-bold">Contact Information</h3>
              <ul className="mt-6 space-y-4 text-white/70">
                {settings?.contact_email && (
                  <li>
                    <span className="block text-xs uppercase tracking-wider text-teal">Email</span>
                    <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings?.contact_phone && (
                  <li>
                    <span className="block text-xs uppercase tracking-wider text-teal">Phone</span>
                    {settings.contact_phone}
                  </li>
                )}
                {settings?.contact_address && (
                  <li>
                    <span className="block text-xs uppercase tracking-wider text-teal">Address</span>
                    {settings.contact_address}
                  </li>
                )}
              </ul>
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-3xl border border-navy/10 shadow-soft">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-teal/10 via-cream to-navy/5">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-2xl">
                    📍
                  </div>
                  <p className="font-semibold text-navy">Our Location</p>
                  <p className="mt-1 text-sm text-navy/60">
                    {settings?.contact_address ?? 'Metro Manila, Philippines'}
                  </p>
                </div>
                {/* Decorative map grid */}
                <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
                  <defs>
                    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#078C95" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200} className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-3xl bg-teal/10 p-5 text-center sm:p-8">
                <h3 className="text-2xl font-bold text-teal">Consultation request sent!</h3>
                <p className="mt-2 text-navy/70">Thank you for reaching out. We&apos;ll review your request and respond soon.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl bg-white p-5 shadow-card sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    error={errors.name}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    error={errors.email}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Company"
                    value={form.company ?? ''}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={form.phone ?? ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <Input
                  label="Subject"
                  value={form.subject ?? ''}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
                <Textarea
                  label="Message *"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  error={errors.message}
                />
                {contact.isError && (
                  <p className="text-sm text-orange">{contact.error.message}</p>
                )}
                <Button type="submit" variant="orange" size="lg" disabled={contact.isPending} className="w-full sm:w-auto">
                  {contact.isPending ? 'Sending…' : 'Schedule Consultation'}
                </Button>
              </form>
            )}
          </FadeIn>
        </div>
      </Container>
    </>
  )
}
