/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets a separate verification build (NEXT_DIST_DIR=.next-verify) run without touching the dev server's .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
}

export default nextConfig
