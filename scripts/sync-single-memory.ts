#!/usr/bin/env tsx

import { readFile } from 'fs/promises'
import { join } from 'path'
import { updateMemory } from '../lib/db'

const MEMORY_DIR = '/root/.openclaw/workspace/memory'

/**
 * Sync a single memory file to the database
 * Usage: npm run db:sync-one 2024-01-15
 */
async function main() {
  const date = process.argv[2]

  if (!date) {
    console.error('❌ Usage: tsx sync-single-memory.ts YYYY-MM-DD')
    process.exit(1)
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('❌ Invalid date format. Use YYYY-MM-DD')
    process.exit(1)
  }

  try {
    const filePath = join(MEMORY_DIR, `${date}.md`)
    console.log(`📖 Reading memory file: ${filePath}`)
    const content = await readFile(filePath, 'utf-8')

    console.log(`🔄 Syncing memory for ${date}...`)
    const memory = await updateMemory(date, content)
    console.log(`✅ Memory synced successfully!`)
    console.log(`   ID: ${memory.id}`)
    console.log(`   Date: ${memory.date}`)
    console.log(`   Content length: ${memory.content.length} characters`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`❌ Error syncing memory: ${errorMessage}`)
    process.exit(1)
  }
}

main()
