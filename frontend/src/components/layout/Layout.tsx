import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics'
import { SiteHead } from '@/components/layout/SiteHead'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useSite } from '@/hooks'

export function Layout() {
  const { data, isLoading, isError, refetch } = useSite()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <ErrorMessage message="Unable to load site configuration." onRetry={() => refetch()} />
      </div>
    )
  }

  const settings = data.settings

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip">
      <SiteHead
        siteName={settings.site_name ?? 'Destination Studio'}
        faviconUrl={settings.favicon_url}
        primaryColor={settings.primary_color ?? undefined}
        secondaryColor={settings.secondary_color ?? undefined}
        accentColor={settings.accent_color ?? undefined}
        defaultTitle={settings.default_seo_title ?? undefined}
        defaultDescription={settings.default_seo_description ?? undefined}
      />
      <GoogleAnalytics measurementId={settings.google_analytics_id} />
      <Header navigation={data.navigation} settings={data.settings} />
      <main className="main-offset flex-1 w-full">
        <Outlet />
      </main>
      <Footer
        footer={data.footer}
        socialLinks={data.social_links}
        siteName={settings.site_name ?? 'Destination Studio'}
        logoUrl={settings.logo_url}
      />
    </div>
  )
}
