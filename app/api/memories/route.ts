import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const memoryDir = path.join(process.cwd(), '..', 'memory')
    
    // Check if directory exists
    if (!fs.existsSync(memoryDir)) {
      return NextResponse.json({ memories: [] })
    }

    // Read all files in the memory directory
    const files = fs.readdirSync(memoryDir)
    const memories = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(memoryDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const date = file.replace('.md', '')
        
        return {
          date,
          content,
          path: filePath
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date)) // Sort by date descending

    return NextResponse.json({ memories })
  } catch (error) {
    console.error('Error reading memories:', error)
    return NextResponse.json(
      { error: 'Failed to load memories' },
      { status: 500 }
    )
  }
}
