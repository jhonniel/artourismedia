import type { CSSProperties } from 'react'

const READABLE_TEXT_GRADIENT =
  'linear-gradient(to right, #F8F4EC 0%, #F8F4EC 18%, rgba(248,244,236,0.92) 26%, rgba(248,244,236,0.72) 34%, rgba(248,244,236,0.48) 42%, rgba(248,244,236,0.24) 50%, rgba(248,244,236,0.08) 56%, transparent 64%)'

const MINDANAO_GRADIENT =
  'linear-gradient(to right, #F8F4EC 0%, #F8F4EC 36%, rgba(248,244,236,0.92) 44%, rgba(248,244,236,0.72) 52%, rgba(248,244,236,0.48) 60%, rgba(248,244,236,0.24) 68%, rgba(248,244,236,0.08) 74%, transparent 82%)'

export interface ServiceHeroOverrides {
  imageWrapperClassName?: string
  imageClassName?: string
  gradientStyle?: CSSProperties
}

const SERVICE_HERO_OVERRIDES: Record<string, ServiceHeroOverrides> = {
  'mindanao-connect': {
    imageWrapperClassName: 'translate-x-[12%] lg:translate-x-[16%]',
    imageClassName: 'scale-[1.06] object-[72%_top]',
    gradientStyle: { background: MINDANAO_GRADIENT },
  },
  'thought-leadership-learning-development': {
    imageWrapperClassName: 'translate-x-[10%] lg:translate-x-[14%]',
    imageClassName: 'scale-[1.04] object-[58%_center]',
    gradientStyle: { background: READABLE_TEXT_GRADIENT },
  },
  'mice-management': {
    imageWrapperClassName: 'translate-x-[4%] lg:translate-x-[6%]',
    imageClassName: 'scale-[1.04] object-[48%_center]',
    gradientStyle: { background: READABLE_TEXT_GRADIENT },
  },
  'destination-branding-marketing': {
    imageWrapperClassName: 'translate-x-[4%] lg:translate-x-[6%]',
    imageClassName: 'scale-[1.04] object-[55%_40%]',
    gradientStyle: { background: READABLE_TEXT_GRADIENT },
  },
}

export function getServiceHeroOverrides(slug: string): ServiceHeroOverrides {
  return SERVICE_HERO_OVERRIDES[slug] ?? {}
}
