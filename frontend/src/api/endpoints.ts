import { apiClient, unwrap } from '@/api/client'
import type {
  ContactFormData,
  HomepageData,
  NewsletterFormData,
  Page,
  PaginatedResponse,
  Post,
  PostCategory,
  PostsQueryParams,
  Project,
  ProjectsQueryParams,
  Service,
  SiteData,
} from '@/types'

export const endpoints = {
  site: () => unwrap<SiteData>(apiClient.get('/site')),
  homepage: () => unwrap<HomepageData>(apiClient.get('/homepage')),
  page: (slug: string) => unwrap<Page>(apiClient.get(`/pages/${slug}`)),
  services: () => unwrap<Service[]>(apiClient.get('/services')),
  service: (slug: string) => unwrap<Service>(apiClient.get(`/services/${slug}`)),
  projects: (params?: ProjectsQueryParams) =>
    unwrap<PaginatedResponse<Project>>(apiClient.get('/projects', { params })),
  project: (slug: string) =>
    unwrap<Project & { related?: Project[] }>(apiClient.get(`/projects/${slug}`)),
  posts: (params?: PostsQueryParams) =>
    unwrap<PaginatedResponse<Post>>(apiClient.get('/posts', { params })),
  post: (slug: string) =>
    unwrap<Post & { related?: Post[]; previous?: Post | null; next?: Post | null }>(
      apiClient.get(`/posts/${slug}`),
    ),
  postPreview: (uuid: string, token: string) =>
    unwrap<Post>(apiClient.get(`/posts/preview/${uuid}`, { params: { token } })),
  projectPreview: (uuid: string, token: string) =>
    unwrap<Project>(apiClient.get(`/projects/preview/${uuid}`, { params: { token } })),
  servicePreview: (uuid: string, token: string) =>
    unwrap<Service>(apiClient.get(`/services/preview/${uuid}`, { params: { token } })),
  postCategories: () => unwrap<PostCategory[]>(apiClient.get('/categories')),
  contact: (data: ContactFormData) =>
    unwrap<{ uuid: string }>(apiClient.post('/contact', data)),
  newsletter: (data: NewsletterFormData) =>
    unwrap<{ uuid: string }>(apiClient.post('/newsletter', data)),
  newsletterUnsubscribe: (email: string, token?: string) =>
    unwrap<{ message?: string }>(
      apiClient.post('/newsletter/unsubscribe', { email, token }),
    ),
}
