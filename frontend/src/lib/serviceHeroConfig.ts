export interface ServiceHeroOverrides {
  imageWrapperClassName?: string
  imageClassName?: string
  blobClassName?: string
  mobileBlobClassName?: string
}

const SERVICE_HERO_OVERRIDES: Record<string, ServiceHeroOverrides> = {
  'tourism-planning-development': {
    blobClassName: 'service-detail-hero__image-blob--tourism',
    mobileBlobClassName: 'service-detail-hero__image-mobile--tourism',
    imageClassName: 'scale-[1.12] object-cover object-[54%_40%]',
  },
  'destination-branding-marketing': {
    blobClassName: 'service-detail-hero__image-blob--soft',
    mobileBlobClassName: 'service-detail-hero__image-mobile--soft',
    imageClassName: 'scale-[1.08] object-cover object-[56%_42%]',
  },
  'mindanao-connect': {
    blobClassName: 'service-detail-hero__image-blob--soft',
    mobileBlobClassName: 'service-detail-hero__image-mobile--soft',
    imageClassName: 'scale-[1.06] object-cover object-[62%_38%]',
  },
  'thought-leadership-learning-development': {
    blobClassName: 'service-detail-hero__image-blob--soft',
    mobileBlobClassName: 'service-detail-hero__image-mobile--soft',
    imageClassName: 'scale-[1.06] object-cover object-[54%_center]',
  },
  'mice-management': {
    blobClassName: 'service-detail-hero__image-blob--soft',
    mobileBlobClassName: 'service-detail-hero__image-mobile--soft',
    imageClassName: 'scale-[1.06] object-cover object-[50%_center]',
  },
}

export function getServiceHeroOverrides(slug: string): ServiceHeroOverrides {
  return (
    SERVICE_HERO_OVERRIDES[slug] ?? {
      blobClassName: 'service-detail-hero__image-blob--soft',
      mobileBlobClassName: 'service-detail-hero__image-mobile--soft',
    }
  )
}
