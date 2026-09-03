import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types'

const TOKEN_KEY = 'art_admin_token'
const apiBaseURL = import.meta.env.VITE_API_URL || '/api'
const adminBase = import.meta.env.BASE_URL.replace(/\/$/, '') || ''
const appBaseURL = apiBaseURL.startsWith('http')
  ? apiBaseURL.replace(/\/api\/?$/, '')
  : window.location.origin

let authToken: string | null = localStorage.getItem(TOKEN_KEY)
let csrfReady: Promise<void> | null = null

const mutatingMethods = new Set(['post', 'put', 'patch', 'delete'])

export function resetCsrfCookie(): void {
  csrfReady = null
}

export function ensureCsrfCookie(): Promise<void> {
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

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const config = error.config as (InternalAxiosRequestConfig & { _csrfRetried?: boolean }) | undefined

    if (error.response?.status === 419 && config && !config._csrfRetried) {
      resetCsrfCookie()
      config._csrfRetried = true
      await ensureCsrfCookie()
      return apiClient.request(config)
    }

    if (error.response?.status === 401) {
      clearAuthToken()
      const loginPath = `${adminBase}/login`
      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath
      }
    }
    return Promise.reject(error)
  },
)

export function setAuthToken(token: string): void {
  authToken = token
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  authToken = null
  localStorage.removeItem(TOKEN_KEY)
}

export function getAuthToken(): string | null {
  return authToken
}

export function unwrap<T>(response: AxiosResponse<ApiResponse<T>>): T {
  return response.data.data
}

export async function request<T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> {
  const response = await promise
  return unwrap(response)
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError<ApiResponse>(error)) {
    const message = error.response?.data?.message
    if (message) return message

    const errors = error.response?.data?.errors
    if (errors) {
      const first = Object.values(errors)[0]
      if (first?.[0]) return first[0]
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
