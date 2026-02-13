'use client'

import { memo, useCallback } from 'react'
import type { Memory } from '@/lib/types'
import { calculateMemoryStats } from '@/lib/utils'

interface MemoryListItemProps {
  memory: Memory
  isSelected: boolean
  onClick: (memory: Memory) => void
}

/**
 * MemoryListItem Component
 *
 * Renders a single memory item in the list with category, tags, and reading time.
 * Memoized to prevent unnecessary re-renders.
 */
export const MemoryListItem = memo(function MemoryListItem({
  memory,
  isSelected,
  onClick,
}: MemoryListItemProps) {
  const handleClick = useCallback(() => {
    onClick(memory)
  }, [memory, onClick])

  const { minRead } = calculateMemoryStats(memory.content)

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
      }`}
      aria-selected={isSelected}
      aria-label={`Memory from ${memory.date}${memory.category ? ` (${memory.category})` : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-900 dark:text-white truncate flex-1">
          {memory.date}
        </span>
        {memory.category && (
          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
            {memory.category}
          </span>
        )}
        <span className="ml-2 text-xs text-slate-500 flex-shrink-0">
          {minRead} min read
        </span>
      </div>
      {memory.tags && memory.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {memory.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-block text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
            >
              #{tag}
            </span>
          ))}
          {memory.tags.length > 2 && (
            <span className="inline-block text-xs text-slate-500">
              +{memory.tags.length - 2}
            </span>
          )}
        </div>
      )}
    </button>
  )
})
