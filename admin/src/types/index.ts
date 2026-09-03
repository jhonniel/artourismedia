export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export interface PaginatedMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedData<T> {
  items: T[]
  meta: PaginatedMeta
}

export interface User {
  uuid: string
  name: string
  email: string
  role: string
}

export interface ActivityLog {
  uuid: string
  action: string
  user?: User | null
  properties?: Record<string, unknown> | null
  ip_address?: string | null
  created_at?: string
}

export interface AuthData {
  token: string
  user: User
}

export interface DashboardStats {
  posts: number
  projects: number
  services: number
  messages: number
  subscribers: number
}

export interface DashboardData {
  stats: DashboardStats
  recent_posts: Post[]
  recent_projects: Project[]
  recent_messages: ContactSubmission[]
}

export interface PostCategory {
  uuid: string
  name: string
  slug: string
  description?: string | null
  is_active: boolean
  sort_order: number
}

export interface Tag {
  uuid: string
  name: string
  slug: string
}

export interface Post {
  uuid: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  featured_image_url?: string | null
  thumbnail_url?: string | null
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  reading_time?: number | null
  published_at?: string | null
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string | null
  allow_social_sharing: boolean
  author?: User | null
  author_uuid?: string | null
  category?: PostCategory | null
  post_category_uuid?: string | null
  tags?: Tag[]
  tag_uuids?: string[]
  created_at?: string
  updated_at?: string
}

export interface ProjectCategory {
  uuid: string
  name: string
  slug: string
  color?: string | null
  is_active: boolean
  sort_order: number
}

export interface Project {
  uuid: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  cover_image_url?: string | null
  category_label?: string | null
  project_category_uuid?: string | null
  category?: ProjectCategory | null
  cta_text?: string | null
  cta_url?: string | null
  color?: string | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  seo_title?: string | null
  seo_description?: string | null
}

export interface Page {
  uuid: string
  title: string
  slug: string
  content?: string | null
  metadata?: PageMetadata | null
  is_published?: boolean
  seo_title?: string | null
  seo_description?: string | null
}

export interface PageValue {
  title: string
  description: string
  icon?: string
}

export interface PageTimelineItem {
  year: string
  title: string
  description: string
}

export interface PageTeamMember {
  name: string
  role: string
  bio: string
}

export interface PageMetadata {
  values?: PageValue[]
  timeline?: PageTimelineItem[]
  team?: PageTeamMember[]
}

export interface Service {
  uuid: string
  title: string
  slug: string
  description?: string | null
  content?: string | null
  icon?: string | null
  image_url?: string | null
  cta_text?: string | null
  cta_url?: string | null
  category?: string | null
  is_active: boolean
  sort_order: number
}

export interface Statistic {
  uuid: string
  number: string
  prefix?: string | null
  suffix?: string | null
  title: string
  description?: string | null
  icon?: string | null
  is_active: boolean
  sort_order: number
}

export interface MediaItem {
  uuid: string
  filename: string
  original_filename: string
  mime_type: string
  size: number
  width?: number | null
  height?: number | null
  url: string
  thumbnail_url?: string | null
  alt_text?: string | null
  created_at?: string
}

export interface HomepageSection {
  uuid: string
  type: string
  title?: string | null
  content: Record<string, unknown> | null
  is_active: boolean
  sort_order: number
}

export interface NavigationItem {
  uuid: string
  label: string
  url: string
  target: '_self' | '_blank'
  is_active: boolean
  is_cta: boolean
  sort_order: number
}

export interface SocialLink {
  uuid: string
  platform: string
  username?: string | null
  url: string
  icon?: string | null
  is_active: boolean
  sort_order: number
}

export interface ContactSubmission {
  uuid: string
  name: string
  email: string
  company?: string | null
  phone?: string | null
  subject?: string | null
  message: string
  status: string
  read_at?: string | null
  created_at?: string
}

export interface NewsletterSubscriber {
  uuid: string
  email: string
  name?: string | null
  status: 'subscribed' | 'unsubscribed'
  subscribed_at?: string | null
  unsubscribed_at?: string | null
}

export interface SiteSetting {
  key: string
  value: string | null
  type: string
  group: string
}

export interface SeoSetting {
  uuid: string
  page_key: string
  title?: string | null
  description?: string | null
  keywords?: string | null
  og_image_url?: string | null
  canonical_url?: string | null
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

export interface ListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  date_from?: string
  date_to?: string
  is_published?: boolean | string
  is_featured?: boolean | string
}
