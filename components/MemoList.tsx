'use client'

import { memo, useMemo } from 'react'
import type { Memo } from '@/lib/types'
import { formatToLocalDateLong } from '@/lib/utils'
import { useTimezone } from '@/lib/timezone-context'

interface MemoListProps {
  memos: Memo[]
  selectedId?: number
  onSelect: (memo: Memo) => void
  onDelete?: (memo: Memo) => void
  isLoading?: boolean
  error?: string | null
  filterCategory?: string
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
 * @param isLoading - Whether data is loading
 * @param error - Error message if one occurred
 * @param filterCategory - Filter memos by category
 */
export const MemoList = memo(function MemoList({
  memos,
  selectedId,
  onSelect,
  onDelete,
  isLoading = false,
  error = null,
  filterCategory,
}: MemoListProps) {
  const { timezone, isLoaded } = useTimezone()

  // Filter memos by category if specified
  const filteredMemos = useMemo(() => {
    if (!filterCategory) return memos
    return memos.filter((memo) => memo.category === filterCategory)
  }, [memos, filterCategory])

  const truncateText = (text: string, maxLength: number = 60): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          📌 Saved Memos
        </h2>
        {filteredMemos.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {filteredMemos.length} memo{filteredMemos.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div
        className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto flex-1"
        role="listbox"
        aria-label="Memo list"
      >
        {isLoading ? (
          <div className="px-6 py-8 text-center text-slate-500">
            <div className="animate-pulse">Loading memos...</div>
          </div>
        ) : error ? (
          <div className="px-6 py-8 text-center text-red-500">
            <p className="font-medium">Error loading memos</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : filteredMemos.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-500">
            {memos.length === 0 ? 'No memos saved yet. Create your first memo!' : 'No memos in this category'}
          </div>
        ) : (
          filteredMemos.map((memo) => {
            const formattedDate = isLoaded
              ? formatToLocalDateLong(
                  new Date(memo.created_at).toISOString().split('T')[0],
                  timezone
                )
              : new Date(memo.created_at).toLocaleDateString()

            return (
              <button
                key={`memo-${memo.id}`}
                onClick={() => onSelect(memo)}
                className={`w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                  selectedId === memo.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                    : ''
                }`}
                role="option"
                aria-selected={selectedId === memo.id}
                aria-label={`Memo: ${truncateText(memo.content)}${memo.category ? ` (${memo.category})` : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {truncateText(memo.content, 60)}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{formattedDate}</span>
                      {memo.category && (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
                          {memo.category}
                        </span>
                      )}
                    </div>
                    {memo.tags && memo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {memo.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {memo.tags.length > 2 && (
                          <span className="inline-block px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
                            +{memo.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(memo)
                      }}
                      className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex-shrink-0"
                      aria-label={`Delete memo: ${truncateText(memo.content)}`}
                      title="Delete memo"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
})
