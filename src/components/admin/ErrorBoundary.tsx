'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: string
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a fallback UI instead of crashing the entire application.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * Or with custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Store error info in state for display
    this.setState({
      errorInfo: errorInfo?.componentStack || 'No additional information available'
    })

    // TODO: Send error to error tracking service (e.g., Sentry, LogRocket)
    // Example:
    // errorTrackingService.logError(error, {
    //   componentStack: errorInfo.componentStack,
    //   timestamp: new Date().toISOString(),
    // })
  }

  handleReset = () => {
    // Reset error state
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleReload = () => {
    // Reload the entire page
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-2xl w-full text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-6" />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Something went wrong
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
                <h2 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  Error Details (Development Only):
                </h2>
                <pre className="text-sm text-red-800 dark:text-red-200 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <>
                    <h3 className="font-semibold text-red-900 dark:text-red-100 mt-4 mb-2">
                      Component Stack:
                    </h3>
                    <pre className="text-sm text-red-800 dark:text-red-200 overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo}
                    </pre>
                  </>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="sm:w-auto"
              >
                Try Again
              </Button>

              <Button
                onClick={this.handleReload}
                className="sm:w-auto"
              >
                Reload Page
              </Button>
            </div>

            {/* Additional help text */}
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
              If this problem persists, please contact support or try clearing your browser cache.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
