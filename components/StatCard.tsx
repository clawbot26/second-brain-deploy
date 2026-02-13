'use client'

import { memo } from 'react'
import type { StatCardProps } from '@/lib/types'

/**
 * StatCard Component
 *
 * Displays a statistic with an icon, label, and value.
 * Memoized to prevent unnecessary re-renders.
 *
 * @param icon - Emoji or text icon to display
 * @param label - Label describing the stat
 * @param value - The stat value to display
 * @param className - Optional additional CSS classes
 */
export const StatCard = memo(function StatCard({
  icon,
  label,
  value,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow p-6 transition-shadow hover:shadow-md ${className}`}
      role="status"
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex-shrink-0 text-4xl"
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
            {label}
          </p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
})
