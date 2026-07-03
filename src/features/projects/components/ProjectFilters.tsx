"use client";

import React from "react";
import { cn } from "@/utils/cn.utils";
import { useProjectCategories } from "../hooks/useProjectCategories";
import type { ProjectFilters } from "../types/project.types";

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFilterChange: (filters: Partial<ProjectFilters>) => void;
  onReset: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const { categories, isLoading: categoriesLoading } = useProjectCategories();

  const hasActiveFilters =
    !!filters.category || filters.featured !== undefined || !!filters.search;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <div className="relative flex-1 min-w-48">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search ?? ""}
          onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
          className={cn(
            "h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4",
            "text-sm text-slate-700 placeholder:text-slate-400",
            "transition-all duration-200",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          )}
        />
      </div>

      {/* ── Category Select ─────────────────────────────────────────────────── */}
      <select
        value={filters.category ?? ""}
        onChange={(e) =>
          onFilterChange({ category: e.target.value || undefined, page: 1 })
        }
        disabled={categoriesLoading}
        className={cn(
          "h-9 rounded-lg border border-slate-200 bg-white px-3",
          "text-sm text-slate-700",
          "transition-all duration-200 cursor-pointer",
          "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "min-w-40"
        )}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
            {cat.count !== undefined ? ` (${cat.count})` : ""}
          </option>
        ))}
      </select>

      {/* ── Featured Toggle ─────────────────────────────────────────────────── */}
      <button
        onClick={() =>
          onFilterChange({
            featured: filters.featured ? undefined : true,
            page: 1,
          })
        }
        aria-pressed={!!filters.featured}
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium",
          "transition-all duration-200",
          filters.featured
            ? "border-amber-300 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
        )}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={filters.featured ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Featured
      </button>

      {/* ── Reset Button ────────────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-lg border border-slate-200",
            "bg-white px-3 text-sm text-slate-500",
            "transition-colors duration-150 hover:border-red-200 hover:text-red-500"
          )}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Clear filters
        </button>
      )}

      {/* ── Active Filter Count ──────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          {[filters.category, filters.featured, filters.search].filter(Boolean).length}
        </span>
      )}
    </div>
  );
};

export default ProjectFilters;