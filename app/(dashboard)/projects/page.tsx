"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useProjects } from "@/features/projects/hooks/useProjects";
import ProjectTable from "@/features/projects/components/ProjectTable";
import ProjectFilters from "@/features/projects/components/ProjectFilters";
import ProjectPagination from "@/features/projects/components/ProjectPagination";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/utils/cn.utils";
import type { ProjectFilters as IProjectFilters } from "@/features/projects/types/project.types";

const DEFAULT_FILTERS: IProjectFilters = {
  page: 1,
  limit: 10,
};

export default function ProjectsPage() {
  const [filters, setFilters] = useState<IProjectFilters>(DEFAULT_FILTERS);

  const { projects, pagination, isLoading, isFetching, isError, refetch } =
    useProjects(filters);

  const handleFilterChange = useCallback((changes: Partial<IProjectFilters>) => {
    setFilters((prev) => ({ ...prev, ...changes }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Projects
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all your portfolio projects
          </p>
        </div>

        <Link
          href={ROUTES.PROJECTS.CREATE}
          className={cn(
            "flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5",
            "text-sm font-semibold text-white shadow-sm shadow-blue-600/20",
            "transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/25",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </Link>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────────────────────── */}
      {pagination && (
        <div className="flex items-center gap-6 rounded-xl border border-slate-100 bg-white px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{pagination.total}</span>
              {" "}total projects
            </span>
          </div>
          {filters.category && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-sm text-slate-500">Filtered by category</span>
            </div>
          )}
          {filters.featured && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-sm text-slate-500">Featured only</span>
            </div>
          )}
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-100 bg-white p-4">
        <ProjectFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* ── Error State ───────────────────────────────────────────────────────── */}
      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Failed to load projects
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Something went wrong. Please try again.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Projects Table ────────────────────────────────────────────────────── */}
      {!isError && (
        <ProjectTable
          projects={projects}
          isFetching={isLoading || isFetching}
        />
      )}

      {/* ── Pagination ────────────────────────────────────────────────────────── */}
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