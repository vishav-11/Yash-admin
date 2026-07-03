"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn.utils";
import ProjectMediaDeleteDialog from "./ProjectMediaDeleteDialog";
import type { ProjectMedia } from "../types/project.types";

interface ProjectMediaGalleryProps {
  projectId: string;
  media: ProjectMedia[];
  editable?: boolean;
}

// ─── Media Lightbox ────────────────────────────────────────────────────────────

const MediaLightbox: React.FC<{
  media: ProjectMedia;
  onClose: () => void;
}> = ({ media, onClose }) => {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div
        className="max-h-[90vh] max-w-5xl overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {media.type === "video" ? (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-h-[85vh] max-w-full rounded-xl"
          />
        ) : (
          <img
            src={media.url}
            alt="Media preview"
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
        )}
      </div>
    </div>
  );
};

// ─── Main Gallery ──────────────────────────────────────────────────────────────

const ProjectMediaGallery: React.FC<ProjectMediaGalleryProps> = ({
  projectId,
  media,
  editable = false,
}) => {
  const [lightboxMedia, setLightboxMedia] = useState<ProjectMedia | null>(null);
  const [deleteMedia, setDeleteMedia] = useState<ProjectMedia | null>(null);

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400" aria-hidden="true">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
        <p className="text-sm text-slate-400">No media files yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {media.map((item) => (
          <div
            key={item._id}
            className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100"
          >
            {/* Thumbnail */}
            {item.type === "video" ? (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt="Video thumbnail" className="h-full w-full object-cover opacity-60" />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m22 8-6 4 6 4V8z" />
                    <rect width="14" height="12" x="2" y="6" rx="2" />
                  </svg>
                )}
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={item.url}
                alt="Project media"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {/* View */}
              <button
                onClick={() => setLightboxMedia(item)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                aria-label="View media"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              {/* Delete */}
              {editable && (
                <button
                  onClick={() => setDeleteMedia(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-500"
                  aria-label="Delete media"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>

            {/* Type badge */}
            <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
              {item.type === "video" ? "VID" : "IMG"}
            </span>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxMedia && (
        <MediaLightbox
          media={lightboxMedia}
          onClose={() => setLightboxMedia(null)}
        />
      )}

      {/* Media Delete Dialog */}
      <ProjectMediaDeleteDialog
        projectId={projectId}
        media={deleteMedia}
        isOpen={!!deleteMedia}
        onClose={() => setDeleteMedia(null)}
      />
    </>
  );
};

export default ProjectMediaGallery;