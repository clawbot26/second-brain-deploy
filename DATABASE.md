# Database Integration

This app uses Neon Postgres (serverless) to store memories.

## Setup

1. **Create Neon database** via Vercel dashboard
2. **Add environment variables** to `.env.local`:
   ```
   DATABASE_URL=postgresql://...
   ```

3. **Initialize database** (creates tables):
   ```bash
   npm run db:init
   ```

4. **Sync existing memories** from filesystem:
   ```bash
   npm run db:sync
   ```

## Schema

```sql
CREATE TABLE memories (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Workflow

### Writing Memories
The AI agent writes to both:
1. Local files: `/root/.openclaw/workspace/memory/YYYY-MM-DD.md` (backup)
2. Database: via API calls after file updates

### Reading Memories
The dashboard reads from the database for real-time updates.

## Scripts

- `npm run db:init` - Initialize database tables
- `npm run db:sync` - Sync local memory files to database
- `npm run dev` - Start development server

## API Endpoints

### GET /api/memories
Returns all memories from database, sorted by date (newest first).

Response:
```json
{
  "memories": [
    {
      "date": "2026-02-12",
      "content": "# 2026-02-12\n\n...",
      "category": null,
      "tags": null
    }
  ]
}
```
