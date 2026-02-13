'use client'

import { useEffect, useState } from 'react'

interface Memory {
  date: string
  content: string
  path: string
}

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)

  useEffect(() => {
    fetch('/api/memories')
      .then(res => res.json())
      .then(data => {
        setMemories(data.memories || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading memories:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-4xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Memories
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {memories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-4xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Documents
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                Coming Soon
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-4xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Tasks
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                Coming Soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Memory Timeline
              </h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  Loading memories...
                </div>
              ) : memories.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  No memories found
                </div>
              ) : (
                memories.map((memory) => (
                  <button
                    key={memory.date}
                    onClick={() => setSelectedMemory(memory)}
                    className={`w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      selectedMemory?.date === memory.date
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {memory.date}
                      </span>
                      <span className="text-xs text-slate-500">
                        {memory.content.split('\n').length} lines
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Memory Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {selectedMemory ? selectedMemory.date : 'Select a Memory'}
              </h2>
            </div>
            <div className="px-6 py-6">
              {selectedMemory ? (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto">
                    {selectedMemory.content}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  Select a memory from the timeline to view its contents
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
