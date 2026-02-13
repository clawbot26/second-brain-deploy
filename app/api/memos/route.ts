import { NextResponse, NextRequest } from 'next/server'
import { getMemos, getMemosCount, createMemo, deleteMemo, updateMemo, DatabaseError } from '@/lib/db'
import { getErrorMessage } from '@/lib/utils'
import { PAGINATION } from '@/lib/constants'
import type { MemoAPIResponse } from '@/lib/types'

/**
 * GET /api/memos
 *
 * Retrieves all memos with optional pagination
 *
 * Query parameters:
 * - limit: Maximum number of results (default: 100, max: 500)
 * - offset: Number of results to skip (default: 0)
 *
 * @returns MemoAPIResponse containing array of memos or error
 */
export async function GET(request: NextRequest): Promise<NextResponse<MemoAPIResponse>> {
  try {
    // Extract and validate query parameters
    const searchParams = request.nextUrl.searchParams
    let limit = parseInt(searchParams.get('limit') ?? String(PAGINATION.DEFAULT_LIMIT), 10)
    let offset = parseInt(searchParams.get('offset') ?? String(PAGINATION.DEFAULT_OFFSET), 10)

    // Validate and clamp pagination parameters
    if (isNaN(limit) || limit < 1) limit = PAGINATION.DEFAULT_LIMIT
    if (isNaN(offset) || offset < 0) offset = PAGINATION.DEFAULT_OFFSET
    limit = Math.min(limit, PAGINATION.MAX_LIMIT)

    // Fetch memos and count in parallel
    const [memos, count] = await Promise.all([
      getMemos(limit, offset),
      getMemosCount(),
    ])

    // Transform memos for API response - ensure timestamps are ISO strings
    const transformedMemos = memos.map((memo) => ({
      ...memo,
      created_at: memo.created_at instanceof Date 
        ? memo.created_at.toISOString() 
        : String(memo.created_at),
      updated_at: memo.updated_at instanceof Date 
        ? memo.updated_at.toISOString() 
        : String(memo.updated_at),
    }))

    return NextResponse.json(
      {
        memos: transformedMemos,
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
      console.error(`API Error (${error.code}) - GET /api/memos:`, error.message)
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
    console.error('API Error - GET /api/memos:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to load memos',
        code: 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/memos
 *
 * Creates a new memo
 *
 * Request body:
 * - content: string (required) - The memo content
 * - category: string (optional) - Category label
 * - tags: string[] (optional) - Array of tags
 *
 * @returns MemoAPIResponse containing the created memo or error
 */
export async function POST(request: NextRequest): Promise<NextResponse<MemoAPIResponse>> {
  try {
    const body = await request.json()
    const { content, category, tags } = body

    // Validate required fields
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        {
          error: 'Content is required and must be a string',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Validate optional fields
    if (category !== undefined && category !== null && typeof category !== 'string') {
      return NextResponse.json(
        {
          error: 'Category must be a string',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    if (tags !== undefined && tags !== null && !Array.isArray(tags)) {
      return NextResponse.json(
        {
          error: 'Tags must be an array of strings',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Create the memo
    const memo = await createMemo(content, category, tags)

    // Transform response
    const transformedMemo = {
      ...memo,
      created_at: memo.created_at instanceof Date 
        ? memo.created_at.toISOString() 
        : String(memo.created_at),
      updated_at: memo.updated_at instanceof Date 
        ? memo.updated_at.toISOString() 
        : String(memo.updated_at),
    }

    return NextResponse.json(
      {
        memo: transformedMemo,
      },
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    // Handle known database errors
    if (error instanceof DatabaseError) {
      console.error(`API Error (${error.code}) - POST /api/memos:`, error.message)
      const status = error.code === 'VALIDATION_ERROR' ? 400 : 500
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: process.env.NODE_ENV === 'development' ? error.originalError : undefined,
        },
        { status }
      )
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON',
        },
        { status: 400 }
      )
    }

    // Handle unknown errors
    const errorMessage = getErrorMessage(error)
    console.error('API Error - POST /api/memos:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to create memo',
        code: 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
