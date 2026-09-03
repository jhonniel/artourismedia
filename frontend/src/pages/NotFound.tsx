import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for could not be found." />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <FadeIn>
          <p className="font-display text-6xl text-teal md:text-8xl">404</p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">Page not found</h1>
          <p className="mt-4 max-w-md text-navy/60">
            The page you are looking for may have been moved or no longer exists.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button variant="orange" size="lg">Back to Home</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">Contact Us</Button>
            </Link>
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
