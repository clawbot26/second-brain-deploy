import { useEffect, useState } from 'react'
import { Memory } from './db'

interface UseFetchMemoriesResult {
  memories: Memory[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch memories from the API
 * Handles loading and error states
 */
export function useFetchMemories(): UseFetchMemoriesResult {
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMemories = async () => {
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
        throw new Error(`Failed to fetch memories: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.memories || !Array.isArray(data.memories)) {
        throw new Error('Invalid response format')
      }

      setMemories(data.memories)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error loading memories:', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMemories()
  }, [])

  return {
    memories,
    isLoading,
    error,
    refetch: fetchMemories,
  }
}
