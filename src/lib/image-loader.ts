"use client";

/**
 * Custom next/image loader.
 *
 * The backend already returns fully-transformed Cloudinary URLs (f_auto/q_auto +
 * named size variants), so the loader passes them through untouched — the CDN
 * does the optimization at the edge rather than the Next.js image server.
 */
export default function cloudinaryLoader({ src }: { src: string }): string {
  return src;
}
