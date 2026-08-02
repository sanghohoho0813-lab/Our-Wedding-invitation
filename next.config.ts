import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 실제 사진을 Google Drive / 외부 CDN으로 교체할 때 여기에 호스트를 추가하세요.
    // remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
