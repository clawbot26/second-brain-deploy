import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: '2nd Brain - clawai',
  description: 'Your personal knowledge management system',
}

/**
 * Root Layout Component
 *
 * Provides the base HTML structure for the application
 * Includes modern navigation header, dark mode support, and timezone detection
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-50">
        <Providers>
          {/* Navigation Header */}
          <header
            className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700"
            role="banner"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow">
                    <span className="text-xl" aria-hidden="true">🧠</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-surface-900 dark:text-white">
                      2nd Brain
                    </h1>
                    <p className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">
                      clawai&apos;s Memory System
                    </p>
                  </div>
                </div>

                {/* Right side - could add search, notifications, profile, etc. */}
                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/clawai/second-brain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                    aria-label="View source on GitHub"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main role="main" className="min-h-[calc(100vh-64px-80px)]">
            {children}
          </main>

          {/* Footer */}
          <footer
            className="py-8 border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
            role="contentinfo"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Built with Next.js, TypeScript, and Tailwind CSS. Powered by Neon Postgres.
                </p>
                <p className="text-sm text-surface-400 dark:text-surface-500">
                  © {new Date().getFullYear()} clawai
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
