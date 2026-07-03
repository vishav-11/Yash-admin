"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useProjects } from "@/features/projects/hooks/useProjects";
import ProjectTable from "@/features/projects/components/ProjectTable";
import ProjectPagination from "@/features/projects/components/ProjectPagination";
import { ROUTES } from "@/constants/routes.constants";
import { VIDEO_CATEGORIES } from "@/features/projects/types/project.types";
import type { ProjectFilters } from "@/features/projects/types/project.types";

// Video projects page reuses the exact same components as /projects
// but pre-filters to video-related categories only.

const DEFAULT_FILTERS: ProjectFilters = {
  page: 1,
  limit: 10,
  category: VIDEO_CATEGORIES[0], // default to first video category
};

export default function VideoProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilters>(DEFAULT_FILTERS);

  const { projects, pagination, isLoading, isFetching, isError, refetch } =
    useProjects(filters);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Video Projects
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Reels, animations, motion graphics and video edits
          </p>
        </div>
        <Link
          href={ROUTES.PROJECTS.CREATE}
          className="flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Video Project
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {VIDEO_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters((prev) => ({ ...prev, category: cat, page: 1 }))}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filters.category === cat
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
          </button>
        ))}
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 py-10 text-center">
          <p className="text-sm font-semibold text-slate-700">Failed to load projects</p>
          <button onClick={() => refetch()} className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            Try again
          </button>
        </div>
      )}

      {/* Table */}
      {!isError && (
        <ProjectTable projects={projects} isFetching={isLoading || isFetching} />
      )}

      {/* Pagination */}
      {!isError && pagination && pagination.totalPages > 1 && (
        <ProjectPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={filters.limit ?? 10}
          onPageChange={handlePageChange}
          isFetching={isFetching}
        />
      )}
    </div>
  );
}