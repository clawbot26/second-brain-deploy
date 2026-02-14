'use client'

import { memo } from 'react'
import { Button } from './ui/Button'

interface ErrorBoundaryProps {
  error: string | null
  onRetry?: () => void
  onDismiss?: () => void
  children?: React.ReactNode
}

/**
 * ErrorBoundary Component
 *
 * Displays error messages with optional retry functionality.
 * Can be used as a wrapper (shows children when no error) or standalone alert.
 *
 * @param error - The error message to display
 * @param onRetry - Callback when retry button is clicked
 * @param onDismiss - Callback when dismiss button is clicked
 * @param children - Child elements to render when no error
 */
export const ErrorBoundary = memo(function ErrorBoundary({
  error,
  onRetry,
  onDismiss,
  children,
}: ErrorBoundaryProps) {
  if (!error) {
    return children || null
  }

  return (
    <div
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start justify-between gap-4 animate-enter"
      role="alert"
      aria-label="Error message"
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">
            Something went wrong
          </h3>
          <p className="text-sm text-red-700 dark:text-red-200 mt-1 break-words">
            {error}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {onRetry && (
          <Button
            variant="danger"
            size="sm"
            onClick={onRetry}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        )}
      </div>
    </div>
  )
})
