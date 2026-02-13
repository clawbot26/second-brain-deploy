'use client'

import { useCallback, useState } from 'react'
import type { Memo } from '@/lib/types'
import { apiPost } from '@/lib/api-client'

interface SaveMemoFormProps {
  onMemoSaved?: (memo: Memo) => void
  onError?: (error: string) => void
}

/**
 * SaveMemoForm Component
 *
 * Form for quickly saving a new memo with optional tags and category.
 * Provides a clean, simple interface for creating memos.
 *
 * Features:
 * - Quick memo input
 * - Optional category selection
 * - Tag input with comma-separated support
 * - Loading state feedback
 * - Error handling
 * - Auto-clear on successful save
 * - Dark mode support
 *
 * @param onMemoSaved - Callback when memo is successfully saved
 * @param onError - Callback when an error occurs
 */
export function SaveMemoForm({ onMemoSaved, onError }: SaveMemoFormProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)

      if (!content.trim()) {
        const errorMsg = 'Memo content cannot be empty'
        setError(errorMsg)
        onError?.(errorMsg)
        return
      }

      setIsLoading(true)
      try {
        // Parse tags from comma-separated input
        const tags = tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)

        const response = await apiPost<{ memo: Memo }>('/api/memos', {
          content: content.trim(),
          category: category.trim() || undefined,
          tags: tags.length > 0 ? tags : undefined,
        })

        const { memo } = response
        setContent('')
        setCategory('')
        setTagsInput('')
        onMemoSaved?.(memo)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to save memo'
        setError(errorMsg)
        onError?.(errorMsg)
      } finally {
        setIsLoading(false)
      }
    },
    [content, category, tagsInput, onMemoSaved, onError]
  )

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        ✏️ Save a Memo
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Content Input */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to remember? Quick notes, reminders, ideas..."
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={isLoading}
          aria-label="Memo content"
        />
      </div>

      {/* Category and Tags Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Category Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Category (optional)
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Work, Personal, Health"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isLoading}
            aria-label="Memo category"
          />
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tags (optional, comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g., urgent, important, follow-up"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isLoading}
            aria-label="Memo tags"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setContent('')
            setCategory('')
            setTagsInput('')
            setError(null)
          }}
          disabled={isLoading}
          className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors font-medium text-sm"
          aria-label="Clear form"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm disabled:cursor-not-allowed"
          aria-label="Save memo"
        >
          {isLoading ? 'Saving...' : '💾 Save Memo'}
        </button>
      </div>
    </form>
  )
}
