'use client'

import { ReactNode } from 'react'
import { TimezoneProvider } from '@/lib/timezone-context'

/**
 * Client-side providers wrapper
 * Wraps application with necessary context providers
 */
export function Providers({ children }: { children: ReactNode }) {
  return <TimezoneProvider>{children}</TimezoneProvider>
}
