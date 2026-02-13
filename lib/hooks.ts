import { useCallback, useEffect, useState } from 'react'
import type { Memory, MemoryAPIResponse } from './types'
import { getErrorMessage } from './utils'

interface UseFetchMemoriesResult {
  memories: Memory[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch memories from the API
 * Handles loading and error states with proper dependency management
 */
export function useFetchMemories(): UseFetchMemoriesResult {
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMemories = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/memories', {
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
        throw new Error(data.error)
      }

      if (!data.memories || !Array.isArray(data.memories)) {
        throw new Error('Invalid response format: memories array missing')
      }

      setMemories(data.memories)
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      console.error('Error loading memories:', errorMessage)
      setMemories([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMemories()
  }, [fetchMemories])

  return {
    memories,
    isLoading,
    error,
    refetch: fetchMemories,
  }
}
