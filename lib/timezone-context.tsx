'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getBrowserTimezone } from './utils'

interface TimezoneContextType {
  timezone: string
  isLoaded: boolean
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined)

/**
 * Provider component for timezone context
 * Detects browser timezone and makes it available to all child components
 */
export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [timezone, setTimezone] = useState<string>('UTC')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Detect timezone on client mount
    const detectedTimezone = getBrowserTimezone()
    setTimezone(detectedTimezone)
    
    // Send timezone to server via header for future API calls
    sessionStorage.setItem('user-timezone', detectedTimezone)
    
    setIsLoaded(true)
  }, [])

  return (
    <TimezoneContext.Provider value={{ timezone, isLoaded }}>
      {children}
    </TimezoneContext.Provider>
  )
}

/**
 * Hook to access timezone context
 * @throws Error if used outside TimezoneProvider
 */
export function useTimezone(): TimezoneContextType {
  const context = useContext(TimezoneContext)
  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider')
  }
  return context
}

/**
 * Get timezone from session storage (useful for API calls before context is available)
 */
export function getTimezoneFromSession(): string {
  if (typeof window === 'undefined') return 'UTC'
  return sessionStorage.getItem('user-timezone') || getBrowserTimezone()
}
