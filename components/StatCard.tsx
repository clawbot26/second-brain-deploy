'use client'

import { memo } from 'react'
import { Card } from './ui/Card'

interface StatCardProps {
  icon: string | React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  trend?: string
  color?: 'blue' | 'amber' | 'emerald' | 'purple' | 'rose'
  comingSoon?: boolean
  className?: string
}

/**
 * Modern StatCard Component
 *
 * Displays a statistic with an icon, label, and value.
 * Memoized to prevent unnecessary re-renders.
 *
 * @param icon - Emoji or icon component to display
 * @param label - Label describing the stat
 * @param value - The stat value to display
 * @param subtitle - Optional subtitle text
 * @param trend - Optional trend indicator
 * @param color - Color theme for the card
 * @param comingSoon - Whether this feature is coming soon
 * @param className - Optional additional CSS classes
 */
export const StatCard = memo(function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  color = 'blue',
  comingSoon = false,
  className = '',
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  }

  const iconBgClass = colorClasses[color]

  return (
    <Card padding="md" shadow="sm" className={`${comingSoon ? 'opacity-75' : ''} ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center text-2xl`}>
          {typeof icon === 'string' ? icon : icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-surface-900 dark:text-white">
              {value}
            </p>
            {trend && !comingSoon && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
              {subtitle}
            </p>
          )}
          {comingSoon && (
            <span className="inline-flex items-center mt-2 px-2 py-0.5 text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 rounded-full">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </Card>
  )
})
