import { Hero } from '@/components/home/Hero'
import { About } from '@/components/home/About'
import { ServicesSection } from '@/components/home/Services'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { LatestInsights } from '@/components/home/LatestInsights'
import type { HomepageData, HomepageSection, SocialLink } from '@/types'

interface SectionRendererProps {
  data: HomepageData
  socialLinks?: SocialLink[]
}

export function SectionRenderer({ data, socialLinks = [] }: SectionRendererProps) {
  const sections = [...data.sections]
    .filter((s) => s.type)
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <>
      {sections.map((section) => (
        <SectionBlock key={section.uuid} section={section} data={data} socialLinks={socialLinks} />
      ))}
    </>
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
