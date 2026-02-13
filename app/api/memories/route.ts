import { NextResponse } from 'next/server'
import { getMemories } from '@/lib/db'

export async function GET() {
  try {
    const memoriesData = await getMemories();
    
    const memories = memoriesData.map(memory => ({
      date: memory.date,
      content: memory.content,
      category: memory.category,
      tags: memory.tags
    }));

    return NextResponse.json({ memories });
  } catch (error) {
    console.error('Error reading memories:', error);
    return NextResponse.json(
      { error: 'Failed to load memories' },
      { status: 500 }
    );
  }
}
