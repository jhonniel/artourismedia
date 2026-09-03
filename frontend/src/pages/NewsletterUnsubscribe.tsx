import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SEO } from '@/components/ui/SEO'
import { Button } from '@/components/ui/Button'
import { endpoints } from '@/api/endpoints'

export default function NewsletterUnsubscribe() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const email = searchParams.get('email')
    const token = searchParams.get('token')
    if (!email) return

    setStatus('loading')
    endpoints
      .newsletterUnsubscribe(email, token ?? undefined)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [searchParams])

  return (
    <>
      <SEO title="Unsubscribe" noindex />
      <Container className="py-24">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-navy">Newsletter unsubscribe</h1>
          {status === 'loading' && <p className="mt-4 text-navy/70">Processing your request...</p>}
          {status === 'success' && (
            <p className="mt-4 text-navy/70">You have been unsubscribed from Destination Studio insights.</p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-600">Unable to unsubscribe. The link may be invalid or expired.</p>
          )}
          {status === 'idle' && (
            <p className="mt-4 text-navy/70">Missing email parameter in the unsubscribe link.</p>
          )}
          <Link to="/" className="mt-8 inline-block">
            <Button variant="outline">Back to homepage</Button>
          </Link>
        </div>
      </Container>
    </>
  )
}
