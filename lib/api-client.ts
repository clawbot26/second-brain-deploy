/**
 * API client utilities for the 2nd Brain application
 * Handles automatic timezone header injection for timezone-aware API calls
 */

import { getTimezoneFromSession, getBrowserTimezone } from './timezone-context'

/**
 * Fetch options with timezone awareness
 */
interface FetchOptions extends RequestInit {
  includeTimezone?: boolean
}

/**
 * Custom fetch wrapper that automatically includes timezone header
 * @param url - API endpoint URL
 * @param options - Fetch options (includeTimezone defaults to true)
 * @returns Response object
 */
export async function apiFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { includeTimezone = true, headers = {}, ...restOptions } = options

  const requestHeaders = new Headers(headers)

  // Add timezone header if requested
  if (includeTimezone && typeof window !== 'undefined') {
    try {
      const timezone = getTimezoneFromSession()
      requestHeaders.set('X-Timezone', timezone)
    } catch {
      // If session storage is not available, try to get timezone directly
      try {
        const timezone = getBrowserTimezone()
        requestHeaders.set('X-Timezone', timezone)
      } catch {
        // Silently fail - timezone header is optional
      }
    }
  }

  return fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  })
}

/**
 * Generic API GET request with timezone support
 */
export async function apiGet<T>(url: string): Promise<T> {
  const response = await apiFetch(url, { method: 'GET' })
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Generic API POST request with timezone support
 */
export async function apiPost<T>(url: string, data: unknown): Promise<T> {
  const response = await apiFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}
