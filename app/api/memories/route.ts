import { NextResponse, NextRequest } from 'next/server'
import { getMemories, getMemoriesCount, DatabaseError } from '@/lib/db'
import { getErrorMessage } from '@/lib/utils'
import { PAGINATION } from '@/lib/constants'
import type { MemoryAPIResponse } from '@/lib/types'

/**
 * GET /api/memories
 *
 * Retrieves all memories with optional pagination
 *
 * Query parameters:
 * - limit: Maximum number of results (default: 100, max: 500)
 * - offset: Number of results to skip (default: 0)
 *
 * @returns MemoryAPIResponse containing array of memories or error
 */
export async function GET(request: NextRequest): Promise<NextResponse<MemoryAPIResponse>> {
  try {
    // Extract and validate query parameters
    const searchParams = request.nextUrl.searchParams
    let limit = parseInt(searchParams.get('limit') ?? String(PAGINATION.DEFAULT_LIMIT), 10)
    let offset = parseInt(searchParams.get('offset') ?? String(PAGINATION.DEFAULT_OFFSET), 10)

    // Validate and clamp pagination parameters
    if (isNaN(limit) || limit < 1) limit = PAGINATION.DEFAULT_LIMIT
    if (isNaN(offset) || offset < 0) offset = PAGINATION.DEFAULT_OFFSET
    limit = Math.min(limit, PAGINATION.MAX_LIMIT)

    // Fetch memories and count in parallel
    const [memories, count] = await Promise.all([
      getMemories(limit, offset),
      getMemoriesCount(),
    ])

    // Transform memories for API response - ensure dates are ISO strings
    const transformedMemories = memories.map((memory) => ({
      ...memory,
      created_at: memory.created_at instanceof Date 
        ? memory.created_at.toISOString() 
        : String(memory.created_at),
      updated_at: memory.updated_at instanceof Date 
        ? memory.updated_at.toISOString() 
        : String(memory.updated_at),
    }))

    return NextResponse.json(
      {
        memories: transformedMemories,
        count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    // Handle known database errors
    if (error instanceof DatabaseError) {
      console.error(`API Error (${error.code}) - GET /api/memories:`, error.message)
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: process.env.NODE_ENV === 'development' ? error.originalError : undefined,
        },
        { status: 500 }
      )
    }

    // Handle unknown errors
    const errorMessage = getErrorMessage(error)
    console.error('API Error - GET /api/memories:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to load memories',
        code: 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
