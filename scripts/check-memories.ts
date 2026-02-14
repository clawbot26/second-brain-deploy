import { neon } from '@neondatabase/serverless';

async function listMemories() {
  const sql = neon(process.env.DATABASE_URL!);
  const memories = await sql`SELECT id, date, created_at FROM memories ORDER BY date DESC`;
  console.log('Memories in DB:');
  memories.forEach((m: any) => console.log(`ID: ${m.id}, Date: ${m.date}, Created: ${m.created_at}`));
}

listMemories().catch(console.error);
