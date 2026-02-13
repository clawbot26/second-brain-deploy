'use client'

import { memo } from 'react'
import type { Memory } from '@/lib/types'

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
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Memory Timeline
        </h2>
      </div>

      <div
        className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto flex-1"
        role="listbox"
        aria-label="Memory list"
      >
        {isLoading ? (
          <div className="px-6 py-8 text-center text-slate-500">
            <div className="animate-pulse">Loading memories...</div>
          </div>
        ) : error ? (
          <div className="px-6 py-8 text-center text-red-500">
            <p className="font-medium">Error loading memories</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : memories.length === 0 ? (
          <div className="px-6 py-8 text-center text-slate-500">
            No memories found
          </div>
        ) : (
          memories.map((memory) => (
            <button
              key={`${memory.date}-${memory.id}`}
              onClick={() => onSelect(memory)}
              className={`w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                selectedDate === memory.date
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                  : ''
              }`}
              role="option"
              aria-selected={selectedDate === memory.date}
              aria-label={`Memory from ${memory.date}${memory.category ? ` (${memory.category})` : ''}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-900 dark:text-white flex-1 truncate">
                  {memory.date}
                </span>
                <span className="text-xs text-slate-500 flex-shrink-0">
                  {memory.content.split('\n').length} lines
                </span>
              </div>
              {memory.category && (
                <div className="mt-2 text-xs text-slate-500">
                  <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                    {memory.category}
                  </span>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
})
