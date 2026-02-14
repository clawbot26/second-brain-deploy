# Changelog

All notable changes to the 2nd Brain project will be documented in this file.

## [2.0.0] - 2026-02-14 - Major UI/UX Redesign

### Added
- **Modern UI Component Library** (`components/ui/`):
  - `Button` - Versatile button with variants (primary, secondary, ghost, danger), sizes, loading states, and icon support
  - `Card` - Consistent card containers with configurable padding and shadows
  - `Badge` - Status indicators with multiple color variants
  - `Skeleton` - Animated loading placeholders for better perceived performance
  - `EmptyState` - Beautiful empty states with icons and actions
  - `TabNavigation` - Accessible tab navigation with multiple style variants

- **Enhanced Page Layout** (`app/page.tsx`):
  - Tab-based navigation between Memories and Memos
  - Integrated Memo functionality (previously hidden/unused)
  - Better stats dashboard with 4 cards (Memories, Memos, Documents, Tasks)
  - Cleaner header with action buttons
  - Improved error handling with dismiss functionality

- **API Client Enhancements** (`lib/api-client.ts`):
  - New `apiPut()` function for updating resources
  - New `apiDelete()` function for deleting resources

- **Type Definitions Update** (`lib/types.ts`):
  - Added `memos` property to `MemoAPIResponse` for consistency with API

- **Tailwind Configuration** (`tailwind.config.js`):
  - Custom color palette (primary, surface)
  - Inter and JetBrains Mono font families
  - Custom animations (fade-in, slide-up)
  - Custom shadows (soft, glow)

- **Global CSS Improvements** (`app/globals.css`):
  - Google Fonts import (Inter, JetBrains Mono)
  - Custom scrollbar styling
  - Selection styles
  - Focus visible styles

### Improved
- **StatCard Component** (`components/StatCard.tsx`):
  - New design with colored icon backgrounds
  - Added trend indicators
  - Color themes (blue, amber, emerald, purple, rose)
  - Coming soon badge support

- **MemoryList Component** (`components/MemoryList.tsx`):
  - Modern card-based design
  - Better visual hierarchy with selected state
  - Skeleton loading state
  - Improved empty state
  - Better tag display

- **MemoryViewer Component** (`components/MemoryViewer.tsx`):
  - Modern header with icon stats
  - Better typography with monospace content
  - Improved tags section
  - Added metadata footer
  - Better empty state

- **MemoList Component** (`components/MemoList.tsx`):
  - Complete redesign with modern styling
  - Inline delete button on hover
  - Better category/tag display
  - Cleaner typography

- **MemoViewer Component** (`components/MemoViewer.tsx`):
  - Full inline editing support
  - Modern modal for delete confirmation
  - Better stats display
  - Improved tag management in edit mode
  - Better empty state

- **SaveMemoForm Component** (`components/SaveMemoForm.tsx`):
  - Complete redesign with cleaner UX
  - Expandable form (starts compact, expands on focus)
  - Inline tag creation with better UX
  - Modern styling with Card wrapper

- **ErrorBoundary Component** (`components/ErrorBoundary.tsx`):
  - Modern alert design with icon
  - Dismiss functionality
  - Better visual hierarchy

- **Layout Component** (`app/layout.tsx`):
  - Modern glass-morphism header with blur effect
  - Better logo design with gradient background
  - GitHub link in header
  - Improved footer layout

### Fixed
- **Missing Memo Functionality**: The SaveMemoForm, MemoList, and MemoViewer components existed but were never rendered in the main page. They are now fully integrated with the tab-based navigation.
- **TypeScript Errors**: Fixed return type mismatches in callback functions
- **Missing Imports**: Added SkeletonList to imports
- **Type Definitions**: Added `memos` property to MemoAPIResponse interface

### Removed
- **Old Button Pattern**: Replaced ad-hoc button styling with new Button component
- **Refresh Button at Bottom**: Moved to header bar in the Memories section

### Design Philosophy
This redesign focuses on:
- **Consistency**: All components use the same design language
- **Accessibility**: Proper ARIA labels, focus states, and keyboard navigation
- **Performance**: Memoized components, skeleton loading states
- **Modern Aesthetics**: Clean typography, subtle animations, better spacing
- **User Experience**: Tab navigation, inline editing, better empty states

---

## [1.1.0] - 2026-02-13

### Added
- **Constants file** (`lib/constants.ts`): Centralized configuration
- **Utilities module** (`lib/utils.ts`): Reusable functions
- **DatabaseError class**: Custom error type
- **ErrorBoundary component**: Error display with retry
- **MemoryStats interface**: Type definition for statistics
- **Export type improvements**

### Improved
- **Type Safety**: Fixed imports, better type checking
- **Component Quality**: Memoization, accessibility improvements
- **Database Operations**: Better error handling
- **API Routes**: Better error handling
- **Main Page**: Error handling improvements

---

## [1.0.0] - Initial Release

### Features
- Memory Timeline with pagination
- Memory Viewer with statistics
- Stats Dashboard
- Dark Mode Support
- Responsive Design
- Neon Postgres Integration
- NextJS 15 with TypeScript
- Tailwind CSS styling
