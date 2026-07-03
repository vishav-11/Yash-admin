"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProject } from "@/features/projects/hooks/useProject";
import { useUpdateProject } from "@/features/projects/hooks/useUpdateProject";
import ProjectForm from "@/features/projects/components/ProjectForm";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ROUTES } from "@/constants/routes.constants";
import type { ProjectFormSchema } from "@/features/projects/schemas/project.schema";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { project, isLoading } = useProject(id);
  const { updateProject, isLoading: isUpdating } = useUpdateProject(id);

  const handleSubmit = (data: ProjectFormSchema, files: File[]) => {
    updateProject({
      id,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      tools: data.tools ? data.tools.split(",").map((t) => t.trim()).filter(Boolean) : [],
      client: data.client || undefined,
      featured: data.featured,
      published: data.published,
      media: files.length > 0 ? files : undefined,
    });
  };

  if (isLoading) {
    return <LoadingScreen variant="page" message="Loading project..." />;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-sm text-slate-500">Project not found.</p>
        <Link href={ROUTES.PROJECTS.ROOT} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.PROJECTS.DETAIL(id)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Edit Project</h1>
          <p className="mt-0.5 text-sm text-slate-500 truncate max-w-xs">
            {project.title}
          </p>
        </div>
      </div>

      {/* Existing media section */}
      {project.media.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-800">
            Existing Media
          </h2>
          <p className="mb-4 text-xs text-slate-400">
            {project.media.length} file{project.media.length !== 1 ? "s" : ""} — upload new files below to add more
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {project.media.map((item) => (
              <div key={item._id} className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                {item.type === "image" ? (
                  <img src={item.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m22 8-6 4 6 4V8z" />
                      <rect width="14" height="12" x="2" y="6" rx="2" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <ProjectForm
        project={project}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        submitLabel="Save Changes"
      />
    </div>
  );
}