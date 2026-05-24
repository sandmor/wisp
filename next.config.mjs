/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://img.clerk.com/*")],
  },
}

export default nextConfig
