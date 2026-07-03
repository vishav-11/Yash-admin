"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProject } from "@/features/projects/hooks/useProject";
import ProjectMediaGallery from "@/features/projects/components/ProjectMediaGallery";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/utils/cn.utils";

const formatCategory = (cat: string) =>
  cat.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { project, isLoading, isError, refetch } = useProject(id);

  if (isLoading) {
    return <LoadingScreen variant="page" message="Loading project..." />;
  }

  if (isError || !project) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-sm font-semibold text-slate-700">Project not found</p>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Retry
          </button>
          <Link href={ROUTES.PROJECTS.ROOT} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href={ROUTES.PROJECTS.ROOT}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="Back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                {project.title}
              </h1>
              {project.featured && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Featured
                </span>
              )}
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                project.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
              )}>
                {project.published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {formatCategory(project.category)}
              {project.client && ` · ${project.client}`}
            </p>
          </div>
        </div>

        <Link
          href={ROUTES.PROJECTS.EDIT(id)}
          className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — main content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Description */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">Description</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {project.description}
            </p>
          </section>

          {/* Media Gallery */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Media Gallery
              </h2>
              <span className="text-xs text-slate-400">
                {project.media.length} file{project.media.length !== 1 ? "s" : ""}
              </span>
            </div>
            <ProjectMediaGallery
              projectId={id}
              media={project.media}
              editable
            />
          </section>
        </div>

        {/* Right — details sidebar */}
        <div className="flex flex-col gap-4">
          {/* Cover Image */}
          {project.coverImage && (
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
              <img
                src={project.coverImage}
                alt={`${project.title} cover`}
                className="h-48 w-full object-cover"
              />
              <div className="p-3">
                <p className="text-xs text-slate-400">Cover Image</p>
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Details</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Category", value: formatCategory(project.category) },
                { label: "Client", value: project.client ?? "—" },
                { label: "Created", value: new Date(project.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                { label: "Updated", value: new Date(project.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-xs font-medium text-slate-700 text-right">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tags */}
          {project.tags.length > 0 && (
            <section className="rounded-2xl border border-slate-100 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-800">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Tools */}
          {project.tools.length > 0 && (
            <section className="rounded-2xl border border-slate-100 bg-white p-5">
              <h2 className="mb-3 text-sm font-semibold text-slate-800">Tools Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                    {tool}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}