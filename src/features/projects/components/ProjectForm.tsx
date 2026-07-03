"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/utils/cn.utils";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useProjectCategories } from "../hooks/useProjectCategories";
import { projectSchema, type ProjectFormSchema } from "../schemas/project.schema";
import type { Project } from "../types/project.types";

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormSchema>;
  project?: Project;           // When editing, pass existing project
  onSubmit: (data: ProjectFormSchema, files: File[]) => void;
  isLoading: boolean;
  submitLabel: string;
}

// ─── Media Upload Zone ─────────────────────────────────────────────────────────

interface MediaUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  files,
  onFilesChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files).filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );
      onFilesChange([...files, ...dropped]);
    },
    [files, onFilesChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    onFilesChange([...files, ...selected]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8",
          "transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            Drag & drop files here
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Images and videos supported
          </p>
        </div>
        <label className={cn(
          "cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2",
          "text-sm font-medium text-slate-600",
          "transition-colors hover:bg-slate-50"
        )}>
          Browse Files
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileInput}
            className="sr-only"
          />
        </label>
      </div>

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {files.map((file, index) => {
            const isVideo = file.type.startsWith("video/");
            const previewUrl = URL.createObjectURL(file);

            return (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                {isVideo ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m22 8-6 4 6 4V8z" />
                      <rect width="14" height="12" x="2" y="6" rx="2" />
                    </svg>
                  </div>
                ) : (
                  <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
                )}

                {/* File type badge */}
                <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
                  {isVideo ? "VID" : "IMG"}
                </span>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {files.length > 0 && (
        <p className="text-xs text-slate-400">
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
};

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
}) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {description && (
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      )}
    </div>
    <div
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-blue-600" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm",
          "transition-transform duration-200",
          checked && "translate-x-5"
        )}
      />
    </div>
  </label>
);

// ─── Main Form Component ───────────────────────────────────────────────────────

const ProjectForm: React.FC<ProjectFormProps> = ({
  defaultValues,
  project,
  onSubmit,
  isLoading,
  submitLabel,
}) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const { categories, isLoading: categoriesLoading } = useProjectCategories();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? defaultValues?.title ?? "",
      description: project?.description ?? defaultValues?.description ?? "",
      category: project?.category ?? defaultValues?.category ?? "",
      tags: project?.tags?.join(", ") ?? defaultValues?.tags ?? "",
      tools: project?.tools?.join(", ") ?? defaultValues?.tools ?? "",
      client: project?.client ?? defaultValues?.client ?? "",
      featured: project?.featured ?? defaultValues?.featured ?? false,
      published: project?.published ?? defaultValues?.published ?? false,
    },
  });

  const descriptionValue = watch("description");
  const featured = watch("featured");
  const published = watch("published");

  const handleFormSubmit = (data: ProjectFormSchema) => {
    onSubmit(data, mediaFiles);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      {/* ── Basic Info ──────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-800">
          Basic Information
        </h2>

        <div className="flex flex-col gap-4">
          {/* Title */}
          <FormField
            label="Project Title"
            htmlFor="project-title"
            error={errors.title?.message}
            required
          >
            <Input
              id="project-title"
              placeholder="Enter project title..."
              error={!!errors.title}
              {...register("title")}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            htmlFor="project-description"
            error={errors.description?.message}
            currentLength={descriptionValue?.length ?? 0}
            maxLength={2000}
            required
          >
            <textarea
              id="project-description"
              placeholder="Describe your project..."
              rows={5}
              maxLength={2000}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all duration-200",
                "text-slate-900 placeholder:text-slate-400",
                "border-slate-200 bg-white resize-none",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors.description && "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              )}
              {...register("description")}
            />
          </FormField>

          {/* Category */}
          <FormField
            label="Category"
            htmlFor="project-category"
            error={errors.category?.message}
            required
          >
            <select
              id="project-category"
              disabled={categoriesLoading}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all duration-200",
                "text-slate-900 bg-white cursor-pointer",
                "border-slate-200",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                "disabled:opacity-50",
                errors.category && "border-red-400"
              )}
              {...register("category")}
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Client */}
          <FormField
            label="Client"
            htmlFor="project-client"
            error={errors.client?.message}
            hint="Optional — name of the client for this project"
          >
            <Input
              id="project-client"
              placeholder="Client name..."
              error={!!errors.client}
              {...register("client")}
            />
          </FormField>
        </div>
      </section>

      {/* ── Tags & Tools ─────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-800">
          Tags & Tools
        </h2>

        <div className="flex flex-col gap-4">
          <FormField
            label="Tags"
            htmlFor="project-tags"
            error={errors.tags?.message}
            hint="Separate tags with commas — e.g. branding, minimal, modern"
          >
            <Input
              id="project-tags"
              placeholder="branding, minimal, modern..."
              error={!!errors.tags}
              {...register("tags")}
            />
          </FormField>

          <FormField
            label="Tools"
            htmlFor="project-tools"
            error={errors.tools?.message}
            hint="Separate tools with commas — e.g. Figma, Photoshop, After Effects"
          >
            <Input
              id="project-tools"
              placeholder="Figma, Photoshop, After Effects..."
              error={!!errors.tools}
              {...register("tools")}
            />
          </FormField>
        </div>
      </section>

      {/* ── Media Upload ──────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="mb-1.5 text-sm font-semibold text-slate-800">
          Media Files
        </h2>
        <p className="mb-5 text-xs text-slate-400">
          {project
            ? "Upload additional media to add to this project."
            : "Upload images and videos for this project."}
        </p>
        <MediaUploadZone files={mediaFiles} onFilesChange={setMediaFiles} />
      </section>

      {/* ── Settings ─────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-800">
          Settings
        </h2>
        <div className="flex flex-col gap-3">
          <Toggle
            checked={featured}
            onChange={(val) => setValue("featured", val, { shouldDirty: true })}
            label="Featured Project"
            description="Highlight this project on your portfolio"
          />
          <Toggle
            checked={published}
            onChange={(val) => setValue("published", val, { shouldDirty: true })}
            label="Published"
            description="Make this project visible on your portfolio"
          />
        </div>
      </section>

      {/* ── Submit ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
          className="min-w-36"
        >
          {isLoading ? "Saving..." : submitLabel}
        </Button>
        <p className="text-xs text-slate-400">
          All fields marked with * are required
        </p>
      </div>
    </form>
  );
};

export default ProjectForm;