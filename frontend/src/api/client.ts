import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types'

function resolveApiBaseURL(): string {
  // In dev, always use the Vite proxy so the browser hits the same host/port as the UI.
  if (import.meta.env.DEV) {
    return '/api'
  }

  return import.meta.env.VITE_API_URL ?? '/api'
}

const apiBaseURL = resolveApiBaseURL()
const appBaseURL = apiBaseURL.startsWith('http')
  ? apiBaseURL.replace(/\/api\/?$/, '')
  : typeof window !== 'undefined'
    ? window.location.origin
    : ''

let csrfReady: Promise<void> | null = null

const mutatingMethods = new Set(['post', 'put', 'patch', 'delete'])

function ensureCsrfCookie(): Promise<void> {
  if (!csrfReady) {
    csrfReady = axios
      .get(`${appBaseURL}/sanctum/csrf-cookie`, { withCredentials: true })
      .then(() => undefined)
      .catch((error) => {
        csrfReady = null
        throw error
      })
  }

  return csrfReady
}

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const method = config.method?.toLowerCase()
  if (method && mutatingMethods.has(method)) {
    await ensureCsrfCookie()
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise
  if (!data.success) {
    throw new Error(data.message || 'Request failed')
  }
  return data.data
}
