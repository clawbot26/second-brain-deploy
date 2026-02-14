"use client";

import { useState, useEffect } from "react";
import { useContentStore } from "@/lib/content-store";
import { CATEGORY_LABELS } from "@/lib/content-utils";

export function ContentToolbar() {
  const { filters, setFilters, viewMode, setViewMode, setShowAddModal, fetchItems } = useContentStore();
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search input
  useEffect(() => {
    if (!mounted) return;
    const timeout = setTimeout(() => {
      setFilters({ search: searchInput || undefined });
      fetchItems();
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput, mounted, setFilters, fetchItems]);

  const handleCategoryClick = (category: string | null) => {
    setFilters({ category: category as typeof filters.category });
    fetchItems();
  };

  const handleReadFilterChange = (value: string) => {
    const isRead = value === "all" ? undefined : value === "read";
    setFilters({ is_read: isRead });
    fetchItems();
  };

  if (!mounted) {
    return <div className="h-16 bg-surface-50 dark:bg-surface-800 rounded-lg animate-pulse" />;
  }

  const categories = Object.entries(CATEGORY_LABELS);

  return (
    <div className="space-y-4">
      {/* Main toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search content..."
            className="block w-full pl-10 pr-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Read filter */}
          <select
            value={filters.is_read === undefined ? "all" : filters.is_read ? "read" : "unread"}
            onChange={(e) => handleReadFilterChange(e.target.value)}
            className="px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All items</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center border border-surface-200 dark:border-surface-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`
                p-2 transition-colors
                ${viewMode === "grid"
                  ? "bg-primary-500 text-white"
                  : "bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-600"
                }
              `}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`
                p-2 transition-colors
                ${viewMode === "list"
                  ? "bg-primary-500 text-white"
                  : "bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-600"
                }
              `}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${!filters.category
              ? "bg-primary-500 text-white"
              : "bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600"
            }
          `}
        >
          All
        </button>
        {categories.map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleCategoryClick(key)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${filters.category === key
                ? "bg-primary-500 text-white"
                : "bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
