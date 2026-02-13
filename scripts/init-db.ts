#!/usr/bin/env tsx
/**
 * Database Initialization Script
 *
 * Creates the necessary tables and indexes in the database.
 * Run this once before using the application.
 *
 * Usage: npm run db:init
 */

import { initDatabase } from '../lib/db'

async function main() {
  console.log('🔧 Initializing database...')

  try {
    await initDatabase()
    console.log('✅ Database initialized successfully!')
    console.log('📋 Tables and indexes created.')
    process.exit(0)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ Error initializing database:', errorMessage)
    
    if (process.env.DEBUG) {
      console.error('Full error:', error)
    }
    
    process.exit(1)
  }
}

main()
