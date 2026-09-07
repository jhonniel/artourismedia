import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/composables/usePermissions'
import AdminLayout from '@/components/layout/AdminLayout.vue'

declare module 'vue-router' {
  interface RouteMeta {
    guest?: boolean
    requiresAuth?: boolean
    title?: string
    roles?: UserRole[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { guest: true, title: 'Login' },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPassword.vue'),
      meta: { guest: true, title: 'Forgot Password' },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPassword.vue'),
      meta: { guest: true, title: 'Reset Password' },
    },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: 'Dashboard', roles: ['admin', 'editor', 'author'] },
        },
        {
          path: 'website/homepage',
          name: 'homepage-sections',
          component: () => import('@/views/website/HomepageSections.vue'),
          meta: { title: 'Homepage Sections', roles: ['admin', 'editor'] },
        },
        {
          path: 'website/trust-strip',
          name: 'trust-strip',
          component: () => import('@/views/website/TrustStripList.vue'),
          meta: { title: 'Trust Strip', roles: ['admin', 'editor'] },
        },
        {
          path: 'website/navigation',
          name: 'navigation',
          component: () => import('@/views/website/Navigation.vue'),
          meta: { title: 'Navigation', roles: ['admin', 'editor'] },
        },
        {
          path: 'website/footer',
          name: 'footer-settings',
          component: () => import('@/views/website/FooterSettings.vue'),
          meta: { title: 'Footer Settings', roles: ['admin', 'editor'] },
        },
        {
          path: 'website/social',
          name: 'social-links',
          component: () => import('@/views/website/SocialLinks.vue'),
          meta: { title: 'Social Links', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/pages',
          name: 'pages',
          component: () => import('@/views/content/PagesList.vue'),
          meta: { title: 'Pages', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/pages/create',
          name: 'page-create',
          component: () => import('@/views/content/PageEditor.vue'),
          meta: { title: 'New Page', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/pages/:uuid/edit',
          name: 'page-edit',
          component: () => import('@/views/content/PageEditor.vue'),
          meta: { title: 'Edit Page', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/posts',
          name: 'posts',
          component: () => import('@/views/content/PostsList.vue'),
          meta: { title: 'Posts', roles: ['admin', 'editor', 'author'] },
        },
        {
          path: 'content/posts/create',
          name: 'post-create',
          component: () => import('@/views/content/PostEditor.vue'),
          meta: { title: 'New Post', roles: ['admin', 'editor', 'author'] },
        },
        {
          path: 'content/posts/:uuid/edit',
          name: 'post-edit',
          component: () => import('@/views/content/PostEditor.vue'),
          meta: { title: 'Edit Post', roles: ['admin', 'editor', 'author'] },
        },
        {
          path: 'content/categories',
          name: 'categories',
          component: () => import('@/views/content/CategoriesList.vue'),
          meta: { title: 'Categories', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/tags',
          name: 'tags',
          component: () => import('@/views/content/TagsList.vue'),
          meta: { title: 'Tags', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/projects',
          name: 'projects',
          component: () => import('@/views/content/ProjectsList.vue'),
          meta: { title: 'Projects', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/projects/create',
          name: 'project-create',
          component: () => import('@/views/content/ProjectEditor.vue'),
          meta: { title: 'New Project', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/projects/:uuid/edit',
          name: 'project-edit',
          component: () => import('@/views/content/ProjectEditor.vue'),
          meta: { title: 'Edit Project', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/project-categories',
          name: 'project-categories',
          component: () => import('@/views/content/ProjectCategoriesList.vue'),
          meta: { title: 'Project Categories', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/services',
          name: 'services',
          component: () => import('@/views/content/ServicesList.vue'),
          meta: { title: 'Services', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/services/create',
          name: 'service-create',
          component: () => import('@/views/content/ServiceEditor.vue'),
          meta: { title: 'New Service', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/services/:uuid/edit',
          name: 'service-edit',
          component: () => import('@/views/content/ServiceEditor.vue'),
          meta: { title: 'Edit Service', roles: ['admin', 'editor'] },
        },
        {
          path: 'content/statistics',
          name: 'statistics',
          component: () => import('@/views/content/StatisticsList.vue'),
          meta: { title: 'Statistics', roles: ['admin', 'editor'] },
        },
        {
          path: 'media',
          name: 'media',
          component: () => import('@/views/media/MediaLibrary.vue'),
          meta: { title: 'Media Library', roles: ['admin', 'editor', 'author'] },
        },
        {
          path: 'communication/contact',
          name: 'contact-submissions',
          component: () => import('@/views/communication/ContactSubmissions.vue'),
          meta: { title: 'Consultation Requests', roles: ['admin', 'editor'] },
        },
        {
          path: 'communication/newsletter',
          name: 'newsletter-subscribers',
          component: () => import('@/views/communication/NewsletterSubscribers.vue'),
          meta: { title: 'Newsletter Subscribers', roles: ['admin', 'editor'] },
        },
        {
          path: 'settings/general',
          name: 'general-settings',
          component: () => import('@/views/settings/GeneralSettings.vue'),
          meta: { title: 'General Settings', roles: ['admin'] },
        },
        {
          path: 'settings/appearance',
          name: 'appearance-settings',
          component: () => import('@/views/settings/AppearanceSettings.vue'),
          meta: { title: 'Appearance Settings', roles: ['admin'] },
        },
        {
          path: 'settings/seo',
          name: 'seo-settings',
          component: () => import('@/views/settings/SeoSettings.vue'),
          meta: { title: 'SEO Settings', roles: ['admin'] },
        },
        {
          path: 'settings/users',
          name: 'users',
          component: () => import('@/views/settings/UsersList.vue'),
          meta: { title: 'Users', roles: ['admin'] },
        },
        {
          path: 'settings/users/create',
          name: 'user-create',
          component: () => import('@/views/settings/UserEditor.vue'),
          meta: { title: 'New User', roles: ['admin'] },
        },
        {
          path: 'settings/users/:uuid/edit',
          name: 'user-edit',
          component: () => import('@/views/settings/UserEditor.vue'),
          meta: { title: 'Edit User', roles: ['admin'] },
        },
        {
          path: 'settings/activity-log',
          name: 'activity-log',
          component: () => import('@/views/settings/ActivityLog.vue'),
          meta: { title: 'Activity Log', roles: ['admin'] },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.initialize()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  const allowedRoles = to.meta.roles
  if (allowedRoles && authStore.role && !allowedRoles.includes(authStore.role as UserRole)) {
    return { name: 'dashboard' }
  }

  document.title = to.meta.title ? `${to.meta.title} · ART CMS` : 'ART CMS Admin'
  return true
})

export default router
