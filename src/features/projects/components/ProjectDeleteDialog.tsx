"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/cn.utils";
import { useDeleteProject } from "../hooks/useDeleteProject";
import type { Project } from "../types/project.types";

interface ProjectDeleteDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDeleteDialog: React.FC<ProjectDeleteDialogProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { deleteProject, isLoading, reset } = useDeleteProject();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus trap — focus cancel button on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, isLoading, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleConfirm = () => {
    if (!project) return;
    deleteProject(project._id, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen || !project) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => !isLoading && onClose()}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/20",
          "p-6"
        )}
      >
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <h2 id="delete-dialog-title" className="mt-4 text-lg font-bold text-slate-800">
          Delete Project
        </h2>
        <p id="delete-dialog-desc" className="mt-2 text-sm text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">
            &quot;{project.title}&quot;
          </span>
          ? This action cannot be undone. All media associated with this project will also be permanently deleted.
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "flex-1 rounded-lg border border-slate-200 bg-white py-2.5",
              "text-sm font-medium text-slate-700",
              "transition-colors duration-150 hover:bg-slate-50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-slate-400/30"
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "flex flex-1 items-center justify-center gap-2",
              "rounded-lg bg-red-600 py-2.5",
              "text-sm font-semibold text-white",
              "transition-colors duration-150 hover:bg-red-700",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-red-500/40"
            )}
          >
            {isLoading && (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {isLoading ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectDeleteDialog;