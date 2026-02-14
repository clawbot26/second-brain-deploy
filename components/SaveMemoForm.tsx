'use client'

import { useCallback, useState } from 'react'
import { Button, Card, Badge } from './ui'

interface SaveMemoFormProps {
  onSave: (content: string, category?: string, tags?: string[]) => Promise<void>
  isLoading?: boolean
}

/**
 * SaveMemoForm Component
 *
 * Modern form for quickly saving a new memo with optional tags and category.
 * Clean, focused interface with inline tag creation.
 *
 * @param onSave - Callback when memo is saved
 * @param isLoading - Whether save is in progress
 */
export function SaveMemoForm({ onSave, isLoading = false }: SaveMemoFormProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }, [tagInput, tags])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }, [tags])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }, [handleAddTag, tagInput, tags])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!content.trim()) {
      setError('Please enter some content for your memo')
      return
    }

    try {
      await onSave(content.trim(), category.trim() || undefined, tags.length > 0 ? tags : undefined)
      // Reset form
      setContent('')
      setCategory('')
      setTags([])
      setTagInput('')
      setIsExpanded(false)
    } catch {
      setError('Failed to save memo. Please try again.')
    }
  }, [content, category, tags, onSave])

  const handleClear = useCallback(() => {
    setContent('')
    setCategory('')
    setTags([])
    setTagInput('')
    setError(null)
  }, [])

  const hasContent = content.trim().length > 0

  return (
    <Card padding="md" shadow="sm">
      <form onSubmit={handleSubmit}>
        {/* Main Input Area */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="What's on your mind? Jot down a quick thought, idea, or reminder..."
            className="w-full px-4 py-4 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
            rows={isExpanded ? 3 : 2}
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-surface-400 dark:text-surface-500">
            {content.length} chars
          </div>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="mt-4 space-y-4 animate-enter">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Category & Tags Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Work, Personal"
                  className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              {/* Tag Input */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Press Enter to add"
                    className="flex-1 px-3 py-2 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || isLoading}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="primary">
                    <span className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-primary-800 dark:hover:text-primary-200"
                        disabled={isLoading}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClear}
                disabled={isLoading || (!hasContent && !category && tags.length === 0)}
              >
                Clear
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!hasContent}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
              >
                Save Memo
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  )
}
