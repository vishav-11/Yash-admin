"use client";

import React from "react";
import { cn } from "@/utils/cn.utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

const ProjectPagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  isFetching,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Build page numbers with ellipsis
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const btnBase = cn(
    "flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5",
    "text-sm font-medium transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
    "disabled:opacity-40 disabled:cursor-not-allowed"
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Info */}
      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">{startItem}–{endItem}</span>
        {" "}of{" "}
        <span className="font-semibold text-slate-700">{total}</span>
        {" "}projects
        {isFetching && (
          <span className="ml-2 text-blue-500">Updating...</span>
        )}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || isFetching}
          aria-label="Previous page"
          className={cn(btnBase, "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((pageNum, idx) =>
          pageNum === "..." ? (
            <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-sm text-slate-400">
              ···
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={isFetching}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === page ? "page" : undefined}
              className={cn(
                btnBase,
                pageNum === page
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || isFetching}
          aria-label="Next page"
          className={cn(btnBase, "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectPagination;