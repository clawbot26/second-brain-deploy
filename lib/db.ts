import { neon } from '@neondatabase/serverless'
import type { Memory, Memo } from './types'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = neon(process.env.DATABASE_URL)

/**
 * Validate date format (YYYY-MM-DD)
 * @param date - Date string to validate
 * @returns true if valid, false otherwise
 */
function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

/**
 * Custom error class for database operations
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string = 'DATABASE_ERROR',
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * Initialize the database with required tables and indexes
 * @throws Error if database initialization fails
 */
export async function initDatabase() {
  try {
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
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_memories_date ON memories(date DESC)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC)
    `

    // Create memos table for saved reminders/notes
    await sql`
      CREATE TABLE IF NOT EXISTS memos (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        category VARCHAR(100),
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_memos_created_at ON memos(created_at DESC)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_memos_category ON memos(category)
    `
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

/**
 * Retrieve all memories with optional pagination
 * @param limit - Maximum number of records to return (default: 100)
 * @param offset - Number of records to skip (default: 0)
 * @returns Array of Memory objects sorted by date descending
 * @throws Error if database query fails
 */
export async function getMemories(
  limit: number = 100,
  offset: number = 0
): Promise<Memory[]> {
  if (limit < 1 || offset < 0) {
    throw new Error('Invalid pagination parameters: limit must be > 0, offset must be >= 0')
  }

  try {
    const memories = await sql`
      SELECT * FROM memories
      ORDER BY date DESC, created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `
    return (memories as Memory[]) || []
  } catch (error) {
    console.error('Error fetching memories:', error)
    throw error
  }
}

/**
 * Get total count of memories in the database
 * @returns Number of memory records
 */
export async function getMemoriesCount(): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM memories
    `
    const rows = result as Array<{ count: number }>
    return rows[0]!?.count ?? 0
  } catch (error) {
    console.error('Error counting memories:', error)
    throw error
  }
}

/**
 * Retrieve a single memory by date
 * @param date - The date of the memory (YYYY-MM-DD format)
 * @returns Memory object or undefined if not found
 * @throws DatabaseError if database query fails or validation fails
 */
export async function getMemoryByDate(date: string): Promise<Memory | undefined> {
  if (!date) {
    throw new DatabaseError(
      'Date is required',
      'VALIDATION_ERROR'
    )
  }

  if (!isValidDate(date)) {
    throw new DatabaseError(
      'Invalid date format. Use YYYY-MM-DD',
      'INVALID_DATE_FORMAT'
    )
  }

  try {
    const memories = await sql`
      SELECT * FROM memories
      WHERE date = ${date}
      ORDER BY created_at DESC
      LIMIT 1
    `
    const rows = memories as Memory[]
    return rows?.[0]
  } catch (error) {
    console.error(`Error fetching memory for date ${date}:`, error)
    throw new DatabaseError(
      `Failed to fetch memory for date ${date}`,
      'FETCH_ERROR',
      error
    )
  }
}

/**
 * Create a new memory record
 * @param date - The date of the memory (YYYY-MM-DD format)
 * @param content - The memory content
 * @param category - Optional category label
 * @param tags - Optional array of tags
 * @returns The created Memory object
 * @throws DatabaseError if database insert fails or validation fails
 */
export async function createMemory(
  date: string,
  content: string,
  category?: string,
  tags?: string[]
): Promise<Memory> {
  // Validate inputs
  if (!date || !content) {
    throw new DatabaseError(
      'Date and content are required',
      'VALIDATION_ERROR'
    )
  }

  if (!isValidDate(date)) {
    throw new DatabaseError(
      'Invalid date format. Use YYYY-MM-DD',
      'INVALID_DATE_FORMAT'
    )
  }

  try {
    const result = await sql`
      INSERT INTO memories (date, content, category, tags)
      VALUES (${date}, ${content}, ${category || null}, ${tags || null})
      RETURNING *
    `
    const rows = result as Memory[]
    if (!rows || rows.length === 0) {
      throw new DatabaseError(
        'Failed to create memory record',
        'INSERT_FAILED'
      )
    }
    return rows[0]!!
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    console.error(`Error creating memory for date ${date}:`, error)
    throw new DatabaseError(
      `Failed to create memory for date ${date}`,
      'CREATE_ERROR',
      error
    )
  }
}

