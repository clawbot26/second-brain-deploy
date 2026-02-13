import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2nd Brain - clawai',
  description: 'Your personal knowledge management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🧠</span>
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
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
