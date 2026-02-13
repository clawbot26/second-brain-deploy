'use client'

import { memo, useMemo, useState } from 'react'
import type { Memo } from '@/lib/types'
import { calculateMemoryStats, formatToLocalDateLong } from '@/lib/utils'
import { useTimezone } from '@/lib/timezone-context'

interface MemoViewerProps {
  memo: Memo | null
  onEdit?: (memo: Memo) => void
  onDelete?: (memo: Memo) => void
  isDeleting?: boolean
}

/**
 * MemoViewer Component
 *
 * Displays the full content of a selected memo with metadata.
 * Shows a helpful message when no memo is selected.
 * Uses browser timezone for local date formatting.
 * Supports editing and deletion actions.
 *
 * @param memo - The memo object to display
 * @param onEdit - Callback when edit is clicked
 * @param onDelete - Callback when delete is clicked
 * @param isDeleting - Whether a deletion is in progress
 */
export const MemoViewer = memo(function MemoViewer({
  memo,
  onEdit,
  onDelete,
  isDeleting = false,
}: MemoViewerProps) {
  const { timezone, isLoaded } = useTimezone()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const stats = useMemo(() => {
    if (!memo) return null
    return calculateMemoryStats(memo.content)
  }, [memo])

  const displayDate = useMemo(() => {
    if (!memo || !isLoaded) return memo ? 'Loading...' : 'Select a Memo'
    const date = new Date(memo.created_at).toISOString().split('T')[0] ?? ''
    return formatToLocalDateLong(date, timezone)
  }, [memo, timezone, isLoaded])

  const updatedDate = useMemo(() => {
    if (!memo || !isLoaded) return ''
    const date = new Date(memo.updated_at).toISOString().split('T')[0] ?? ''
    const createdDate = new Date(memo.created_at).toISOString().split('T')[0] ?? ''
    if (date !== createdDate) {
      return formatToLocalDateLong(date, timezone)
    }
    return ''
  }, [memo, timezone, isLoaded])

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false)
    onDelete?.(memo!)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {memo ? '📝 Memo' : '📖 Memo Viewer'}
            </h2>
            {memo && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Created on {displayDate}
                {updatedDate && ` • Updated on ${updatedDate}`}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {memo && (
            <div className="flex gap-2 flex-shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(memo)}
                  className="px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                  aria-label="Edit memo"
                  title="Edit memo"
                  disabled={isDeleting}
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                  aria-label="Delete memo"
                  title="Delete memo"
                >
                  {isDeleting ? '⏳' : '🗑️'}
                </button>
              )}
            </div>
          )}
        </div>

        {memo && stats && (
          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>{stats.lines} lines</span>
            <span>{stats.words} words</span>
            <span>{stats.chars} chars</span>
            <span>{stats.minRead} min read</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6 flex-1 overflow-y-auto">
        {memo ? (
          <>
            {/* Memo Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
              <pre
                className="whitespace-pre-wrap text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto font-mono leading-relaxed border border-slate-200 dark:border-slate-700"
                aria-label={`Content of memo: ${memo.content.substring(0, 100)}`}
              >
                {memo.content}
              </pre>
            </div>

            {/* Metadata Section */}
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
              {/* Category */}
              {memo.category && (
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Category
                  </p>
                  <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm">
                    {memo.category}
                  </div>
                </div>
              )}

              {/* Tags */}
              {memo.tags && memo.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {memo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-slate-500 dark:text-slate-400">
              <div className="text-5xl mb-4">📌</div>
              <p className="text-lg font-medium">No Memo Selected</p>
              <p className="text-sm mt-2">Select a memo from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && memo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Delete Memo?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
              Are you sure you want to delete this memo? This action cannot be undone.
            </p>
            <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded mb-4 text-sm max-h-24 overflow-y-auto">
              &quot;{memo.content.substring(0, 100)}{memo.content.length > 100 ? '...' : ''}&quot;
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 rounded-lg transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-medium text-sm disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
