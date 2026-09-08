import { apiClient, request } from './client'
import type {
  AuthData,
  ContactSubmission,
  DashboardData,
  HomepageSection,
  ListParams,
  MediaItem,
  NavigationItem,
  NewsletterSubscriber,
  PaginatedData,
  Post,
  Page,
  PostCategory,
  Project,
  ProjectCategory,
  SeoSetting,
  Service,
  SiteSetting,
  SocialLink,
  Statistic,
  Tag,
  User,
} from '@/types'

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthData>(apiClient.post('/admin/login', { email, password })),
  logout: () => request(apiClient.post('/admin/logout')),
  forgotPassword: (email: string) =>
    request(apiClient.post('/admin/forgot-password', { email })),
  resetPassword: (payload: {
    email: string
    token: string
    password: string
    password_confirmation: string
  }) => request(apiClient.post('/admin/reset-password', payload)),
  me: () => request<User>(apiClient.get('/admin/me')),
}

export const cacheApi = {
  flush: () => request(apiClient.post('/admin/cache/flush')),
}

export const activityLogsApi = {
  list: (params?: ListParams & { action?: string }) =>
    request<PaginatedData<import('@/types').ActivityLog>>(apiClient.get('/admin/activity-logs', { params })),
}

export const usersApi = {
  list: () => request<User[]>(apiClient.get('/admin/users')),
  get: (uuid: string) => request<User>(apiClient.get(`/admin/users/${uuid}`)),
  create: (payload: Partial<User> & { password?: string; password_confirmation?: string }) =>
    request<User>(apiClient.post('/admin/users', payload)),
  update: (uuid: string, payload: Partial<User> & { password?: string; password_confirmation?: string }) =>
    request<User>(apiClient.put(`/admin/users/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/users/${uuid}`)),
}

export const dashboardApi = {
  get: () => request<DashboardData>(apiClient.get('/admin/dashboard')),
}

export const postsApi = {
  list: (params?: ListParams) =>
    request<PaginatedData<Post>>(apiClient.get('/admin/posts', { params })),
  get: (uuid: string) => request<Post>(apiClient.get(`/admin/posts/${uuid}`)),
  create: (payload: Partial<Post>) =>
    request<Post>(apiClient.post('/admin/posts', payload)),
  update: (uuid: string, payload: Partial<Post>) =>
    request<Post>(apiClient.put(`/admin/posts/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/posts/${uuid}`)),
  bulk: (payload: { uuids: string[]; action: 'delete' | 'publish' | 'archive' | 'draft' }) =>
    request<{ count: number }>(apiClient.post('/admin/posts/bulk', payload)),
  previewToken: (uuid: string) =>
    request<{ token: string; preview_url: string }>(
      apiClient.post(`/admin/posts/${uuid}/preview-token`),
    ),
}

export const pagesApi = {
  list: (params?: ListParams) =>
    request<PaginatedData<Page>>(apiClient.get('/admin/pages', { params })),
  get: (uuid: string) => request<Page>(apiClient.get(`/admin/pages/${uuid}`)),
  create: (payload: Partial<Page>) =>
    request<Page>(apiClient.post('/admin/pages', payload)),
  update: (uuid: string, payload: Partial<Page>) =>
    request<Page>(apiClient.put(`/admin/pages/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/pages/${uuid}`)),
}

