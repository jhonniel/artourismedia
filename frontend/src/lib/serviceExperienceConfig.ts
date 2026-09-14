export type ServiceExperienceIconType =
  | 'plan'
  | 'mountain'
  | 'palm'
  | 'island'
  | 'gear'
  | 'leaf'
  | 'marketing'
  | 'brand'
  | 'chart'
  | 'sparkles'
  | 'building'
  | 'globe'
  | 'landmark'
  | 'briefcase'
  | 'festival'
  | 'presentation'
  | 'users'
  | 'graduation'
  | 'report'
  | 'video'
  | 'book'

export interface ServiceExperienceConfig {
  sectionDescription: string
  itemIcons?: ServiceExperienceIconType[]
}

const SERVICE_EXPERIENCE_CONFIG: Record<string, ServiceExperienceConfig> = {
  'tourism-planning-development': {
    sectionDescription:
      'A selection of our key tourism planning and development engagements, delivering practical solutions for destinations.',
    itemIcons: ['plan', 'mountain', 'palm', 'island', 'gear', 'leaf'],
  },
  'destination-branding-marketing': {
    sectionDescription:
      'Branding and marketing programs that help destinations tell their story and reach the right audiences.',
    itemIcons: ['marketing', 'brand', 'chart', 'sparkles'],
  },
  'mice-management': {
    sectionDescription:
      'Meetings, incentives, conventions and exhibitions delivered with regional and national expertise.',
    itemIcons: [
      'building',
      'globe',
      'landmark',
      'plan',
      'briefcase',
      'festival',
      'globe',
      'presentation',
    ],
  },
  'thought-leadership-learning-development': {
    sectionDescription:
      'Learning, governance and workforce initiatives that strengthen destination leadership and service quality.',
    itemIcons: ['users', 'graduation'],
  },
  'mindanao-connect': {
    sectionDescription:
      'Regional storytelling and research that connect Mindanao destinations with tourism sector leaders.',
    itemIcons: ['report', 'video', 'book'],
  },
}

export function getServiceExperienceConfig(slug: string): ServiceExperienceConfig {
  return (
    SERVICE_EXPERIENCE_CONFIG[slug] ?? {
      sectionDescription:
        'A selection of engagements delivering practical solutions for destinations and tourism stakeholders.',
    }
  )
}

export function getExperienceItemIcon(
  slug: string,
  index: number,
): ServiceExperienceIconType | null {
  const icons = getServiceExperienceConfig(slug).itemIcons

  if (!icons || index >= icons.length) {
    return null
  }

  return icons[index] ?? null
}
