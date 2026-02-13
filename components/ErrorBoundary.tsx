'use client'

import { memo } from 'react'

interface ErrorBoundaryProps {
  error: string | null
  onRetry?: () => void
  children?: React.ReactNode
}

/**
 * ErrorBoundary Component
 *
 * Displays error messages with optional retry functionality
 * Useful for showing API errors and validation failures
 */
export const ErrorBoundary = memo(function ErrorBoundary({
  error,
  onRetry,
  children,
}: ErrorBoundaryProps) {
  if (!error) {
    return children || null
  }

  return (
    <div
      className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start justify-between gap-4"
      role="alert"
      aria-label="Error message"
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="flex-shrink-0 text-red-600 dark:text-red-400 text-xl mt-0.5">
          ⚠️
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
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
          aria-label="Retry"
        >
          Retry
        </button>
      )}
    </div>
  )
})
