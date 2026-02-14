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

// Content Hub Types

export type ContentType = 'article' | 'youtube' | 'note'

export type ContentCategory = 'tech' | 'business' | 'science' | 'design' | 'health' | 'finance' | 'productivity' | 'other'

export interface ContentItem {
  id: number
  url: string | null
  title: string
  summary: string | null
  key_points: string[] | null
  content_type: ContentType
  category: ContentCategory | null
  tags: string[] | null
  source_name: string | null
  author: string | null
  thumbnail_url: string | null
  duration: string | null
  published_date: string | null
  is_read: boolean
  is_archived: boolean
  read_at: string | null
  created_at: string
  updated_at: string
}

export interface ContentItemCreateInput {
  url: string
  title: string
  summary?: string
  key_points?: string[]
  content_type: ContentType
  category?: ContentCategory
  tags?: string[]
  source_name?: string
  author?: string
  thumbnail_url?: string
  duration?: string
  published_date?: string
}

export interface ContentItemUpdateInput {
  title?: string
  summary?: string
  key_points?: string[]
  category?: ContentCategory
  tags?: string[]
  is_read?: boolean
  is_archived?: boolean
  read_at?: string
}

export interface ContentFilterOptions {
  search?: string
  content_type?: ContentType
  category?: ContentCategory
  tags?: string[]
  is_read?: boolean
  is_archived?: boolean
}

export interface ContentAPIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  count?: number
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Extracted metadata from URLs
export interface ExtractedMetadata {
  title: string
  description?: string
  author?: string
  thumbnail_url?: string
  content_type: ContentType
  source_name?: string
  duration?: string
  published_date?: string
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
