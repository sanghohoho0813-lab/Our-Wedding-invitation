import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";

import { AudioProvider } from "@/components/AudioProvider";
import { ToastProvider } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { formatDotted, weekdayKo } from "@/lib/date";

import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl = wedding.share.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: wedding.share.title,
  description: wedding.share.description,
  applicationName: wedding.share.title,
  keywords: ["모바일 청첩장", "결혼식", wedding.groom.name, wedding.bride.name, wedding.wedding.venue],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: wedding.share.title,
    title: wedding.share.title,
    description: wedding.share.description,
    images: [
      {
        url: wedding.share.ogImage,
        width: 1200,
        height: 630,
        alt: wedding.share.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.share.title,
    description: wedding.share.description,
    images: [wedding.share.ogImage],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f7f3",
};

/** 카카오톡 / 검색 공유 시 구조화 데이터 */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: wedding.share.title,
    startDate: `${wedding.wedding.date}T${wedding.wedding.time}:00+09:00`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: wedding.share.description,
    image: [new URL(wedding.share.ogImage, siteUrl).toString()],
    location: {
      "@type": "Place",
      name: `${wedding.wedding.venue} ${wedding.wedding.hall}`,
      address: wedding.wedding.address,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${cormorant.variable}`}>
      <head>
        <StructuredData />
        {/*
          카카오톡 공유를 켜려면 config/wedding.ts 에 kakaoJavascriptKey 를 넣고
          아래 스크립트 주석을 해제하세요.

          <script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
            integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
            crossOrigin="anonymous"
            async
          />
        */}
      </head>
      <body>
        <ToastProvider>
          <AudioProvider>
            <div className="shell">{children}</div>
          </AudioProvider>
        </ToastProvider>
        <noscript>
          <div style={{ padding: "24px", textAlign: "center" }}>
            {wedding.groom.name} · {wedding.bride.name} — {formatDotted(wedding.wedding.date)}{" "}
            {weekdayKo(wedding.wedding.date)} {wedding.wedding.timeLabel}, {wedding.wedding.venue}{" "}
            {wedding.wedding.hall}
          </div>
        </noscript>
      </body>
    </html>
  );
}
