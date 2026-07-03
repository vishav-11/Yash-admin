"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn.utils";
import { ROUTES } from "@/constants/routes.constants";
import ProjectDeleteDialog from "./ProjectDeleteDialog";
import type { Project } from "../types/project.types";

interface ProjectTableProps {
  projects: Project[];
  isFetching?: boolean;
}

// ─── Skeleton Row ──────────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-slate-50">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-12 w-16 shrink-0 rounded-lg bg-slate-100" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-36 rounded bg-slate-100" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="h-3 w-24 rounded bg-slate-100" />
    </td>
    <td className="px-4 py-3">
      <div className="h-3 w-20 rounded bg-slate-100" />
    </td>
    <td className="px-4 py-3">
      <div className="h-5 w-16 rounded-full bg-slate-100" />
    </td>
    <td className="px-4 py-3">
      <div className="h-5 w-20 rounded-full bg-slate-100" />
    </td>
    <td className="px-4 py-3">
      <div className="h-3 w-20 rounded bg-slate-100" />
    </td>
    <td className="px-4 py-3">
      <div className="h-7 w-20 rounded-lg bg-slate-100" />
    </td>
  </tr>
);

// ─── Category Badge ────────────────────────────────────────────────────────────

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const label = category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
      {label}
    </span>
  );
};

// ─── Status Badge ──────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}> = ({ active, activeLabel, inactiveLabel }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
      active
        ? "bg-green-100 text-green-700"
        : "bg-slate-100 text-slate-500"
    )}
  >
    <span
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        active ? "bg-green-500" : "bg-slate-400"
      )}
    />
    {active ? activeLabel : inactiveLabel}
  </span>
);

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <tr>
    <td colSpan={7} className="px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-400"
            aria-hidden="true"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">
            No projects found
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your filters or create a new project.
          </p>
        </div>
        <Link
          href={ROUTES.PROJECTS.CREATE}
          className="mt-1 flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Project
        </Link>
      </div>
    </td>
  </tr>
);

// ─── Main Table ────────────────────────────────────────────────────────────────

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  isFetching,
}) => {
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // ── KEY FIX: Always ensure projects is an array ────────────────────────────
  const safeProjects: Project[] = Array.isArray(projects) ? projects : [];

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-slate-100 bg-white",
          isFetching &&
            "opacity-60 pointer-events-none transition-opacity"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 border-collapse text-sm">
            {/* Header */}
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {[
                  "Project",
                  "Category",
                  "Client",
                  "Featured",
                  "Published",
                  "Created",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Skeleton rows while loading */}
              {isFetching && safeProjects.length === 0 &&
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}

              {/* Empty state */}
              {!isFetching && safeProjects.length === 0 && <EmptyState />}

              {/* Data rows — uses safeProjects */}
              {safeProjects.map((project) => (
                <tr
                  key={project._id}
                  className="group border-b border-slate-50 transition-colors duration-100 hover:bg-slate-50/60 last:border-0"
                >
                  {/* Project cover + title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {project.coverImage ? (
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-slate-300"
                              aria-hidden="true"
                            >
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                              />
                              <circle cx="9" cy="9" r="2" />
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800 max-w-48">
                          {project.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {project.media?.length ?? 0} media file
                          {(project.media?.length ?? 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <CategoryBadge category={project.category ?? ""} />
                  </td>

                  {/* Client */}
                  <td className="px-4 py-3 text-slate-600">
                    {project.client ?? (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-3">
                    <StatusBadge
                      active={project.featured}
                      activeLabel="Featured"
                      inactiveLabel="No"
                    />
                  </td>

                  {/* Published */}
                  <td className="px-4 py-3">
                    <StatusBadge
                      active={project.published}
                      activeLabel="Published"
                      inactiveLabel="Draft"
                    />
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {/* View */}
                      <Link
                        href={ROUTES.PROJECTS.DETAIL(project._id)}
                        title="View project"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>

                      {/* Edit */}
                      <Link
                        href={ROUTES.PROJECTS.EDIT(project._id)}
                        title="Edit project"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(project)}
                        title="Delete project"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ProjectDeleteDialog
        project={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default ProjectTable;