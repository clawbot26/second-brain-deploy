import { NextRequest, NextResponse } from "next/server";
import {
  getContentItemById,
  updateContentItem,
  deleteContentItem,
  archiveContentItem,
  initDatabase,
} from "@/lib/db";
import type { ContentCategory } from "@/lib/types";

/**
 * GET /api/content/:id
 * Get a single content item by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database is initialized
    await initDatabase();

    const { id } = await params;
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content item ID",
        },
        { status: 400 }
      );
    }

    const item = await getContentItemById(itemId);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Content item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/content/:id] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch content item",
      },
      { status: 500 }
    );
  }
}

/**
 * Sanitizes user input to prevent XSS attacks
 */
function sanitizeInput(input: string | undefined, maxLength: number = 500): string | undefined {
  if (!input) return undefined;
  const clean = input.replace(/<[^>]*>/g, "");
  return clean.slice(0, maxLength);
}

/**
 * PUT /api/content/:id
 * Update a content item
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database is initialized
    await initDatabase();

    const { id } = await params;
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content item ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if item exists
    const existingItem = await getContentItemById(itemId);
    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Content item not found",
        },
        { status: 404 }
      );
    }

    const updates: {
      title?: string;
      summary?: string;
      key_points?: string[];
      category?: ContentCategory;
      tags?: string[];
      is_read?: boolean;
      is_archived?: boolean;
    } = {};

    // Validate and sanitize inputs
    if (body.title !== undefined) {
      const title = body.title.trim();
      if (title.length > 200) {
        return NextResponse.json(
          {
            success: false,
            error: "Title must be less than 200 characters",
          },
          { status: 400 }
        );
      }
      updates.title = sanitizeInput(title, 200);
    }

    if (body.summary !== undefined) {
      updates.summary = sanitizeInput(body.summary, 1000);
    }

    if (body.key_points !== undefined) {
      if (!Array.isArray(body.key_points)) {
        return NextResponse.json(
          {
            success: false,
            error: "key_points must be an array",
          },
          { status: 400 }
        );
      }
      updates.key_points = body.key_points
        .slice(0, 10)
        .map((p: string) => sanitizeInput(p, 300))
        .filter(Boolean) as string[];
    }

    if (body.category !== undefined) {
      const validCategories = [
        "tech",
        "business",
        "science",
        "design",
        "health",
        "finance",
        "productivity",
        "other",
      ];
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid category",
          },
          { status: 400 }
        );
      }
      updates.category = body.category as ContentCategory;
    }

    if (body.tags !== undefined) {
      if (!Array.isArray(body.tags)) {
        return NextResponse.json(
          {
            success: false,
            error: "tags must be an array",
          },
          { status: 400 }
        );
      }
      updates.tags = body.tags
        .slice(0, 10)
        .map((t: string) => sanitizeInput(t, 50))
        .filter(Boolean) as string[];
    }

    if (body.is_read !== undefined) {
      updates.is_read = Boolean(body.is_read);
    }

    if (body.is_archived !== undefined) {
      updates.is_archived = Boolean(body.is_archived);
    }

    const updatedItem = await updateContentItem(itemId, updates);

    return NextResponse.json(
      {
        success: true,
        data: updatedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PUT /api/content/:id] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update content item";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/content/:id
 * Delete or archive a content item
 * Query param: ?archive=true to archive instead of delete
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database is initialized
    await initDatabase();

    const { id } = await params;
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content item ID",
        },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const archive = searchParams.get("archive") === "true";

    // Check if item exists
    const existingItem = await getContentItemById(itemId);
    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Content item not found",
        },
        { status: 404 }
      );
    }

    if (archive) {
      // Soft delete (archive)
      const archived = await archiveContentItem(itemId);

      return NextResponse.json(
        {
          success: true,
          message: "Content item archived successfully",
          data: archived,
        },
        { status: 200 }
      );
    } else {
      // Permanent delete
      await deleteContentItem(itemId);

      return NextResponse.json(
        {
          success: true,
          message: "Content item deleted successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("[DELETE /api/content/:id] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete content item";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
