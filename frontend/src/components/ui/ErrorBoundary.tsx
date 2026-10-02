import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage?: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info.componentStack)
  }

  render() {
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
