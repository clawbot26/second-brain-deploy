/**
 * Type definitions for the 2nd Brain application
 */

/** Represents a memory entry in the database */
export interface Memory {
  id: number
  date: string
  content: string
  category?: string | null
  tags?: string[] | null
  created_at: string | Date
  updated_at: string | Date
}

/** Alias for Memory - used in memo-specific contexts */
export type Memo = Memory

/** API response type for memory operations */
export interface MemoryAPIResponse {
  memories?: Memory[]
  memory?: Memory
  error?: string
  code?: string
  details?: unknown
  count?: number
  limit?: number
  offset?: number
  hasMore?: boolean
}

/** API response type for memo operations (includes memo field for memo-specific APIs) */
export interface MemoAPIResponse {
  memo?: Memory
  memory?: Memory
  memos?: Memory[]
  memories?: Memory[]
  error?: string
  code?: string
  details?: unknown
  count?: number
  limit?: number
  offset?: number
  hasMore?: boolean
}

/** Pagination parameters */
export interface PaginationParams {
  limit?: number
  offset?: number
}

/** Component props for stat cards */
export interface StatCardProps {
  icon: string
  label: string
  value: string | number
  className?: string
}

/** Memory list item for UI display */
export interface MemoryListItem {
  date: string
  content: string
  lineCount: number
}

/** Memory statistics */
export interface MemoryStats {
  lines: number
  words: number
  chars: number
  minRead: number
}