export const categoriesApi = {
  list: () => request<PostCategory[]>(apiClient.get('/admin/categories')),
  create: (payload: Partial<PostCategory>) =>
    request<PostCategory>(apiClient.post('/admin/categories', payload)),
  update: (uuid: string, payload: Partial<PostCategory>) =>
    request<PostCategory>(apiClient.put(`/admin/categories/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/categories/${uuid}`)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/categories/reorder', { ordered_uuids: uuids })),
}

export const tagsApi = {
  list: () => request<Tag[]>(apiClient.get('/admin/tags')),
  create: (payload: Partial<Tag>) => request<Tag>(apiClient.post('/admin/tags', payload)),
  update: (uuid: string, payload: Partial<Tag>) =>
    request<Tag>(apiClient.put(`/admin/tags/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/tags/${uuid}`)),
}

export const projectsApi = {
  list: (params?: ListParams) =>
    request<PaginatedData<Project>>(apiClient.get('/admin/projects', { params })),
  get: (uuid: string) => request<Project>(apiClient.get(`/admin/projects/${uuid}`)),
  create: (payload: Partial<Project>) =>
    request<Project>(apiClient.post('/admin/projects', payload)),
  update: (uuid: string, payload: Partial<Project>) =>
    request<Project>(apiClient.put(`/admin/projects/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/projects/${uuid}`)),
  categories: () =>
    request<ProjectCategory[]>(apiClient.get('/admin/project-categories')),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/projects/reorder', { ordered_uuids: uuids })),
  previewToken: (uuid: string) =>
    request<{ token: string; preview_url: string }>(
      apiClient.post(`/admin/projects/${uuid}/preview-token`),
    ),
}

export const projectCategoriesApi = {
  list: () => request<ProjectCategory[]>(apiClient.get('/admin/project-categories')),
  create: (payload: Partial<ProjectCategory>) =>
    request<ProjectCategory>(apiClient.post('/admin/project-categories', payload)),
  update: (uuid: string, payload: Partial<ProjectCategory>) =>
    request<ProjectCategory>(apiClient.put(`/admin/project-categories/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/project-categories/${uuid}`)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/project-categories/reorder', { ordered_uuids: uuids })),
}

export const servicesApi = {
  list: (params?: ListParams) =>
    request<PaginatedData<Service>>(apiClient.get('/admin/services', { params })),
  get: (uuid: string) => request<Service>(apiClient.get(`/admin/services/${uuid}`)),
  create: (payload: Partial<Service>) =>
    request<Service>(apiClient.post('/admin/services', payload)),
  update: (uuid: string, payload: Partial<Service>) =>
    request<Service>(apiClient.put(`/admin/services/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/services/${uuid}`)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/services/reorder', { ordered_uuids: uuids })),
  previewToken: (uuid: string) =>
    request<{ token: string; preview_url: string }>(
      apiClient.post(`/admin/services/${uuid}/preview-token`),
    ),
}

export const statisticsApi = {
  list: () => request<Statistic[]>(apiClient.get('/admin/statistics')),
  create: (payload: Partial<Statistic>) =>
    request<Statistic>(apiClient.post('/admin/statistics', payload)),
  update: (uuid: string, payload: Partial<Statistic>) =>
    request<Statistic>(apiClient.put(`/admin/statistics/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/statistics/${uuid}`)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/statistics/reorder', { ordered_uuids: uuids })),
}

export const mediaApi = {
  list: (params?: ListParams) =>
    request<PaginatedData<MediaItem>>(apiClient.get('/admin/media', { params })),
  upload: (file: File, altText?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (altText) formData.append('alt_text', altText)
    return request<MediaItem>(
      apiClient.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    )
  },
  delete: (uuid: string) => request(apiClient.delete(`/admin/media/${uuid}`)),
}

export const homepageApi = {
  list: () => request<HomepageSection[]>(apiClient.get('/admin/homepage-sections')),
  update: (uuid: string, payload: Partial<HomepageSection>) =>
    request<HomepageSection>(apiClient.put(`/admin/homepage-sections/${uuid}`, payload)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/homepage-sections/reorder', { ordered_uuids: uuids })),
}

export const navigationApi = {
  list: () => request<NavigationItem[]>(apiClient.get('/admin/navigation')),
  create: (payload: Partial<NavigationItem>) =>
    request<NavigationItem>(apiClient.post('/admin/navigation', payload)),
  update: (uuid: string, payload: Partial<NavigationItem>) =>
    request<NavigationItem>(apiClient.put(`/admin/navigation/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/navigation/${uuid}`)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/navigation/reorder', { ordered_uuids: uuids })),
}

export const socialLinksApi = {
  list: () => request<SocialLink[]>(apiClient.get('/admin/social-links')),
  create: (payload: Partial<SocialLink>) =>
    request<SocialLink>(apiClient.post('/admin/social-links', payload)),
  update: (uuid: string, payload: Partial<SocialLink>) =>
    request<SocialLink>(apiClient.put(`/admin/social-links/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/social-links/${uuid}`)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/social-links/reorder', { ordered_uuids: uuids })),
}

export const contactApi = {
  list: (params?: ListParams) =>
    request<PaginatedData<ContactSubmission>>(
      apiClient.get('/admin/contact-submissions', { params }),
    ),
  get: (uuid: string) =>
    request<ContactSubmission>(apiClient.get(`/admin/contact-submissions/${uuid}`)),
  markRead: (uuid: string) =>
    request<ContactSubmission>(apiClient.patch(`/admin/contact-submissions/${uuid}/read`)),
  bulk: (payload: { uuids: string[]; action: 'mark_read' | 'delete' }) =>
    request<{ count: number }>(apiClient.post('/admin/contact-submissions/bulk', payload)),
}

export const newsletterApi = {
  list: (params?: ListParams) =>
    request<PaginatedData<NewsletterSubscriber>>(
      apiClient.get('/admin/newsletter-subscribers', { params }),
    ),
  unsubscribe: (uuid: string) =>
    request<NewsletterSubscriber>(
      apiClient.patch(`/admin/newsletter-subscribers/${uuid}/unsubscribe`),
    ),
}

export const settingsApi = {
  get: (group?: string) =>
    request<SiteSetting[]>(apiClient.get('/admin/settings', { params: { group } })),
  update: (settings: Record<string, string | null>) =>
    request<SiteSetting[]>(apiClient.put('/admin/settings/bulk', { settings })),
}

export const seoApi = {
  list: () => request<SeoSetting[]>(apiClient.get('/admin/seo-settings')),
  update: (uuid: string, payload: Partial<SeoSetting>) =>
    request<SeoSetting>(apiClient.put(`/admin/seo-settings/${uuid}`, payload)),
  create: (payload: Partial<SeoSetting>) =>
    request<SeoSetting>(apiClient.post('/admin/seo-settings', payload)),
}

export interface TrustStripItem {
  uuid: string
  title: string
  description?: string
  icon?: string
  link?: string
  is_active: boolean
  sort_order: number
}

export const trustStripApi = {
  list: () => request<TrustStripItem[]>(apiClient.get('/admin/trust-strip-items')),
  create: (payload: Partial<TrustStripItem>) =>
    request<TrustStripItem>(apiClient.post('/admin/trust-strip-items', payload)),
  update: (uuid: string, payload: Partial<TrustStripItem>) =>
    request<TrustStripItem>(apiClient.put(`/admin/trust-strip-items/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/trust-strip-items/${uuid}`)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/trust-strip-items/reorder', { ordered_uuids: uuids })),
}

export interface MindanaoConnectVideo {
  uuid: string
  youtube_url: string
  youtube_id: string
  thumbnail_url: string
  title: string
  description?: string
  view_count: number
  is_active: boolean
  sort_order: number
}

export const mindanaoConnectVideosApi = {
  list: () => request<MindanaoConnectVideo[]>(apiClient.get('/admin/mindanao-connect/videos')),
  create: (payload: Partial<MindanaoConnectVideo>) =>
    request<MindanaoConnectVideo>(apiClient.post('/admin/mindanao-connect/videos', payload)),
  update: (uuid: string, payload: Partial<MindanaoConnectVideo>) =>
    request<MindanaoConnectVideo>(apiClient.put(`/admin/mindanao-connect/videos/${uuid}`, payload)),
  delete: (uuid: string) => request(apiClient.delete(`/admin/mindanao-connect/videos/${uuid}`)),
  reorder: (uuids: string[]) =>
    request(apiClient.post('/admin/mindanao-connect/videos/reorder', { ordered_uuids: uuids })),
  importFromChannel: () =>
    request<{ imported: number; updated: number; total: number }>(
      apiClient.post('/admin/mindanao-connect/videos/import'),
    ),
}
