'use client'

import { memo, useMemo } from 'react'
import type { Memory } from '@/lib/types'
import { calculateMemoryStats } from '@/lib/utils'

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
  const stats = useMemo(() => {
    if (!memory) return null
    return calculateMemoryStats(memory.content)
  }, [memory])

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {memory ? memory.date : 'Select a Memory'}
          </h2>
          {memory && stats && (
            <div className="flex gap-4 text-xs text-slate-500 flex-shrink-0">
              <span>{stats.lines} lines</span>
              <span>{stats.words} words</span>
              <span>{stats.minRead} min read</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6 flex-1 overflow-y-auto">
        {memory ? (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <pre
              className="whitespace-pre-wrap text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto font-mono leading-relaxed"
              aria-label={`Content of memory from ${memory.date}`}
            >
              {memory.content}
            </pre>
            {memory.tags && memory.tags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-slate-500">
              <div className="text-4xl mb-4">📖</div>
              <p>Select a memory from the timeline to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
