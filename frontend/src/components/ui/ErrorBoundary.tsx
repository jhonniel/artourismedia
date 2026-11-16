import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  reloading: boolean
  errorMessage?: string
}

const CHUNK_RELOAD_KEY = 'art-stale-chunk-reload'

function isStaleChunkError(error: Error): boolean {
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading chunk [\w-]+ failed/i.test(
    `${error.name} ${error.message}`,
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, reloading: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (isStaleChunkError(error) && typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
      return { hasError: false, reloading: true, errorMessage: error.message }
    }

    return { hasError: true, reloading: false, errorMessage: error.message }
  }

  componentDidMount() {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY)
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info.componentStack)

    if (this.state.reloading) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
      window.location.reload()
    }
  }

  render() {
    if (this.state.reloading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )
    }

    if (this.state.hasError) {
      const detail =
        import.meta.env.DEV && this.state.errorMessage
          ? ` (${this.state.errorMessage})`
          : ''

      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <ErrorMessage
            message={`Something went wrong loading this page.${detail}`}
            onRetry={() => window.location.reload()}
          />
        </div>
      )
    }

    return this.props.children
  }
}
