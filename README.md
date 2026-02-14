# 🧠 2nd Brain - clawai's Memory System

A modern Next.js-based dashboard for managing memories, memos, and (soon) documents and tasks.

![2nd Brain Dashboard](https://claw-kanban-lovat.vercel.app/second-brain.png)

## ✨ Features

### ✅ Implemented

#### Core Features
- **📚 Memory Timeline**: Browse daily memory files from database with category and tag support
- **📝 Memory Viewer**: Read full memory content with statistics (lines, words, reading time)
- **📌 Memos**: Quick note-taking with categories, tags, and full CRUD operations
- **🎨 Modern UI**: Clean, professional design with smooth animations
- **🌓 Dark Mode**: Automatic dark/light theme with system preference detection
- **📱 Responsive**: Works seamlessly on mobile, tablet, and desktop
- **♿ Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

#### Technical Features
- **⚡ Fast**: Optimized with React.memo, skeleton loading states
- **🔒 Type-Safe**: Full TypeScript with strict mode
- **🔄 Real-time**: Instant updates when creating/editing/deleting memos
- **🗄️ Database**: Neon Postgres with proper indexing
- **🌍 Timezone-Aware**: Automatic timezone detection and formatting

### 🚧 Coming Soon
- **🔍 Search**: Full-text search across memories and memos
- **📄 Documents**: Browse and manage document files
- **✅ Tasks**: Track and manage tasks with due dates
- **📅 Calendar View**: View memories by calendar date
- **📤 Export**: Export to PDF/Markdown
- **🔗 MEMORY.md Integration**: View long-term curated memories

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon recommended)

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (create `.env.local`):
   ```
   DATABASE_URL=postgresql://user:password@host/database
   ```

3. **Initialize database**:
   ```bash
   npm run db:init
   ```

4. **Sync existing memories** (optional):
   ```bash
   npm run db:sync
   # Or with debug output:
   DEBUG=true npm run db:sync
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

## 🏗️ Project Structure

```
second-brain/
├── app/
│   ├── api/                    # API routes
│   │   ├── memories/route.ts   # Memory CRUD API
│   │   └── memos/              # Memo CRUD API
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Main dashboard with tabs
│   ├── globals.css             # Global styles with Tailwind
│   └── providers.tsx           # Context providers
├── components/
│   ├── ui/                     # UI primitives
│   │   ├── Button.tsx          # Versatile button component
│   │   ├── Card.tsx            # Card container
│   │   ├── Badge.tsx           # Status badges
│   │   ├── Skeleton.tsx        # Loading skeletons
│   │   ├── EmptyState.tsx      # Empty state component
│   │   └── TabNavigation.tsx   # Tab navigation
│   ├── StatCard.tsx            # Dashboard stat cards
│   ├── MemoryList.tsx          # Memory timeline list
│   ├── MemoryListItem.tsx      # Individual memory item
│   ├── MemoryViewer.tsx        # Memory content viewer
│   ├── MemoList.tsx            # Saved memos list
│   ├── MemoViewer.tsx          # Memo content viewer with edit
│   ├── SaveMemoForm.tsx        # Quick memo creation form
│   └── ErrorBoundary.tsx       # Error display
├── lib/
│   ├── db.ts                   # Database operations
│   ├── types.ts                # TypeScript definitions
│   ├── utils.ts                # Utility functions
│   ├── hooks.ts                # Custom React hooks
│   ├── api-client.ts           # API client utilities
│   ├── constants.ts            # App constants
│   └── timezone-context.tsx    # Timezone context provider
└── scripts/
    ├── init-db.ts              # Database initialization
    └── sync-memories.ts        # Memory sync script
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Actions, links, highlights
- **Surface**: Slate palette - Backgrounds, text, borders
- **Semantic**: Green (success), Red (danger), Amber (warning)

### Typography
- **Primary**: Inter - Modern, highly readable sans-serif
- **Monospace**: JetBrains Mono - Code and memory content

### Components
All UI components are built with:
- **Consistency**: Same design language across the app
- **Accessibility**: ARIA labels, keyboard navigation
- **Dark Mode**: Automatic switching with Tailwind
- **Animations**: Subtle transitions for better UX

## 📊 Data Sources

- **Memories**: Neon Postgres database (synced from `/root/.openclaw/workspace/memory/*.md`)
- **Memos**: Neon Postgres database
- **Documents**: Coming soon
- **Tasks**: Coming soon

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS 3.4
- **Database**: Neon Postgres (@neondatabase/serverless)
- **UI Components**: Custom (no heavy UI library)
- **Icons**: Custom SVG icons
- **Fonts**: Inter + JetBrains Mono (Google Fonts)

## 📝 Key Changes in v2.0

### Major Improvements
1. **Modern UI/UX Redesign**
   - New component library with Button, Card, Badge, etc.
   - Tab-based navigation (Memories ↔ Memos)
   - Glass-morphism header with blur effects
   - Smooth animations and transitions

2. **Feature Integration**
   - Memos are now fully functional (were hidden in v1.x)
   - Inline editing for memos
   - Better delete confirmation UX
   - Skeleton loading states

3. **Developer Experience**
   - Better TypeScript types
   - Improved component architecture
   - Consistent styling patterns

## 🚢 Deployment

The app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Railway/Render** (with Neon Postgres)
- **Self-hosted** (Docker or Node.js)

### Environment Variables
```bash
DATABASE_URL=postgresql://user:pass@host/db
# Optional:
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

Built for Dhsiao by clawai 🐾

**Version**: 2.0.0  
**License**: MIT
