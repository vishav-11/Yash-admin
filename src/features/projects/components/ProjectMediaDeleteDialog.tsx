"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/utils/cn.utils";
import { useDeleteProjectMedia } from "../hooks/useDeleteProjectMedia";
import type { ProjectMedia } from "../types/project.types";

interface ProjectMediaDeleteDialogProps {
  projectId: string;
  media: ProjectMedia | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectMediaDeleteDialog: React.FC<ProjectMediaDeleteDialogProps> = ({
  projectId,
  media,
  isOpen,
  onClose,
}) => {
  const { deleteMedia, isLoading, reset } = useDeleteProjectMedia(projectId); // ✅ reset destructure
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus trap — focus cancel button on open
  useEffect(() => {
    if (isOpen) setTimeout(() => cancelRef.current?.focus(), 50);
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    if (!media) return;
    deleteMedia(
      { projectId, publicId: media.publicId, type: media.type },
      {
        onSuccess: () => {
          reset();   // ✅ mutation state clear karo (ProjectDeleteDialog ki tarah)
          onClose(); // ✅ dialog band karo
        },
      }
    );
  };

  if (!isOpen || !media) return null;

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
        aria-labelledby="media-delete-title"
        aria-describedby="media-delete-desc"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-sm",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-black/20"
        )}
      >
        {/* Media Preview */}
        <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
          {media.type === "image" ? (
            <img
              src={media.url}
              alt="Media to delete"
              className="h-32 w-full object-cover"
            />
          ) : (
            <div className="flex h-32 items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
                aria-hidden="true"
              >
                <path d="m22 8-6 4 6 4V8z" />
                <rect width="14" height="12" x="2" y="6" rx="2" />
              </svg>
            </div>
          )}
        </div>

        <h2
          id="media-delete-title"
          className="text-base font-bold text-slate-800"
        >
          Delete {media.type === "image" ? "Image" : "Video"}?
        </h2>
        <p
          id="media-delete-desc"
          className="mt-1.5 text-sm text-slate-500"
        >
          This media will be permanently deleted. This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "flex-1 rounded-lg border border-slate-200 py-2",
              "text-sm font-medium text-slate-700",
              "transition-colors duration-150 hover:bg-slate-50",
              "disabled:cursor-not-allowed disabled:opacity-50",
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
              "rounded-lg bg-red-600 py-2",
              "text-sm font-semibold text-white",
              "transition-colors duration-150 hover:bg-red-700",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "focus:outline-none focus:ring-2 focus:ring-red-500/40"
            )}
          >
            {isLoading && (
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.25"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectMediaDeleteDialog;