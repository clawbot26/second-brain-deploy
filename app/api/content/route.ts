import { NextRequest, NextResponse } from "next/server";
import {
  getContentItems,
  getContentItemsCount,
  createContentItem,
  initDatabase,
} from "@/lib/db";
import type { ContentType, ContentCategory } from "@/lib/types";

/**
 * GET /api/content
 * List content items with optional filtering, pagination, and search
 */
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initDatabase();

    const searchParams = request.nextUrl.searchParams;

    // Parse filter parameters
    const search = searchParams.get("search") || undefined;
    const content_type = searchParams.get("content_type") as ContentType | null;
    const category = searchParams.get("category") as ContentCategory | null;
    const is_read = searchParams.get("is_read");
    const is_archived = searchParams.get("is_archived");

    // Parse pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Build filter options
    const filters = {
      search,
      content_type: content_type || undefined,
      category: category || undefined,
      is_read: is_read !== null ? is_read === "true" : undefined,
      is_archived: is_archived !== null ? is_archived === "true" : false, // Default to not archived
    };

    // Get items and count
    const [items, total] = await Promise.all([
      getContentItems(filters, limit, offset),
      getContentItemsCount(filters),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: items,
        count: items.length,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/content] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch content items",
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
 * POST /api/content
 * Create a new content item
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initDatabase();

    const body = await request.json();

    // Validate required fields
    if (!body.url || !body.url.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "URL is required",
        },
        { status: 400 }
      );
    }

    // Validate URL format (allow #note for notes)
    if (body.url !== "#note") {
      try {
        new URL(body.url);
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid URL format",
          },
          { status: 400 }
        );
      }
    }

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        { status: 400 }
      );
    }

    // Validate content_type
    const validTypes = ["article", "youtube", "note"];
    if (body.content_type && !validTypes.includes(body.content_type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content type. Must be: article, youtube, or note",
        },
        { status: 400 }
      );
    }

    // Validate category
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
    if (body.category && !validCategories.includes(body.category)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid category",
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const input = {
      url: body.url.trim(),
      title: sanitizeInput(body.title.trim(), 200)!,
      summary: sanitizeInput(body.summary, 1000),
      key_points: Array.isArray(body.key_points)
        ? body.key_points.slice(0, 10).map((p: string) => sanitizeInput(p, 300)).filter(Boolean) as string[]
        : [],
      content_type: (body.content_type || "article") as ContentType,
      category: (body.category || "other") as ContentCategory,
      tags: Array.isArray(body.tags)
        ? body.tags.slice(0, 10).map((t: string) => sanitizeInput(t, 50)).filter(Boolean) as string[]
        : [],
      source_name: sanitizeInput(body.source_name, 100),
      author: sanitizeInput(body.author, 100),
      thumbnail_url: body.thumbnail_url,
      duration: sanitizeInput(body.duration, 20),
      published_date: sanitizeInput(body.published_date, 50),
    };

    const contentItem = await createContentItem(input);

    return NextResponse.json(
      {
        success: true,
        data: contentItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/content] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create content item";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
