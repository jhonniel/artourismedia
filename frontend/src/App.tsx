import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'))
const Projects = lazy(() => import('@/pages/Projects'))
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))
const Insights = lazy(() => import('@/pages/Insights'))
const InsightDetail = lazy(() => import('@/pages/InsightDetail'))
const InsightPreview = lazy(() => import('@/pages/InsightPreview'))
const ProjectPreview = lazy(() => import('@/pages/ProjectPreview'))
const ServicePreview = lazy(() => import('@/pages/ServicePreview'))
const Contact = lazy(() => import('@/pages/Contact'))
const CmsPage = lazy(() => import('@/pages/CmsPage'))
const NewsletterUnsubscribe = lazy(() => import('@/pages/NewsletterUnsubscribe'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="services"
            element={
              <Suspense fallback={<PageLoader />}>
                <Services />
              </Suspense>
            }
          />
          <Route
            path="services/preview/:uuid"
            element={
              <Suspense fallback={<PageLoader />}>
                <ServicePreview />
              </Suspense>
            }
          />
          <Route
            path="services/:slug"
            element={
              <Suspense fallback={<PageLoader />}>
                <ServiceDetail />
              </Suspense>
            }
          />
          <Route
            path="projects"
            element={
              <Suspense fallback={<PageLoader />}>
                <Projects />
              </Suspense>
            }
          />
          <Route
            path="projects/preview/:uuid"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProjectPreview />
              </Suspense>
            }
          />
          <Route
            path="projects/:slug"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProjectDetail />
              </Suspense>
            }
          />
          <Route
            path="insights"
            element={
              <Suspense fallback={<PageLoader />}>
                <Insights />
              </Suspense>
            }
          />
          <Route
            path="insights/preview/:uuid"
            element={
              <Suspense fallback={<PageLoader />}>
                <InsightPreview />
              </Suspense>
            }
          />
          <Route
            path="insights/:slug"
            element={
              <Suspense fallback={<PageLoader />}>
                <InsightDetail />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<PageLoader />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="newsletter/unsubscribe"
            element={
              <Suspense fallback={<PageLoader />}>
                <NewsletterUnsubscribe />
              </Suspense>
            }
          />
          <Route
            path="privacy-policy"
            element={
              <Suspense fallback={<PageLoader />}>
                <CmsPage />
              </Suspense>
            }
          />
          <Route
            path="terms-of-use"
            element={
              <Suspense fallback={<PageLoader />}>
                <CmsPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