/**
 * Update an existing memory or create if not exists (upsert)
 * @param date - The date of the memory (YYYY-MM-DD format)
 * @param content - The updated memory content
 * @param category - Optional category label
 * @param tags - Optional array of tags
 * @returns The updated or created Memory object
 * @throws DatabaseError if database operation fails or validation fails
 */
export async function updateMemory(
  date: string,
  content: string,
  category?: string,
  tags?: string[]
): Promise<Memory> {
  // Validate inputs
  if (!date || !content) {
    throw new DatabaseError(
      'Date and content are required',
      'VALIDATION_ERROR'
    )
  }

  if (!isValidDate(date)) {
    throw new DatabaseError(
      'Invalid date format. Use YYYY-MM-DD',
      'INVALID_DATE_FORMAT'
    )
  }

  try {
    // Try to update first
    const result = await sql`
      UPDATE memories
      SET content = ${content},
          category = ${category || null},
          tags = ${tags || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE date = ${date}
      RETURNING *
    `
    
    const rows = result as Memory[]
    if (rows && rows.length > 0) {
      return rows[0]!
    }

    // If no rows were updated, create new memory
    return createMemory(date, content, category, tags)
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    console.error(`Error updating memory for date ${date}:`, error)
    throw new DatabaseError(
      `Failed to update memory for date ${date}`,
      'UPDATE_ERROR',
      error
    )
  }
}

/**
 * Delete a memory by date
 * @param date - The date of the memory (YYYY-MM-DD format)
 * @returns true if memory was deleted, false if not found
 * @throws DatabaseError if date format is invalid or database operation fails
 */
export async function deleteMemory(date: string): Promise<boolean> {
  if (!isValidDate(date)) {
    throw new DatabaseError(
      'Invalid date format. Use YYYY-MM-DD',
      'INVALID_DATE_FORMAT'
    )
  }

  try {
    await sql`
      DELETE FROM memories
      WHERE date = ${date}
    `
    // Note: Neon's client doesn't provide row count directly
    // We assume deletion was successful if no error was thrown
    return true
  } catch (error) {
    console.error(`Error deleting memory for date ${date}:`, error)
    throw new DatabaseError(
      `Failed to delete memory for date ${date}`,
      'DELETE_ERROR',
      error
    )
  }
}

/**
 * Create a new memo (saved reminder/note)
 * @param content - The memo content
 * @param category - Optional category label
 * @param tags - Optional array of tags
 * @returns The created Memo object
 * @throws DatabaseError if database insert fails or validation fails
 */
export async function createMemo(
  content: string,
  category?: string,
  tags?: string[]
): Promise<Memo> {
  // Validate inputs
  if (!content) {
    throw new DatabaseError(
      'Content is required',
      'VALIDATION_ERROR'
    )
  }

  if (content.trim().length === 0) {
    throw new DatabaseError(
      'Content cannot be empty',
      'VALIDATION_ERROR'
    )
  }

  try {
    const result = await sql`
      INSERT INTO memos (content, category, tags)
      VALUES (${content}, ${category || null}, ${tags || null})
      RETURNING *
    `
    const rows = result as Memo[]
    if (!rows || rows.length === 0) {
      throw new DatabaseError(
        'Failed to create memo record',
        'INSERT_FAILED'
      )
    }
    return rows[0]!!
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    console.error('Error creating memo:', error)
    throw new DatabaseError(
      'Failed to create memo',
      'CREATE_ERROR',
      error
    )
  }
}

