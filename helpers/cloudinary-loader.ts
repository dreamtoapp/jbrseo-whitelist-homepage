/**
 * Custom Cloudinary loader for Next.js Image component.
 * Extracts the image path from Cloudinary URLs and applies responsive transformations.
 * This ensures Cloudinary serves appropriately sized images based on the viewport.
 * 
 * @param params - Next.js Image loader parameters
 * @returns Optimized Cloudinary URL with width, quality, and format transformations
 */
export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // Handle non-Cloudinary images
  if (!src.includes("res.cloudinary.com")) {
    // For local images (starting with /), return with query params for Next.js optimization
    // This allows Next.js to still optimize local images even with custom loader
    if (src.startsWith("/")) {
      // Return the local path - Next.js will serve from public directory
      // The custom loader must return a valid URL/path
      return src;
    }
    // For remote non-Cloudinary images, return as-is
    // These are handled by remotePatterns in next.config.ts
    return src;
  }

  // Extract the path after /upload/ from the Cloudinary URL
  // Pattern: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{image_id}
  const uploadIndex = src.indexOf("/upload/");

  if (uploadIndex === -1) {
    return src;
  }

  // Get the base URL up to /upload/
  const baseUrl = src.substring(0, uploadIndex + "/upload/".length);

  // Get everything after /upload/ (this includes any existing transformations and the image path)
  let afterUpload = src.substring(uploadIndex + "/upload/".length);

  // Check if URL already has f_auto/q_auto from database (preserve base optimizations)
  const hasBaseOptimizations = afterUpload.startsWith("f_auto/q_auto/");

  if (hasBaseOptimizations) {
    // URL already optimized from DB: .../upload/f_auto/q_auto/image.jpg
    // Remove f_auto/q_auto to extract clean image path, then add width
    afterUpload = afterUpload.replace(/^f_auto\/q_auto\//, "");

    // Add width transformation before f_auto/q_auto (correct syntax: w_1280/f_auto/q_auto)
    return `${baseUrl}w_${width}/f_auto/q_auto/${afterUpload}`;
  }

  // URL not optimized yet - remove existing transformations and add all optimizations
  // Remove version numbers
  afterUpload = afterUpload.replace(/^v\d+\//, "");

  // Remove existing transformations (width, quality, format, crop, etc.)
  afterUpload = afterUpload
    .replace(/w_\d+[,\/]/g, "")
    .replace(/h_\d+[,\/]/g, "")
    .replace(/q_(auto|\d+)[,\/]/g, "")
    .replace(/f_(auto|webp|avif|jpg|png)[,\/]/g, "")
    .replace(/c_(limit|fill|fit|scale|pad)[,\/]/g, "")
    .replace(/dpr_(auto|\d+)[,\/]/g, "");

  // Clean up any double slashes or leading/trailing separators
  afterUpload = afterUpload.replace(/^[,\/]+/, "").replace(/[,\/]+$/, "");

  // Build transformations: width first, then f_auto/q_auto (SLASH-separated per Cloudinary docs)
  // Format: w_1280/f_auto/q_auto/image.jpg
  return `${baseUrl}w_${width}/f_auto/q_auto/${afterUpload}`;
}

