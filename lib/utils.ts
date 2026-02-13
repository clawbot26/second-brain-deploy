/**
 * Utility functions for the 2nd Brain application
 */

import { DATE_FORMAT, MEMORY_STATS } from './constants'

/**
 * Validate a date string in YYYY-MM-DD format
 * @param date - Date string to validate
 * @returns true if date is valid, false otherwise
 */
export function isValidDate(date: unknown): date is string {
  return typeof date === 'string' && DATE_FORMAT.test(date)
}

/**
 * Calculate memory statistics from content
 * @param content - Memory content text
 * @returns Object with lines, words, and character counts
 */
export function calculateMemoryStats(content: string) {
  const lines = content.split('\n').length
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const chars = content.length
  const minRead = Math.max(1, Math.ceil(chars / MEMORY_STATS.CHARS_PER_MIN_READ))

  return { lines, words, chars, minRead }
}

/**
 * Format memory content for display (trim and preserve formatting)
 * @param content - Raw memory content
 * @returns Formatted content
 */
export function formatMemoryContent(content: string): string {
  return content.trim()
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Generate a unique key for a memory item combining date and id
 * @param date - Memory date
 * @param id - Memory id
 * @returns Unique identifier
 */
export function getMemoryKey(date: string, id?: number): string {
  return id ? `${date}-${id}` : date
}

/**
 * Parse error message from various error types
 * @param error - Error object
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}
