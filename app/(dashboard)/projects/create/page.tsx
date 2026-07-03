"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";
import ProjectForm from "@/features/projects/components/ProjectForm";
import { useCreateProject } from "@/features/projects/hooks/useCreateProject";
import type { ProjectFormSchema } from "@/features/projects/schemas/project.schema";

export default function CreateProjectPage() {
  const { createProject, isLoading } = useCreateProject();

  const handleSubmit = (data: ProjectFormSchema, files: File[]) => {
    createProject({
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      tools: data.tools ? data.tools.split(",").map((t) => t.trim()).filter(Boolean) : [],
      client: data.client || undefined,
      featured: data.featured,
      published: data.published,
      media: files,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.PROJECTS.ROOT}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
          aria-label="Back to projects"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Project</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Add a new project to your portfolio
          </p>
        </div>
      </div>

      <ProjectForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Create Project"
      />
    </div>
  );
}