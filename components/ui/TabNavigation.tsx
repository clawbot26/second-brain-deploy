'use client'

import { memo } from 'react'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: number | string
  disabled?: boolean
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
}

/**
 * Tab Navigation Component
 * 
 * Clean, accessible tab navigation with multiple style variants.
 */
export const TabNavigation = memo(function TabNavigation({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
}: TabNavigationProps) {
  const baseClasses = 'relative inline-flex items-center gap-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900 rounded-lg'
  
  const variantClasses = {
    default: {
      container: 'bg-surface-100 dark:bg-surface-800 p-1 rounded-xl',
      tab: 'px-4 py-2 text-sm rounded-lg',
      active: 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm',
      inactive: 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200',
    },
    pills: {
      container: 'border-b border-surface-200 dark:border-surface-700',
      tab: 'px-4 py-3 text-sm border-b-2 -mb-px',
      active: 'border-primary-500 text-primary-600 dark:text-primary-400',
      inactive: 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300',
    },
    underline: {
      container: 'border-b border-surface-200 dark:border-surface-700',
      tab: 'px-4 py-3 text-sm border-b-2 -mb-px',
      active: 'border-surface-900 dark:border-white text-surface-900 dark:text-white',
      inactive: 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300',
    },
  }

  const styles = variantClasses[variant]

  return (
    <nav className={styles.container} role="tablist" aria-label="Navigation tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`${baseClasses} ${styles.tab} ${isActive ? styles.active : styles.inactive}`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
})
