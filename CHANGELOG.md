# Changelog

All notable changes to the 2nd Brain project will be documented in this file.

## [1.1.0] - 2026-02-13

### Added
- **Constants file** (`lib/constants.ts`): Centralized configuration for pagination, UI, and memory stats
- **Utilities module** (`lib/utils.ts`): Reusable functions for:
  - Date validation
  - Memory statistics calculation
  - Text formatting and truncation
  - Unique memory key generation
  - Error message parsing
- **DatabaseError class**: Custom error type for better error handling and tracking
- **ErrorBoundary component**: Displays error messages with retry functionality
- **MemoryStats interface**: Type definition for memory statistics
- **Export type improvements**: More detailed API response types

### Improved
- **Type Safety**:
  - Fixed incorrect imports in components (db.ts → types.ts)
  - Added proper type imports throughout the codebase
  - Enhanced MemoryAPIResponse interface with additional fields
  - Added strict type checking for error handling

- **Component Quality**:
  - `MemoryListItem`: Added memoization and useCallback for performance
  - `MemoryListItem`: Improved accessibility with aria labels
  - `MemoryList`: Use composite keys (date + id) to prevent duplication
  - `MemoryViewer`: Refactored to use calculateMemoryStats utility
  - `MemoryViewer`: Changed stats display from char count to min read time
  - `StatCard`: Already had good memoization, verified quality

- **Hook Improvements** (`lib/hooks.ts`):
  - Fixed import to use types instead of db module
  - Added useCallback for proper dependency management
  - Improved error handling with getErrorMessage utility
  - Better response validation

- **Database Operations** (`lib/db.ts`):
  - Added DatabaseError class for consistent error handling
  - Improved validation using isValidDate utility
  - Better error messages with error codes
  - Consistent error handling across all functions
  - Safer array access in getMemoriesCount
  - Improved type safety for returned values

- **API Route** (`app/api/memories/route.ts`):
  - Import DatabaseError and utils for better error handling
  - Use PAGINATION constants instead of magic numbers
  - Handle DatabaseError specifically with code and details
  - Improved error messages with development mode details
  - Better type handling for date transformations

- **Main Page** (`app/page.tsx`):
  - Fixed fetchMemories callback dependency issue (removed selectedMemory)
  - Use functional setState for safe auto-selection
  - Added ErrorBoundary component with retry functionality
  - Improved overall error display

### Performance
- Extracted duplicate line-counting logic into utility function
- Added memoization to MemoryListItem component
- Optimized callback dependencies to prevent unnecessary re-renders
- Parallel memory fetching (memories + count)

### Code Quality
- Removed magic strings and numbers (moved to constants)
- Improved DRY principle by extracting utilities
- Better separation of concerns
- More consistent error handling
- Enhanced code documentation

### Dependencies
- No new dependencies added
- Existing packages used more effectively

## [1.0.0] - Initial Release

### Features
- Memory Timeline: Browse all daily memory files
- Memory Viewer: Read full content of any memory file
- Stats Dashboard: See total number of memories
- Dark Mode Support: Automatic dark/light theme
- Responsive Design: Mobile, tablet, and desktop support
- Neon Postgres Database Integration
- NextJS 15 with TypeScript
- Tailwind CSS styling
