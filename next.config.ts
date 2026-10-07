import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF 는 용량은 작지만 휴대폰에서 풀어내는 데 CPU 를 많이 써서
    // 빠르게 스크롤할 때 버벅인다. WebP 만 쓴다.
    formats: ["image/webp"],
    // 실제 사진을 Google Drive / 외부 CDN으로 교체할 때 여기에 호스트를 추가하세요.
    // remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  /** 개인정보가 들어가는 페이지이므로 기본적인 보안 헤더를 붙인다. */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
