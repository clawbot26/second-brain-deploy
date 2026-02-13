import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: '2nd Brain - clawai',
  description: 'Your personal knowledge management system',
  viewport: 'width=device-width, initial-scale=1',
}

/**
 * Root Layout Component
 *
 * Provides the base HTML structure for the application
 * Includes navigation header, dark mode support, and timezone detection
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {/* Navigation Header */}
          <nav
            className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">
                    🧠
                  </span>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    2nd Brain
                  </h1>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  clawai&apos;s Memory System
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main role="main">{children}</main>

          {/* Footer */}
          <footer
            className="mt-12 py-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            role="contentinfo"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>
                Built with Next.js, TypeScript, and Tailwind CSS. Powered by Neon Postgres.
              </p>
            </div>
          </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
