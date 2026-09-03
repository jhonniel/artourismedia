import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { FadeIn } from '@/components/ui/FadeIn'
import { LazyImage } from '@/components/ui/LazyImage'
import { CmsIcon } from '@/components/ui/CmsIcon'
import type { AboutPageMetadata } from '@/types'

interface AboutSectionsProps {
  metadata?: AboutPageMetadata | null
}

export function AboutSections({ metadata }: AboutSectionsProps) {
  const values = metadata?.values ?? []
  const timeline = metadata?.timeline ?? []
  const team = metadata?.team ?? []

  if (values.length === 0 && timeline.length === 0 && team.length === 0) {
    return null
  }

  return (
    <div className="mt-16 space-y-20">
      {values.length > 0 && (
        <section>
          <FadeIn>
            <SectionHeading
              eyebrow="What guides us"
              title="Our"
              accent="Values"
              align="center"
            />
          </FadeIn>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <FadeIn key={value.title} delay={index * 80}>
                <Card hover className="h-full text-center">
                  {value.icon && (
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 text-teal">
                      <CmsIcon name={value.icon} size="lg" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-navy">{value.title}</h3>
                  <p className="mt-3 text-navy/60 leading-relaxed">{value.description}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {timeline.length > 0 && (
        <section>
          <FadeIn>
            <SectionHeading
              eyebrow="Our journey"
              title="Three decades of"
              accent="destination building"
              align="center"
            />
          </FadeIn>
          <div className="mx-auto mt-10 max-w-3xl space-y-8">
            {timeline.map((item, index) => (
              <FadeIn key={`${item.year}-${item.title}`} delay={index * 60}>
                <div className="relative border-l-2 border-teal/30 pl-8">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-teal bg-white" />
                  <p className="text-sm font-semibold uppercase tracking-wider text-teal">{item.year}</p>
                  <h3 className="mt-1 text-xl font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-navy/60 leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section>
          <FadeIn>
            <SectionHeading
              eyebrow="Leadership"
              title="Meet the"
              accent="team"
              align="center"
            />
          </FadeIn>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <FadeIn key={member.name} delay={index * 80}>
                <Card className="h-full">
                  {member.avatar_url ? (
                    <LazyImage
                      src={member.avatar_url}
                      alt={member.name}
                      wrapperClassName="mb-4 h-16 w-16 rounded-full"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy text-xl font-bold text-white">
                      {member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-navy">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-teal">{member.role}</p>
                  <p className="mt-3 text-navy/60 leading-relaxed">{member.bio}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
