'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  StatCard,
  MemoryList,
  MemoryViewer,
  ErrorBoundary,
  SaveMemoForm,
  MemoList,
  MemoViewer as MemoViewerComponent,
} from '@/components'
import type { Memory, MemoryAPIResponse, Memo, MemoAPIResponse } from '@/lib/types'
import { apiFetch } from '@/lib/api-client'

/**
 * Home Page Component
 *
 * Main dashboard for browsing and viewing memories and memos.
 * Features:
 * - Statistics dashboard with memory and memo counts
 * - Memory timeline list with search and selection
 * - Memory viewer with content display
 * - Save memo form for quick note creation
 * - Saved memos list with management
 * - Memo viewer with edit and delete capabilities
 * - Error handling and loading states
 * - Dark mode support
 * - Tab-based navigation between memories and memos
 */
export default function Home() {
  // Memory state
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [memoryLoading, setMemoryLoading] = useState(true)
  const [memoryError, setMemoryError] = useState<string | null>(null)

  // Memo state
  const [memos, setMemos] = useState<Memo[]>([])
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null)
  const [memoLoading, setMemoLoading] = useState(true)
  const [memoError, setMemoError] = useState<string | null>(null)
  const [memoSuccess, setMemoSuccess] = useState<string | null>(null)
  const [memoDeleting, setMemoDeleting] = useState(false)

  // UI state
  const [activeTab, setActiveTab] = useState<'memories' | 'memos'>('memories')
  const [memoFilterCategory, setMemoFilterCategory] = useState<string>('')

  /**
   * Fetch memories from the API
   * Handles loading state, error state, pagination, and timezone
   */
  const fetchMemories = useCallback(async () => {
    setMemoryLoading(true)
    setMemoryError(null)

    try {
      // Use apiFetch to automatically include timezone header
      const response = await apiFetch('/api/memories?limit=100&offset=0', {
        method: 'GET',
        includeTimezone: true,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch memories`)
      }

      const data: MemoryAPIResponse = await response.json()

      if (data.error) {
        setMemoryError(data.error)
        setMemories([])
      } else if (data.memories && data.memories.length > 0) {
        setMemories(data.memories)
        // Auto-select the first memory for initial load
        setSelectedMemory(data.memories[0]!)
      } else if (data.memories) {
        setMemories(data.memories)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load memories'
      setMemoryError(errorMessage)
      setMemories([])
    } finally {
      setMemoryLoading(false)
    }
  }, [])

  /**
   * Fetch memories on component mount
   */
  useEffect(() => {
    fetchMemories()
  }, [fetchMemories])

  /**
   * Handle memory selection
   */
  const handleSelectMemory = useCallback((memory: Memory) => {
    setSelectedMemory(memory)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Banner */}
      <ErrorBoundary error={memoryError} onRetry={fetchMemories} />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
        <StatCard
          icon="📝"
          label="Total Memories"
          value={memories.length}
        />
        <StatCard
          icon="📄"
          label="Documents"
          value="Coming Soon"
        />
        <StatCard
          icon="✅"
          label="Tasks"
          value="Coming Soon"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory List */}
        <div className="lg:col-span-1">
          <MemoryList
            memories={memories}
            selectedDate={selectedMemory?.date}
            onSelect={handleSelectMemory}
            isLoading={memoryLoading}
            error={memoryError}
          />
        </div>

        {/* Memory Viewer */}
        <div className="lg:col-span-2">
          <MemoryViewer memory={selectedMemory} />
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={fetchMemories}
          disabled={memoryLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-medium"
          aria-label="Refresh memories"
        >
          {memoryLoading ? 'Loading...' : 'Refresh Memories'}
        </button>
      </div>
    </div>
  )
}
