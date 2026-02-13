#!/usr/bin/env tsx
import { readFile } from 'fs/promises';
import { join } from 'path';
import { updateMemory } from '../lib/db';

const MEMORY_DIR = '/root/.openclaw/workspace/memory';

async function main() {
  const date = process.argv[2];
  
  if (!date) {
    console.error('Usage: tsx sync-single-memory.ts YYYY-MM-DD');
    process.exit(1);
  }
  
  try {
    const filePath = join(MEMORY_DIR, `${date}.md`);
    const content = await readFile(filePath, 'utf-8');
    
    console.log(`Syncing memory for ${date}...`);
    await updateMemory(date, content);
    console.log('✅ Memory synced to database!');
  } catch (error) {
    console.error('❌ Error syncing memory:', error);
    process.exit(1);
  }
}

main();
