'use client'

import { memo, useMemo, useState, useCallback } from 'react'
import type { Memo } from '@/lib/types'
import { calculateMemoryStats, formatToLocalDateLong } from '@/lib/utils'
import { useTimezone } from '@/lib/timezone-context'
import { Card, Badge, Button, EmptyState } from './ui'

interface MemoViewerProps {
  memo: Memo | null
  onDelete?: (memo: Memo) => void
  onUpdate?: (memo: Memo, content: string, category?: string, tags?: string[]) => Promise<void>
  isDeleting?: boolean
}

/**
 * MemoViewer Component
 *
 * Displays the full content of a selected memo with metadata.
 * Supports inline editing and deletion with confirmation.
 *
 * @param memo - The memo object to display
 * @param onDelete - Callback when delete is confirmed
 * @param onUpdate - Callback when memo is updated
 * @param isDeleting - Whether deletion is in progress
 */
export const MemoViewer = memo(function MemoViewer({
  memo,
  onDelete,
  onUpdate,
  isDeleting = false,
}: MemoViewerProps) {
  const { timezone, isLoaded } = useTimezone()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const stats = useMemo(() => {
    if (!memo) return null
    return calculateMemoryStats(memo.content)
  }, [memo])

  const displayDate = useMemo(() => {
    if (!memo || !isLoaded) return memo ? 'Loading...' : ''
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

  const startEditing = useCallback(() => {
    if (!memo) return
    setEditContent(memo.content)
    setEditCategory(memo.category || '')
    setEditTags(memo.tags || [])
    setTagInput('')
    setIsEditing(true)
  }, [memo])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditContent('')
    setEditCategory('')
    setEditTags([])
    setTagInput('')
  }, [])

  const handleSave = useCallback(async () => {
    if (!memo || !onUpdate) return
    
    setIsSaving(true)
    try {
      await onUpdate(
        memo,
        editContent.trim(),
        editCategory.trim() || undefined,
        editTags.length > 0 ? editTags : undefined
      )
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }, [memo, onUpdate, editContent, editCategory, editTags])

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim()
    if (trimmed && !editTags.includes(trimmed)) {
      setEditTags([...editTags, trimmed])
      setTagInput('')
    }
  }, [tagInput, editTags])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove))
  }, [editTags])

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }, [handleAddTag])

  const handleDelete = useCallback(() => {
    if (!memo || !onDelete) return
    onDelete(memo)
    setShowDeleteConfirm(false)
  }, [memo, onDelete])

  if (!memo) {
    return (
      <Card padding="lg" shadow="sm" className="h-full min-h-[400px]">
        <EmptyState
          icon="📝"
          title="Select a Memo"
          description="Choose a memo from the list to view or edit its contents."
        />
      </Card>
    )
  }

  return (
    <>
      <Card padding="none" shadow="sm" className="h-full">
        {/* Header */}
        <div className="px-6 py-5 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                  {isEditing ? 'Edit Memo' : 'Memo'}
                </h2>
                {memo.category && !isEditing && (
                  <Badge variant="primary">
                    {memo.category}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                Created {displayDate}
                {updatedDate && ` • Updated ${updatedDate}`}
              </p>
            </div>

            {/* Action Buttons */}
            {!isEditing ? (
              <div className="flex items-center gap-2">
                {onUpdate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startEditing}
                    disabled={isDeleting}
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    leftIcon={
                      isDeleting ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )
                    }
                  >
                    Delete
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEditing}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  isLoading={isSaving}
                  disabled={!editContent.trim()}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          {!isEditing && stats && (
            <div className="flex items-center gap-4 mt-3 text-xs text-surface-500 dark:text-surface-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {stats.lines} lines
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {stats.words} words
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {stats.minRead} min
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              {/* Content Editor */}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={8}
                disabled={isSaving}
              />

              {/* Category Editor */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="e.g., Work, Personal"
                  className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isSaving}
                />
              </div>

              {/* Tags Editor */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editTags.map((tag) => (
                    <Badge key={tag} variant="primary">
                      <span className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-primary-800 dark:hover:text-primary-200"
                          disabled={isSaving}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Press Enter to add tag"
                    className="flex-1 px-3 py-2 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isSaving}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || isSaving}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-surface-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-900/50 p-5 rounded-xl border border-surface-200 dark:border-surface-700 overflow-x-auto">
                {memo.content}
              </pre>

              {/* Tags Display */}
              {memo.tags && memo.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
                      Tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {memo.tags.map((tag) => (
                      <Badge key={tag} variant="info">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && memo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-enter">
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-enter">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                Delete Memo?
              </h3>
            </div>
            
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              Are you sure you want to delete this memo? This action cannot be undone.
            </p>
            
            <div className="bg-surface-50 dark:bg-surface-900/50 p-4 rounded-xl mb-6">
              <p className="text-sm text-surface-700 dark:text-surface-300 line-clamp-3">
                &quot;{memo.content}&quot;
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete Memo
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
