// /**
//  * File Utility Functions
//  *
//  * Why: File validation logic is reused across
//  * multiple upload forms. Centralizing keeps
//  * validation consistent and testable.
//  */

// import { FILE_LIMITS } from "@/constants";

// export const getFileExtension = (filename: string): string => {
//   return filename.slice(filename.lastIndexOf(".")).toLowerCase();
// };

// export const getMimeType = (file: File): string => file.type;

// export const isValidPhotoFile = (file: File): boolean => {
//   return (
//     FILE_LIMITS.PHOTO.ACCEPTED_TYPES.includes(file.type) &&
//     file.size <= FILE_LIMITS.PHOTO.MAX_SIZE_BYTES
//   );
// };

// export const isValidVideoFile = (file: File): boolean => {
//   return (
//     FILE_LIMITS.VIDEO.ACCEPTED_TYPES.includes(file.type) &&
//     file.size <= FILE_LIMITS.VIDEO.MAX_SIZE_BYTES
//   );
// };

// export const isValidLogoFile = (file: File): boolean => {
//   return (
//     FILE_LIMITS.LOGO.ACCEPTED_TYPES.includes(file.type) &&
//     file.size <= FILE_LIMITS.LOGO.MAX_SIZE_BYTES
//   );
// };

// export const createFilePreviewUrl = (file: File): string => {
//   return URL.createObjectURL(file);
// };

// export const revokeFilePreviewUrl = (url: string): void => {
//   URL.revokeObjectURL(url);
// };

// export const fileToFormData = (
//   file: File,
//   fieldName: string,
//   additionalFields?: Record<string, string>
// ): FormData => {
//   const formData = new FormData();
//   formData.append(fieldName, file);

//   if (additionalFields) {
//     Object.entries(additionalFields).forEach(([key, value]) => {
//       formData.append(key, value);
//     });
//   }

//   return formData;
// };