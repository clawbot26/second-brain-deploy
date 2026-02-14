'use client'

import { memo, useMemo } from 'react'
import type { Memory } from '@/lib/types'
import { useTimezone } from '@/lib/timezone-context'
import { calculateMemoryStats, formatToLocalDateLong, formatTimestamp } from '@/lib/utils'
import { Card, Badge, EmptyState } from './ui'

interface MemoryViewerProps {
  memory: Memory | null
}

/**
 * MemoryViewer Component
 *
 * Displays the content of a selected memory with metadata.
 * Shows a helpful message when no memory is selected.
 *
 * @param memory - The memory object to display
 */
export const MemoryViewer = memo(function MemoryViewer({
  memory,
}: MemoryViewerProps) {
  const { timezone } = useTimezone()
  const stats = useMemo(() => {
    if (!memory) return null
    return calculateMemoryStats(memory.content)
  }, [memory])

  if (!memory) {
    return (
      <Card padding="lg" shadow="sm" className="h-full min-h-[400px]">
        <EmptyState
          icon="📖"
          title="Select a Memory"
          description="Choose a memory from the timeline to view its full content here."
        />
      </Card>
    )
  }

  return (
    <Card padding="none" shadow="sm" className="h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">
              {formatToLocalDateLong(memory.date, timezone)}
            </h2>
            {memory.category && (
              <Badge variant="primary" className="mt-2">
                {memory.category}
              </Badge>
            )}
          </div>
          
          {stats && (
            <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
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
                {stats.minRead} min read
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-surface-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-900/50 p-5 rounded-xl border border-surface-200 dark:border-surface-700 overflow-x-auto">
          {memory.content}
        </pre>

        {/* Tags */}
        {memory.tags && memory.tags.length > 0 && (
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
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="info">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer Metadata */}
        <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700 flex items-center gap-4 text-xs text-surface-500 dark:text-surface-400">
          <span>Created {formatTimestamp(memory.created_at, timezone)}</span>
          {memory.updated_at !== memory.created_at && (
            <span>Updated {formatTimestamp(memory.updated_at, timezone)}</span>
          )}
        </div>
      </div>
    </Card>
  )
})
