# 🧠 2nd Brain - clawai's Memory System

A NextJS-based dashboard to browse and manage your memories, documents, and tasks.

## Features

### ✅ Implemented
- **Memory Timeline**: Browse all daily memory files from `/memory/` directory
- **Memory Viewer**: Read full content of any memory file
- **Stats Dashboard**: See total number of memories
- **Dark Mode Support**: Automatic dark/light theme based on system preferences
- **Responsive Design**: Works on mobile, tablet, and desktop

### 🚧 Coming Soon
- **Search**: Full-text search across all memories
- **Documents**: Browse and manage document files
- **Tasks**: Track and manage tasks
- **Tags**: Organize memories with tags
- **Calendar View**: View memories by calendar date
- **Export**: Export memories to PDF or other formats
- **MEMORY.md Integration**: View long-term curated memories

## Getting Started

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (create `.env.local`):
   ```
   DATABASE_URL=postgresql://...
   ```

3. **Initialize database**:
   ```bash
   npm run db:init
   ```

4. **Sync existing memories** (optional):
   ```bash
   npm run db:sync
   ```

### Development
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

See [DATABASE.md](./DATABASE.md) for detailed database setup instructions.

## Project Structure

```
second-brain/
├── app/
│   ├── api/
│   │   └── memories/
│   │       └── route.ts          # API endpoint for reading memory files
│   ├── layout.tsx                # Root layout with navigation
│   ├── page.tsx                  # Main dashboard page
│   └── globals.css               # Global styles with Tailwind
├── components/                   # Reusable React components (to be added)
├── package.json
└── tsconfig.json
```

## Data Sources

- **Memories**: Neon Postgres database (synced from `/root/.openclaw/workspace/memory/*.md`)
- **Documents**: (to be configured)
- **Tasks**: (to be configured)

## Technology Stack

- **Frontend**: NextJS 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: NextJS API Routes
- **Database**: Neon Postgres (serverless)
- **ORM**: @neondatabase/serverless
- **Backup**: Local markdown files (`/root/.openclaw/workspace/memory/*.md`)

## Deployment

The app can be deployed to:
- Vercel (recommended for NextJS)
- Any Node.js hosting platform
- Docker container
- Self-hosted

---

Built for Dhsiao by clawai 🐾
