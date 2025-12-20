import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Optimizes Cloudinary image URLs by normalizing and adding automatic format and quality transformations.
 * Removes existing transformations and adds f_auto/q_auto (SLASH-separated per Cloudinary docs).
 * f_auto prioritizes WebP/AVIF formats, q_auto optimizes quality automatically.
 * 
 * @param url - The image URL (Cloudinary or other)
 * @returns Optimized Cloudinary URL with f_auto/q_auto or original URL if not from Cloudinary
 */
export function optimizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") {
    return url || "";
  }

  // Only optimize Cloudinary URLs
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Cloudinary URL pattern: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{image_id}
  const uploadIndex = url.indexOf("/upload/");

  if (uploadIndex === -1) {
    return url;
  }

  // Get base URL up to /upload/
  const baseUrl = url.substring(0, uploadIndex + "/upload/".length);

  // Get everything after /upload/ (transformations + image path)
  let afterUpload = url.substring(uploadIndex + "/upload/".length);

  // Check if URL already has f_auto/q_auto (already optimized) - check before normalization
  if (afterUpload.startsWith("f_auto/q_auto/")) {
    return url;
  }

  // Remove all existing transformations to normalize URL
  // Remove version numbers (v1234567890)
  afterUpload = afterUpload.replace(/^v\d+\//, "");

  // Remove common transformations (width, quality, format, crop, etc.)
  // Handle both comma and slash separators
  afterUpload = afterUpload
    .replace(/w_\d+[,\/]/g, "")
    .replace(/h_\d+[,\/]/g, "")
    .replace(/q_(auto|\d+)[,\/]/g, "")
    .replace(/f_(auto|webp|avif|jpg|png)[,\/]/g, "")
    .replace(/c_(limit|fill|fit|scale|pad)[,\/]/g, "")
    .replace(/dpr_(auto|\d+)[,\/]/g, "");

  // Clean up any double slashes or leading/trailing separators
  afterUpload = afterUpload.replace(/^[,\/]+/, "").replace(/[,\/]+$/, "");

  // Add f_auto/q_auto transformations (SLASH-separated per Cloudinary docs)
  // Format: .../upload/f_auto/q_auto/image.jpg
  return `${baseUrl}f_auto/q_auto/${afterUpload}`;
}

/**
 * Gets the target launch date from environment variable or returns a default date (7 days from now).
 * Reads from NEXT_PUBLIC_LAUNCH_DATE environment variable.
 * 
 * @returns Date object representing the target launch date
 */
export function getLaunchDate(): Date {
  const launchDateEnv = process.env.NEXT_PUBLIC_LAUNCH_DATE;
  if (launchDateEnv) {
    const parsedDate = new Date(launchDateEnv);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  // Default: 7 days from now
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

