'use client'

import { memo, useMemo } from 'react'
import type { Memo } from '@/lib/types'
import { formatToLocalDateLong } from '@/lib/utils'
import { useTimezone } from '@/lib/timezone-context'
import { Card, Badge, Button } from './ui'

interface MemoListProps {
  memos: Memo[]
  selectedId?: number
  onSelect: (memo: Memo) => void
  onDelete?: (memo: Memo) => void
}

/**
 * MemoList Component
 *
 * Displays a scrollable list of saved memos with selection highlighting.
 * Shows loading state, errors, and empty state.
 * Supports filtering by category and deletion.
 *
 * @param memos - Array of memo objects to display
 * @param selectedId - Currently selected memo id
 * @param onSelect - Callback when a memo is selected
 * @param onDelete - Callback when delete is clicked
 */
export const MemoList = memo(function MemoList({
  memos,
  selectedId,
  onSelect,
  onDelete,
}: MemoListProps) {
  const { timezone, isLoaded } = useTimezone()

  const truncateText = (text: string, maxLength: number = 60): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <Card padding="none" shadow="sm" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-surface-900 dark:text-white">
            Saved Memos
          </h2>
          <span className="text-xs font-medium text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
            {memos.length}
          </span>
        </div>
      </div>

      <div
        className="divide-y divide-surface-100 dark:divide-surface-700 max-h-[500px] overflow-y-auto"
        role="listbox"
        aria-label="Memo list"
      >
        {memos.map((memo) => {
          const isSelected = selectedId === memo.id
          const formattedDate = isLoaded
            ? formatToLocalDateLong(
                new Date(memo.created_at).toISOString().split('T')[0] ?? '',
                timezone
              )
            : new Date(memo.created_at).toLocaleDateString()

          return (
            <div
              key={`memo-${memo.id}`}
              className={`group transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'
              }`}
            >
              <button
                onClick={() => onSelect(memo)}
                className={`w-full text-left px-5 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset border-l-4 ${
                  isSelected
                    ? 'border-l-primary-500'
                    : 'border-l-transparent'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isSelected ? 'text-primary-900 dark:text-primary-100' : 'text-surface-900 dark:text-white'
                    }`}>
                      {truncateText(memo.content, 60)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {formattedDate}
                      </span>
                      {memo.category && (
                        <Badge variant="default" size="sm">
                          {memo.category}
                        </Badge>
                      )}
                    </div>

                    {memo.tags && memo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {memo.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-primary-600 dark:text-primary-400"
                          >
                            #{tag}
                          </span>
                        ))}
                        {memo.tags.length > 2 && (
                          <span className="text-xs text-surface-500 dark:text-surface-400">
                            +{memo.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delete Button - shows on hover */}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(memo)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </Card>
  )
})
