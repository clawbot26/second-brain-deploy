'use client'

import { memo } from 'react'
import type { Memory } from '@/lib/types'
import { useTimezone } from '@/lib/timezone-context'
import { formatToLocalDateShort } from '@/lib/utils'
import { SkeletonList, EmptyState, Card } from './ui'

interface MemoryListProps {
  memories: Memory[]
  selectedDate?: string
  onSelect: (memory: Memory) => void
  isLoading?: boolean
  error?: string | null
}

/**
 * MemoryList Component
 *
 * Displays a scrollable list of memories with selection highlighting.
 * Shows loading state, errors, and empty state.
 *
 * @param memories - Array of memory objects to display
 * @param selectedDate - Currently selected memory date
 * @param onSelect - Callback when a memory is selected
 * @param isLoading - Whether data is loading
 * @param error - Error message if one occurred
 */
export const MemoryList = memo(function MemoryList({
  memories,
  selectedDate,
  onSelect,
  isLoading = false,
  error = null,
}: MemoryListProps) {
  const { timezone } = useTimezone()
  if (isLoading) {
    return (
      <Card padding="none" shadow="sm" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
          <div className="h-5 w-32 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
        </div>
        <SkeletonList count={6} />
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding="md" shadow="sm">
        <EmptyState
          icon="⚠️"
          title="Failed to load memories"
          description={error}
        />
      </Card>
    )
  }

  if (memories.length === 0) {
    return (
      <Card padding="md" shadow="sm">
        <EmptyState
          icon="📝"
          title="No memories found"
          description="Memories will appear here once they're synced to the database."
        />
      </Card>
    )
  }

  return (
    <Card padding="none" shadow="sm" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-surface-900 dark:text-white">
            Timeline
          </h2>
          <span className="text-xs font-medium text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
            {memories.length}
          </span>
        </div>
      </div>

      <div
        className="divide-y divide-surface-100 dark:divide-surface-700 max-h-[600px] overflow-y-auto"
        role="listbox"
        aria-label="Memory list"
      >
        {memories.map((memory) => {
          const isSelected = selectedDate === memory.date
          const lineCount = memory.content.split('\n').length

          return (
            <button
              key={`${memory.date}-${memory.id}`}
              onClick={() => onSelect(memory)}
              className={`w-full text-left px-5 py-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset ${
                isSelected
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500'
                  : 'hover:bg-surface-50 dark:hover:bg-surface-700/50 border-l-4 border-l-transparent'
              }`}
              role="option"
              aria-selected={isSelected}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`text-sm font-medium truncate flex-1 ${
                  isSelected ? 'text-primary-900 dark:text-primary-100' : 'text-surface-900 dark:text-white'
                }`}>
                  {formatToLocalDateShort(memory.date, timezone)}
                </span>
                <span className="text-xs text-surface-400 dark:text-surface-500 flex-shrink-0">
                  {lineCount} lines
                </span>
              </div>
              
              {memory.category && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 rounded-full">
                    {memory.category}
                  </span>
                </div>
              )}
              
              {memory.tags && memory.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {memory.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-surface-400 dark:text-surface-500"
                    >
                      #{tag}
                    </span>
                  ))}
                  {memory.tags.length > 3 && (
                    <span className="text-xs text-surface-400 dark:text-surface-500">
                      +{memory.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
})
