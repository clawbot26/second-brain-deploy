import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { updateMemory } from '../lib/db';

const MEMORY_DIR = '/root/.openclaw/workspace/memory';

async function main() {
  console.log('Syncing memory files to database...');
  
  try {
    const files = await readdir(MEMORY_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`Found ${mdFiles.length} memory files`);
    
    for (const file of mdFiles) {
      const date = file.replace('.md', '');
      const filePath = join(MEMORY_DIR, file);
      const content = await readFile(filePath, 'utf-8');
      
      console.log(`Syncing ${date}...`);
      await updateMemory(date, content);
    }
    
    console.log('✅ All memories synced successfully!');
  } catch (error) {
    console.error('❌ Error syncing memories:', error);
    process.exit(1);
  }
}

main();
