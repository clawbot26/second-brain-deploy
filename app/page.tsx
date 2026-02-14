'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  StatCard,
  MemoryList,
  MemoryViewer,
  ErrorBoundary,
  SaveMemoForm,
  MemoList,
  MemoViewer,
} from '@/components'
import { ContentHub } from '@/components/content/ContentHub'
import { Button, TabNavigation, SkeletonCard, SkeletonList, EmptyState, Card } from '@/components/ui'
import type { Memory, MemoryAPIResponse, Memo, MemoAPIResponse, ContentItem, ContentAPIResponse } from '@/lib/types'
import { apiFetch, apiPost, apiDelete, apiPut } from '@/lib/api-client'

// Icons as components for consistency
const BrainIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const MemoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const TaskIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const ContentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
)

/**
 * Home Page Component
 *
 * Modern dashboard with tab-based navigation between:
 * - Memories: Daily memory timeline and viewer
 * - Memos: Quick notes with CRUD operations
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
  const [memoDeleting, setMemoDeleting] = useState<number | null>(null)
  const [memoSaving, setMemoSaving] = useState(false)

  // Content state
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState<string | null>(null)

  // UI state
  const [activeTab, setActiveTab] = useState<'memories' | 'memos' | 'content'>('memories')

  /**
   * Fetch memories from the API
   */
  const fetchMemories = useCallback(async () => {
    setMemoryLoading(true)
    setMemoryError(null)

    try {
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
        setSelectedMemory(data.memories[0]!)
      } else {
        setMemories(data.memories || [])
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
   * Fetch memos from the API
   */
  const fetchMemos = useCallback(async () => {
    setMemoLoading(true)
    setMemoError(null)

    try {
      const response = await apiFetch('/api/memos?limit=100&offset=0', {
        method: 'GET',
        includeTimezone: true,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch memos`)
      }

      const data: MemoAPIResponse = await response.json()

      if (data.error) {
        setMemoError(data.error)
        setMemos([])
      } else {
        setMemos(data.memos || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load memos'
      setMemoError(errorMessage)
      setMemos([])
    } finally {
      setMemoLoading(false)
    }
  }, [])

  /**
   * Handle saving a new memo
   */
  const handleSaveMemo = useCallback(async (content: string, category?: string, tags?: string[]): Promise<void> => {
    setMemoSaving(true)
    try {
      const response = await apiPost<{ memo: Memo }>('/api/memos', {
        content,
        category,
        tags,
      })

      setMemos((prev) => [response.memo, ...prev])
      setSelectedMemo(response.memo)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save memo'
      setMemoError(errorMessage)
      throw err
    } finally {
      setMemoSaving(false)
    }
  }, [])

  /**
   * Handle deleting a memo
   */
  const handleDeleteMemo = useCallback(async (memo: Memo) => {
    setMemoDeleting(memo.id)
    try {
      await apiDelete(`/api/memos/${memo.id}`)
      setMemos((prev) => prev.filter((m) => m.id !== memo.id))
      if (selectedMemo?.id === memo.id) {
        setSelectedMemo(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete memo'
      setMemoError(errorMessage)
    } finally {
      setMemoDeleting(null)
    }
  }, [selectedMemo])

  /**
   * Handle updating a memo
   */
  const handleUpdateMemo = useCallback(async (memo: Memo, content: string, category?: string, tags?: string[]): Promise<void> => {
    try {
      const response = await apiPut<{ memo: Memo }>(`/api/memos/${memo.id}`, {
        content,
        category,
        tags,
      })

      setMemos((prev) =>
        prev.map((m) => (m.id === memo.id ? response.memo : m))
      )
      setSelectedMemo(response.memo)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update memo'
      setMemoError(errorMessage)
      throw err
    }
  }, [])

  /**
   * Fetch content items from the API
   */
  const fetchContent = useCallback(async () => {
    setContentLoading(true)
    setContentError(null)

    try {
      const response = await apiFetch('/api/content?limit=100&offset=0', {
        method: 'GET',
        includeTimezone: true,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch content`)
      }

      const data: ContentAPIResponse<ContentItem[]> = await response.json()

      if (data.error) {
        setContentError(data.error)
        setContentItems([])
      } else {
        setContentItems(data.data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content'
      setContentError(errorMessage)
      setContentItems([])
    } finally {
      setContentLoading(false)
    }
  }, [])

  /**
   * Fetch data on mount
   */
  useEffect(() => {
    fetchMemories()
    fetchMemos()
    fetchContent()
  }, [fetchMemories, fetchMemos, fetchContent])

  /**
   * Handle memory selection
   */
  const handleSelectMemory = useCallback((memory: Memory) => {
    setSelectedMemory(memory)
  }, [])

  /**
   * Handle memo selection
   */
  const handleSelectMemo = useCallback((memo: Memo) => {
    setSelectedMemo(memo)
  }, [])

  /**
   * Dismiss errors
   */
  const dismissMemoryError = useCallback(() => setMemoryError(null), [])
  const dismissMemoError = useCallback(() => setMemoError(null), [])
  const dismissContentError = useCallback(() => setContentError(null), [])

  const tabs = [
    { id: 'memories', label: 'Memories', icon: <BrainIcon />, badge: memories.length },
    { id: 'memos', label: 'Memos', icon: <MemoIcon />, badge: memos.length },
    { id: 'content', label: 'Content', icon: <ContentIcon />, badge: contentItems.length },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Error Banners */}
      {memoryError && activeTab === 'memories' && (
        <div className="mb-6">
          <ErrorBoundary error={memoryError} onRetry={fetchMemories} onDismiss={dismissMemoryError} />
        </div>
      )}
      {memoError && activeTab === 'memos' && (
        <div className="mb-6">
          <ErrorBoundary error={memoError} onRetry={fetchMemos} onDismiss={dismissMemoError} />
        </div>
      )}
      {contentError && activeTab === 'content' && (
        <div className="mb-6">
          <ErrorBoundary error={contentError} onRetry={fetchContent} onDismiss={dismissContentError} />
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="📝"
          label="Memories"
          value={memories.length}
          trend={memories.length > 0 ? '+1 today' : undefined}
          color="blue"
        />
        <StatCard
          icon="📌"
          label="Memos"
          value={memos.length}
          trend={memos.length > 0 ? 'active' : undefined}
          color="amber"
        />
        <StatCard
          icon="📚"
          label="Content"
          value={contentItems.length}
          trend={contentItems.length > 0 ? 'saved' : undefined}
          color="emerald"
        />
        <StatCard
          icon="✅"
          label="Tasks"
          value="—"
          subtitle="Coming soon"
          color="purple"
          comingSoon
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'memories' | 'memos' | 'content')}
          variant="pills"
        />
      </div>

      {/* Memories Tab */}
      {activeTab === 'memories' && (
        <div className="animate-enter">
          {/* Refresh Button Bar */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
              Memory Timeline
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchMemories}
              isLoading={memoryLoading}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Refresh
            </Button>
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
        </div>
      )}

      {/* Memos Tab */}
      {activeTab === 'memos' && (
        <div className="animate-enter space-y-6">
          {/* Quick Add Form */}
          <SaveMemoForm 
            onSave={handleSaveMemo}
            isLoading={memoSaving}
          />

          {/* Memos Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Memo List */}
            <div className="lg:col-span-1">
              {memoLoading ? (
                <Card>
                  <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                    <SkeletonCard lines={1} />
                  </div>
                  <div className="divide-y divide-surface-200 dark:divide-surface-700">
                    <SkeletonList count={4} />
                  </div>
                </Card>
              ) : memos.length === 0 ? (
                <Card>
                  <EmptyState
                    icon="📌"
                    title="No memos yet"
                    description="Create your first memo using the form above. Memos are quick notes you can reference later."
                  />
                </Card>
              ) : (
                <MemoList
                  memos={memos}
                  selectedId={selectedMemo?.id}
                  onSelect={handleSelectMemo}
                  onDelete={handleDeleteMemo}
                />
              )}
            </div>

            {/* Memo Viewer */}
            <div className="lg:col-span-2">
              <MemoViewer
                memo={selectedMemo}
                onDelete={handleDeleteMemo}
                onUpdate={handleUpdateMemo}
                isDeleting={memoDeleting === selectedMemo?.id}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="animate-enter space-y-6">
          <ContentHub />
        </div>
      )}
    </div>
  )
}
