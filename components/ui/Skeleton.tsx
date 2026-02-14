'use client'

import { memo } from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
}

/**
 * Skeleton Loading Component
 * 
 * Animated placeholder for loading states.
 */
export const Skeleton = memo(function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-surface-200 dark:bg-surface-700'
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style = {
    width: width,
    height: height,
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
})

interface SkeletonCardProps {
  lines?: number
}

export const SkeletonCard = memo(function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="16px" />
          <Skeleton width="40%" height="12px" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} width={i === lines - 1 ? '70%' : '100%'} height="12px" />
        ))}
      </div>
    </div>
  )
})

export const SkeletonList = memo(function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 border-b border-surface-100 dark:border-surface-700 last:border-0"
        >
          <div className="flex items-center gap-3">
            <Skeleton variant="text" width="100%" height="20px" />
          </div>
        </div>
      ))}
    </div>
  )
})
