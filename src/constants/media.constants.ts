/**
 * Media-specific constants for file uploads.
 *
 * Why: File type validation and size limits are used in
 * multiple places (form schemas, upload handlers, UI feedback).
 * Central management prevents inconsistencies.
 */

export const FILE_LIMITS = {
  PHOTO: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  },
  VIDEO: {
    MAX_SIZE_MB: 100,
    MAX_SIZE_BYTES: 100 * 1024 * 1024,
    ACCEPTED_TYPES: ["video/mp4", "video/webm", "video/ogg"],
    ACCEPTED_EXTENSIONS: [".mp4", ".webm", ".ogg"],
  },
  LOGO: {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ACCEPTED_TYPES: [
      "image/png",
      "image/svg+xml",
      "image/webp",
      "image/jpeg",
    ],
    ACCEPTED_EXTENSIONS: [".png", ".svg", ".webp", ".jpg", ".jpeg"],
  },
} as const;

export const UPLOAD_STATUS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type UploadStatus =
  (typeof UPLOAD_STATUS)[keyof typeof UPLOAD_STATUS];