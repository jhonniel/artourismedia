import { apiClient, unwrap } from '@/api/client'
import { asArray, isCorruptedPayload } from '@/lib/normalizeApi'
import type {
  ContactFormData,
  HomepageData,
  HomepageSection,
  NavigationItem,
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
  SocialLink,
  Statistic,
  TrustStripItem,
} from '@/types'

function assertUsablePayload(data: unknown, label: string): void {
  if (isCorruptedPayload(data)) {
    throw new Error(`Invalid ${label} response from server. Please refresh again.`)
  }
}

export const endpoints = {
  site: async () => {
    const data = await unwrap<SiteData>(apiClient.get('/site'))
    assertUsablePayload(data, 'site')

    return {
      ...data,
      navigation: asArray<NavigationItem>(data.navigation),
      social_links: asArray<SocialLink>(data.social_links),
    }
  },
  homepage: async () => {
    const data = await unwrap<HomepageData>(apiClient.get('/homepage'))
    assertUsablePayload(data, 'homepage')

    return {
      ...data,
      sections: asArray<HomepageSection>(data.sections),
      trust_strip_items: asArray<TrustStripItem>(data.trust_strip_items),
      services: asArray<Service>(data.services),
      featured_projects: asArray<Project>(data.featured_projects),
      statistics: asArray<Statistic>(data.statistics),
      latest_posts: asArray<Post>(data.latest_posts),
    } satisfies HomepageData
  },
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
