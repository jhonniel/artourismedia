import { FadeIn } from '@/components/ui/FadeIn'
import { RichContent } from '@/components/ui/RichContent'
import { Container } from '@/components/ui/Container'
import { ServiceDetailHero } from '@/components/services/ServiceDetailHero'
import { ServiceExperienceSection } from '@/components/services/ServiceExperienceSection'
import { ServiceVideoGallery } from '@/components/services/ServiceVideoGallery'
import { parseServiceContent } from '@/lib/parseServiceContent'
import type { Service } from '@/types'

interface ServiceDetailViewProps {
  service: Service
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const { introHtml, experienceItems } = parseServiceContent(service.content)
  const hasExperienceSection = experienceItems.length > 0

  return (
    <article>
      <FadeIn immediate>
        <ServiceDetailHero service={service} introHtml={introHtml} />
      </FadeIn>

      {hasExperienceSection ? (
        <ServiceExperienceSection slug={service.slug} items={experienceItems} />
      ) : (
        service.content && (
          <section className="bg-white py-12 md:py-16">
            <Container>
              <RichContent html={service.content} className="prose-content prose-content-service max-w-3xl" />
            </Container>
          </section>
        )
      )}

      {service.videos && service.videos.length > 0 && (
        <Container className="pb-16 md:pb-24">
          <ServiceVideoGallery videos={service.videos} title="Mindanao CONNECT Videos" />
        </Container>
      )}
    </article>
  )
}
