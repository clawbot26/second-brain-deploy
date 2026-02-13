import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export interface Memory {
  id: number;
  date: string;
  content: string;
  category?: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}

export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS memories (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100),
      tags TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_memories_date ON memories(date DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category)
  `;
}

export async function getMemories() {
  const memories = await sql<Memory[]>`
    SELECT * FROM memories
    ORDER BY date DESC, created_at DESC
  `;
  return memories;
}

export async function getMemoryByDate(date: string) {
  const memories = await sql<Memory[]>`
    SELECT * FROM memories
    WHERE date = ${date}
    ORDER BY created_at DESC
  `;
  return memories[0];
}

export async function createMemory(date: string, content: string, category?: string, tags?: string[]) {
  const result = await sql<Memory[]>`
    INSERT INTO memories (date, content, category, tags)
    VALUES (${date}, ${content}, ${category || null}, ${tags || null})
    RETURNING *
  `;
  return result[0];
}

export async function updateMemory(date: string, content: string, category?: string, tags?: string[]) {
  const result = await sql<Memory[]>`
    UPDATE memories
    SET content = ${content},
        category = ${category || null},
        tags = ${tags || null},
        updated_at = CURRENT_TIMESTAMP
    WHERE date = ${date}
    RETURNING *
  `;
  
  if (result.length === 0) {
    return createMemory(date, content, category, tags);
  }
  
  return result[0];
}
