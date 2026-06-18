/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow building into an isolated dir (avoids racing a running `next dev`).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Product images come from Cloudinary as pre-transformed URLs; a custom
  // passthrough loader uses them directly via next/image (CDN-edge optimized).
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
