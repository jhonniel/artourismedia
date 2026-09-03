import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import type { PostsQueryParams, ProjectsQueryParams } from '@/types'

export function useSite() {
  return useQuery({
    queryKey: ['site'],
    queryFn: endpoints.site,
    staleTime: 5 * 60 * 1000,
  })
}

export function useHomepage() {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: endpoints.homepage,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePage(slug: string) {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: () => endpoints.page(slug),
    enabled: Boolean(slug),
  })
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: endpoints.services,
    staleTime: 5 * 60 * 1000,
  })
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => endpoints.service(slug),
    enabled: Boolean(slug),
  })
}

export function useProjects(params?: ProjectsQueryParams) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => endpoints.projects(params),
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => endpoints.project(slug),
    enabled: Boolean(slug),
  })
}

export function usePosts(params?: PostsQueryParams) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => endpoints.posts(params),
  })
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => endpoints.post(slug),
    enabled: Boolean(slug),
  })
}

export function usePostCategories() {
  return useQuery({
    queryKey: ['post-categories'],
    queryFn: endpoints.postCategories,
    staleTime: 5 * 60 * 1000,
  })
}
