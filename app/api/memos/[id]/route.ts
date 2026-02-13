import { NextResponse, NextRequest } from 'next/server'
import { getMemoById, deleteMemo, updateMemo, DatabaseError } from '@/lib/db'
import { getErrorMessage } from '@/lib/utils'
import type { MemoAPIResponse } from '@/lib/types'

/**
 * DELETE /api/memos/:id
 *
 * Deletes a memo by id
 *
 * @param request - Next.js request object
 * @param params - Route parameters including id
 * @returns MemoAPIResponse with success message or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<MemoAPIResponse>> {
  try {
    const { id } = await params
    const memoId = parseInt(id, 10)

    if (isNaN(memoId) || memoId < 1) {
      return NextResponse.json(
        {
          error: 'Invalid memo id',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Check if memo exists first
    const memo = await getMemoById(memoId)
    if (!memo) {
      return NextResponse.json(
        {
          error: 'Memo not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Delete the memo
    await deleteMemo(memoId)

    return NextResponse.json(
      {
        memo,
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
      console.error(`API Error (${error.code}) - DELETE /api/memos/:id:`, error.message)
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
    console.error('API Error - DELETE /api/memos/:id:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to delete memo',
        code: 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/memos/:id
 *
 * Updates an existing memo
 *
 * Request body:
 * - content: string (required) - The memo content
 * - category: string (optional) - Category label
 * - tags: string[] (optional) - Array of tags
 *
 * @param request - Next.js request object
 * @param params - Route parameters including id
 * @returns MemoAPIResponse containing the updated memo or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<MemoAPIResponse>> {
  try {
    const { id } = await params
    const memoId = parseInt(id, 10)

    if (isNaN(memoId) || memoId < 1) {
      return NextResponse.json(
        {
          error: 'Invalid memo id',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

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

    // Update the memo
    const memo = await updateMemo(memoId, content, category, tags)

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
      console.error(`API Error (${error.code}) - PUT /api/memos/:id:`, error.message)
      const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'VALIDATION_ERROR' ? 400 : 500
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
    console.error('API Error - PUT /api/memos/:id:', errorMessage)

    return NextResponse.json(
      {
        error: 'Failed to update memo',
        code: 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
