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

/**
 * Format a date string to a long local date format using a timezone
 * @param dateString - Date string in YYYY-MM-DD format or ISO format
 * @param timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatToLocalDateLong(dateString: string, timezone: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    // Fallback to simple date string if formatting fails
    return dateString
  }
}

/**
 * Format a date string to a long date format WITHOUT timezone conversion
 * This treats the date as a calendar date only, preserving the exact date from the string
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Friday, February 13, 2026")
 */
export function formatDateWithoutTimezone(dateString: string): string {
  try {
    // Parse the date parts directly to avoid timezone conversion
    const parts = dateString.split('-')
    if (parts.length !== 3) return dateString
    
    const [yearStr, monthStr, dayStr] = parts as [string, string, string]
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10)
    const day = parseInt(dayStr, 10)
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return dateString
    
    // Create date at local midnight (month is 0-indexed in JavaScript Date)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Format a date string to a short date format WITHOUT timezone conversion
 * This treats the date as a calendar date only, preserving the exact date from the string
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Feb 13, 2026")
 */
export function formatDateShortWithoutTimezone(dateString: string): string {
  try {
    const parts = dateString.split('-')
    if (parts.length !== 3) return dateString
    
    const [yearStr, monthStr, dayStr] = parts as [string, string, string]
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10)
    const day = parseInt(dayStr, 10)
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return dateString
    
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Format a date string to a short readable format
 * @param dateString - Date string in YYYY-MM-DD format or ISO format
 * @param timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns Formatted date string (e.g., "Feb 12, 2026")
 */
export function formatToLocalDateShort(dateString: string, timezone: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Format a timestamp to a readable date/time string
 * @param timestamp - ISO timestamp string or Date
 * @param timezone - IANA timezone string
 * @returns Formatted date/time (e.g., "Feb 12, 2026 at 3:45 PM")
 */
export function formatTimestamp(timestamp: string | Date, timezone: string): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return String(timestamp)
  }
}

/**
 * Format just the time from a timestamp
 * @param timestamp - ISO timestamp string or Date
 * @param timezone - IANA timezone string
 * @returns Formatted time (e.g., "3:45 PM")
 */
export function formatTimeOnly(timestamp: string | Date, timezone: string): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return ''
  }
}

/**
 * Get the browser's detected timezone
 * @returns IANA timezone string (e.g., 'America/New_York')
 */
export function getBrowserTimezone(): string {
  if (typeof window === 'undefined') return 'UTC'
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}
