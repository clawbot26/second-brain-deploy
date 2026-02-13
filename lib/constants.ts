/**
 * Application constants and configuration
 */

export const PAGINATION = {
  DEFAULT_LIMIT: 100,
  MAX_LIMIT: 500,
  DEFAULT_OFFSET: 0,
} as const

export const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/

export const MEMORY_STATS = {
  CHARS_PER_MIN_READ: 100,
} as const

export const UI = {
  MAX_HEIGHT_MEMORY_LIST: 600,
  ANIMATION_DURATION: 200,
} as const
