import type { Project } from '@/types'

export const PROJECT_CATEGORY_FILTERS = [
  'All Projects',
  'Strategy & Planning',
  'Destination Management',
  'Ecotourism & Conservation',
  'Community Development',
] as const

export type ProjectCategoryFilter = (typeof PROJECT_CATEGORY_FILTERS)[number]

export const LOGO_COVER_SLUGS = new Set(['clean-camiguin-pivot-transformation'])

export const COVER_OBJECT_POSITION: Partial<Record<string, string>> = {
  'mounts-timpoong-hibok-hibok-ecotourism-plan': 'object-[center_40%]',
}

const PROJECT_LOCATIONS: Record<string, string> = {
  'samal-strategic-action-plan': 'Samal Island, Davao del Norte',
  'mantigue-island-tourism-management-plan': 'Mantigue Island, Camiguin',
  'mounts-timpoong-hibok-hibok-ecotourism-plan': 'Camiguin, Philippines',
  'camiguin-tourism-development-action-plan-2026-2028': 'Camiguin, Philippines',
  'clean-camiguin-pivot-transformation': 'Camiguin, Philippines',
}

export function getProjectLocation(project: Project): string | undefined {
  return PROJECT_LOCATIONS[project.slug]
}

export function filterProjectsByCategory(projects: Project[], filter: ProjectCategoryFilter): Project[] {
  if (filter === 'All Projects') {
    return projects
  }

  return projects.filter((project) => project.category_label === filter)
}

export const PROJECTS_PER_PAGE = 5
