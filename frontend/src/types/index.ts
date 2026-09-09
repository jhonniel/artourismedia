export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface SiteSettings {
  site_name: string
  tagline?: string
  logo_url?: string
  logo_dark_url?: string
  favicon_url?: string
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  google_analytics_id?: string
  default_seo_title?: string
  default_seo_description?: string
  contact_email?: string
  contact_phone?: string
  contact_address?: string
  footer_text?: string
  copyright?: string
}

export interface NavigationItem {
  uuid: string
  label: string
  url: string
  target: string
  is_cta: boolean
  sort_order: number
}

export interface SocialLink {
  uuid: string
  platform: string
  username?: string
  url: string
  icon?: string
  sort_order: number
}

export interface FooterData {
  description?: string
  newsletter_title?: string
  newsletter_description?: string
  quick_links?: FooterLink[]
  legal_links?: FooterLink[]
  contact_title?: string
  contact_email?: string
  contact_phone?: string
  contact_address?: string
  copyright?: string
}

export interface FooterLink {
  label: string
  url: string
}

export interface SiteData {
  settings: SiteSettings
  navigation: NavigationItem[]
  footer: FooterData
  social_links: SocialLink[]
}

export type HomepageSectionType =
  | 'hero'
  | 'trust_strip'
  | 'about'
  | 'services'
  | 'featured_projects'
  | 'statistics'
  | 'latest_insights'

export interface HomepageSection {
  uuid: string
  type: HomepageSectionType
  title?: string
  content: Record<string, unknown>
  sort_order: number
}

export interface TrustStripItem {
  uuid: string
  title: string
  description?: string
  icon?: string
  link?: string
  sort_order: number
}

export interface HeroContent {
  headline?: string
  headline_prefix?: string
  headline_highlight?: string
  headline_middle?: string
  headline_accent?: string
  subheadline?: string
  cta_text?: string
  cta_url?: string
  secondary_cta_text?: string
  secondary_cta_url?: string
  image_url?: string
  image_alt?: string
  badge_text?: string
  eyebrow?: string
}

export interface AboutContent {
  eyebrow?: string
  title?: string
  title_accent?: string
  body?: string
  image_url?: string
  image_alt?: string
  cta_text?: string
  cta_url?: string
  highlights?: string[]
}

export interface Service {
  uuid: string
  slug: string
  title: string
  description?: string
  content?: string
  icon?: string
  image_url?: string
  cta_text?: string
  cta_url?: string
  category?: string
  sort_order: number
  videos?: ServiceVideo[]
  featured_videos?: ServiceVideo[]
}

export interface ServiceVideo {
  uuid: string
  youtube_url: string
  youtube_id: string
  thumbnail_url: string
  title: string
  description?: string
  view_count: number
}

export interface ProjectCategory {
  uuid: string
  name: string
  slug: string
  color?: string
}

export interface Project {
  uuid: string
  slug: string
  title: string
  excerpt?: string
  content?: string
  cover_image_url?: string
  category_label?: string
  category?: ProjectCategory
  color?: string
  cta_text?: string
  cta_url?: string
  is_featured: boolean
  seo_title?: string
  seo_description?: string
  sort_order: number
}

export interface Statistic {
  uuid: string
  number: string
  prefix?: string
  suffix?: string
  title: string
  description?: string
  icon?: string
  sort_order: number
}

export interface PostCategory {
  uuid: string
  name: string
  slug: string
  description?: string
}

export interface PostAuthor {
  uuid: string
  name: string
  avatar_url?: string
}

export interface PostTag {
  uuid: string
  name: string
  slug: string
}

export interface Post {
  uuid: string
  slug: string
  title: string
  excerpt?: string
  content?: string
  featured_image_url?: string
  thumbnail_url?: string
  category?: PostCategory
  author?: PostAuthor
  tags?: PostTag[]
  reading_time?: number
  published_at?: string
  is_featured: boolean
  seo_title?: string
  seo_description?: string
  allow_social_sharing: boolean
}

export interface HomepageData {
  sections: HomepageSection[]
  trust_strip_items?: TrustStripItem[]
  services?: Service[]
  featured_projects?: Project[]
  statistics?: Statistic[]
  latest_posts?: Post[]
}

export interface Page {
  uuid: string
  slug: string
  title: string
  content?: string
  metadata?: AboutPageMetadata | null
  seo_title?: string
  seo_description?: string
}

export interface AboutStat {
  icon?: 'calendar' | 'users' | 'briefcase' | 'mountain'
  value: string
  label: string
}

export interface AboutLeadershipItem {
  title: string
  organization: string
}

export interface AboutExpertiseItem {
  slug?: string
  title: string
  description: string
}

export interface AboutValue {
  title: string
  description: string
  icon?: string
}

export interface AboutTimelineItem {
  year: string
  title: string
  description: string
}

export interface AboutTeamMember {
  name: string
  role: string
  bio: string
  avatar_url?: string
}

export interface AboutPageMetadata {
  eyebrow?: string
  headline?: string
  intro?: string
  portrait_url?: string
  landscape_url?: string
  signature_name?: string
  signature_title?: string
  quote?: string
  stats?: AboutStat[]
  career_heading?: string
  career_body?: string
  leadership?: AboutLeadershipItem[]
  expertise_heading?: string
  expertise_description?: string
  expertise?: AboutExpertiseItem[]
  closing_eyebrow?: string
  closing_heading?: string
  closing_body?: string
  closing_image_url?: string
  values?: AboutValue[]
  team?: AboutTeamMember[]
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  subject?: string
  message: string
}

export interface NewsletterFormData {
  email: string
  name?: string
}

export interface PostsQueryParams {
  page?: number
  per_page?: number
  search?: string
  category?: string
}

export interface ProjectsQueryParams {
  page?: number
  per_page?: number
  category?: string
  featured?: boolean
}