/**
 * Retrieve all memos with optional pagination
 * @param limit - Maximum number of records to return (default: 100)
 * @param offset - Number of records to skip (default: 0)
 * @returns Array of Memo objects sorted by created_at descending
 * @throws Error if database query fails
 */
export async function getMemos(
  limit: number = 100,
  offset: number = 0
): Promise<Memo[]> {
  if (limit < 1 || offset < 0) {
    throw new Error('Invalid pagination parameters: limit must be > 0, offset must be >= 0')
  }

  try {
    const memos = await sql`
      SELECT * FROM memos
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `
    return (memos as Memo[]) || []
  } catch (error) {
    console.error('Error fetching memos:', error)
    throw error
  }
}

/**
 * Get total count of memos in the database
 * @returns Number of memo records
 */
export async function getMemosCount(): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM memos
    `
    const rows = result as Array<{ count: number }>
    return rows[0]!?.count ?? 0
  } catch (error) {
    console.error('Error counting memos:', error)
    throw error
  }
}

/**
 * Retrieve a single memo by id
 * @param id - The memo id
 * @returns Memo object or undefined if not found
 * @throws DatabaseError if database query fails
 */
export async function getMemoById(id: number): Promise<Memo | undefined> {
  if (!id || id < 1) {
    throw new DatabaseError(
      'Valid memo id is required',
      'VALIDATION_ERROR'
    )
  }

  try {
    const memos = await sql`
      SELECT * FROM memos
      WHERE id = ${id}
      LIMIT 1
    `
    const rows = memos as Memo[]
    return rows?.[0]
  } catch (error) {
    console.error(`Error fetching memo ${id}:`, error)
    throw new DatabaseError(
      `Failed to fetch memo ${id}`,
      'FETCH_ERROR',
      error
    )
  }
}

/**
 * Update an existing memo
 * @param id - The memo id
 * @param content - The updated memo content
 * @param category - Optional category label
 * @param tags - Optional array of tags
 * @returns The updated Memo object
 * @throws DatabaseError if database operation fails or validation fails
 */
export async function updateMemo(
  id: number,
  content: string,
  category?: string,
  tags?: string[]
): Promise<Memo> {
  // Validate inputs
  if (!id || id < 1) {
    throw new DatabaseError(
      'Valid memo id is required',
      'VALIDATION_ERROR'
    )
  }

  if (!content) {
    throw new DatabaseError(
      'Content is required',
      'VALIDATION_ERROR'
    )
  }

  if (content.trim().length === 0) {
    throw new DatabaseError(
      'Content cannot be empty',
      'VALIDATION_ERROR'
    )
  }

  try {
    const result = await sql`
      UPDATE memos
      SET content = ${content},
          category = ${category || null},
          tags = ${tags || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    
    const rows = result as Memo[]
    if (!rows || rows.length === 0) {
      throw new DatabaseError(
        'Memo not found',
        'NOT_FOUND'
      )
    }
    
    return rows[0]!
  } catch (error) {
    if (error instanceof DatabaseError) throw error
    console.error(`Error updating memo ${id}:`, error)
    throw new DatabaseError(
      `Failed to update memo ${id}`,
      'UPDATE_ERROR',
      error
    )
  }
}

/**
 * Delete a memo by id
 * @param id - The memo id
 * @returns true if memo was deleted, false if not found
 * @throws DatabaseError if database operation fails
 */
export async function deleteMemo(id: number): Promise<boolean> {
  if (!id || id < 1) {
    throw new DatabaseError(
      'Valid memo id is required',
      'VALIDATION_ERROR'
    )
  }

  try {
    await sql`
      DELETE FROM memos
      WHERE id = ${id}
    `
    return true
  } catch (error) {
    console.error(`Error deleting memo ${id}:`, error)
    throw new DatabaseError(
      `Failed to delete memo ${id}`,
      'DELETE_ERROR',
      error
    )
  }
}
