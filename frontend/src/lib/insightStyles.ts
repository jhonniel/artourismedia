export type CategoryTone = 'teal' | 'orange' | 'purple' | 'navy'

export const CATEGORY_TONES: Record<string, CategoryTone> = {
  strategy: 'teal',
  marketing: 'orange',
  media: 'purple',
}

export const TONE_STYLES: Record<
  CategoryTone,
  { bar: string; pill: string; link: string; number: string }
> = {
  teal: {
    bar: 'bg-teal',
    pill: 'bg-teal/10 text-teal',
    link: 'text-teal group-hover:text-teal/80',
    number: 'text-teal/25',
  },
  orange: {
    bar: 'bg-orange',
    pill: 'bg-orange/10 text-orange',
    link: 'text-orange group-hover:text-orange/80',
    number: 'text-orange/25',
  },
  purple: {
    bar: 'bg-purple',
    pill: 'bg-purple/10 text-purple',
    link: 'text-purple group-hover:text-purple/80',
    number: 'text-purple/25',
  },
  navy: {
    bar: 'bg-navy',
    pill: 'bg-navy/8 text-navy',
    link: 'text-navy group-hover:text-navy/70',
    number: 'text-navy/15',
  },
}

export function categoryTone(name?: string): CategoryTone {
  if (!name) return 'teal'
  return CATEGORY_TONES[name.toLowerCase()] ?? 'navy'
}

export function toneStyles(name?: string) {
  return TONE_STYLES[categoryTone(name)]
}
