#!/usr/bin/env tsx
/**
 * Memory Sync Script
 *
 * Syncs all memory files from the filesystem to the database.
 * Reads markdown files from /root/.openclaw/workspace/memory/ and stores them in Postgres.
 *
 * Usage: npm run db:sync
 * With debug output: DEBUG=true npm run db:sync
 */

import { readdir, readFile } from 'fs/promises'
import { join, basename } from 'path'
import { updateMemory } from '../lib/db'

const MEMORY_DIR = '/root/.openclaw/workspace/memory'
const DEBUG = process.env.DEBUG === 'true'

/**
 * Extract date from filename (YYYY-MM-DD.md format)
 */
function extractDateFromFilename(filename: string): string | null {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})\.md$/)
  return match ? match[1] : null
}

async function main() {
  console.log('📚 Syncing memory files to database...')
  console.log(`📂 Reading from: ${MEMORY_DIR}`)

  try {
    const files = await readdir(MEMORY_DIR)
    const mdFiles = files.filter((f) => f.endsWith('.md') && f !== 'MEMORY.md')

    if (mdFiles.length === 0) {
      console.log('ℹ️  No memory files found.')
      process.exit(0)
    }

    console.log(`✓ Found ${mdFiles.length} memory files\n`)

    let successCount = 0
    let skipCount = 0
    const errors: Array<{ file: string; error: string }> = []

    for (const file of mdFiles) {
      const date = extractDateFromFilename(file)

      if (!date) {
        console.warn(`⚠️  Skipped ${file} (invalid filename format, expected YYYY-MM-DD.md)`)
        skipCount++
        continue
      }

      try {
        const filePath = join(MEMORY_DIR, file)
        const content = await readFile(filePath, 'utf-8')

        if (DEBUG) {
          console.log(`  Syncing ${date}... (${content.length} bytes)`)
        } else {
          process.stdout.write('.')
        }

        await updateMemory(date, content)
        successCount++
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`\n❌ Error syncing ${file}: ${errorMessage}`)
        errors.push({ file, error: errorMessage })
      }
    }

    console.log('\n')
    console.log(`✅ Sync complete:`)
    console.log(`   ✓ Successfully synced: ${successCount}`)
    if (skipCount > 0) console.log(`   ⊘ Skipped: ${skipCount}`)
    if (errors.length > 0) console.log(`   ✗ Errors: ${errors.length}`)

    if (errors.length > 0) {
      console.log('\n⚠️  Errors encountered:')
      errors.forEach(({ file, error }) => {
        console.log(`   - ${file}: ${error}`)
      })
      process.exit(1)
    }

    process.exit(0)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`\n❌ Error reading memory directory: ${errorMessage}`)

    if (DEBUG) {
      console.error('Full error:', error)
    }

    process.exit(1)
  }
}

main()
