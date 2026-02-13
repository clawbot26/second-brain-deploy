import { NextResponse, NextRequest } from 'next/server'
import { getMemories, getMemoriesCount } from '@/lib/db'
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
    let limit = parseInt(searchParams.get('limit') ?? '100', 10)
    let offset = parseInt(searchParams.get('offset') ?? '0', 10)

    // Validate and clamp pagination parameters
    if (isNaN(limit) || limit < 1) limit = 100
    if (isNaN(offset) || offset < 0) offset = 0
    if (limit > 500) limit = 500

    // Fetch memories and count
    const [memories, count] = await Promise.all([
      getMemories(limit, offset),
      getMemoriesCount(),
    ])

    // Transform memories for API response
    const transformedMemories = memories.map((memory) => ({
      ...memory,
      created_at: memory.created_at instanceof Date 
        ? memory.created_at.toISOString() 
        : memory.created_at,
      updated_at: memory.updated_at instanceof Date 
        ? memory.updated_at.toISOString() 
        : memory.updated_at,
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('API Error - GET /api/memories:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to load memories',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
