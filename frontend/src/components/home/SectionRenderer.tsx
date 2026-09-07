import { Hero } from '@/components/home/Hero'
import { About } from '@/components/home/About'
import { ServicesSection } from '@/components/home/Services'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { LatestInsights } from '@/components/home/LatestInsights'
import type { HomepageData, HomepageSection, SocialLink } from '@/types'

interface SectionRendererProps {
  data: HomepageData
  socialLinks?: SocialLink[]
  landingOnly?: boolean
}

export function SectionRenderer({ data, socialLinks = [], landingOnly = false }: SectionRendererProps) {
  const sections = [...data.sections]
    .filter((s) => s.type)
    .filter((s) => !landingOnly || s.type === 'hero')
    .sort((a, b) => a.sort_order - b.sort_order)

  if (sections.length === 0) return null

  return (
    <div className={landingOnly ? 'landing-page' : undefined}>
      {sections.map((section) => (
        <SectionBlock key={section.uuid} section={section} data={data} socialLinks={socialLinks} />
      ))}
    </div>
  )
}

function SectionBlock({
  section,
  data,
  socialLinks,
}: {
  section: HomepageSection
  data: HomepageData
  socialLinks: SocialLink[]
}) {
  switch (section.type) {
    case 'hero':
      return <Hero section={section} />
    case 'trust_strip':
      return null
    case 'about':
      return <About section={section} socialLinks={socialLinks} />
    case 'services':
      return (
        <ServicesSection
          section={section}
          services={data.services ?? []}
        />
      )
    case 'featured_projects':
      return (
        <FeaturedProjects
          section={section}
          projects={data.featured_projects ?? []}
        />
      )
    case 'statistics':
      return null
    case 'latest_insights':
      return (
        <LatestInsights
          section={section}
          posts={data.latest_posts ?? []}
        />
      )
    default:
      return null
  }
}
