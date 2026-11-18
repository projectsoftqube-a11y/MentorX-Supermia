/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve /public images as they are: Vercel image optimisation is a paid allowance on the Hobby plan
  // and answers 402 once it is used up, which leaves every next/image blank.
  images: { unoptimized: true },
  reactStrictMode: true,
  // Lets a separate verification build (NEXT_DIST_DIR=.next-verify) run without touching the dev server's .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
}

export default nextConfig
