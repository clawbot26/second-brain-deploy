'use client'

import { useEffect, useState, useCallback } from 'react'
import { StatCard, MemoryList, MemoryViewer } from '@/components'
import type { Memory, MemoryAPIResponse } from '@/lib/types'

/**
 * Home Page Component
 *
 * Main dashboard for browsing and viewing memories.
 * Features:
 * - Statistics dashboard with memory count
 * - Memory timeline list with search and selection
 * - Memory viewer with content display
 * - Error handling and loading states
 * - Dark mode support
 */
export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch memories from the API
   * Handles loading state, error state, and pagination
   */
  const fetchMemories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/memories?limit=100&offset=0', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch memories`)
      }

      const data: MemoryAPIResponse = await response.json()

      if (data.error) {
        setError(data.error)
        setMemories([])
      } else if (data.memories) {
        setMemories(data.memories)
        // Auto-select the first memory if available
        if (data.memories.length > 0 && !selectedMemory) {
          setSelectedMemory(data.memories[0])
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load memories'
      setError(errorMessage)
      setMemories([])
    } finally {
      setLoading(false)
    }
  }, [selectedMemory])

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
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            isLoading={loading}
            error={error}
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
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-medium"
          aria-label="Refresh memories"
        >
          {loading ? 'Loading...' : 'Refresh Memories'}
        </button>
      </div>
    </div>
  )
}
