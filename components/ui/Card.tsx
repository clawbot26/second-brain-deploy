'use client'

import { memo } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Modern Card Component
 * 
 * Consistent card styling with configurable padding and shadow levels.
 */
export const Card = memo(function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-soft',
    md: 'shadow-lg',
    lg: 'shadow-xl',
  }

  return (
    <div
      className={`bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 ${paddingClasses[padding]} ${shadowClasses[shadow]} transition-shadow duration-200 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  )
})

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export const CardHeader = memo(function CardHeader({
  title,
  subtitle,
  action,
  icon,
}: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
})
