import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_KR, Noto_Serif_KR, Parisienne } from "next/font/google";

import { AudioProvider } from "@/components/AudioProvider";
import { ToastProvider } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { formatDotted, weekdayKo } from "@/lib/date";
import { venueLine } from "@/lib/venue";

import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  preload: false,
});

/** HERO 의 큰 필기체 제목에만 사용 */
const script = Parisienne({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
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
  /* 검색 노출을 막으므로 keywords 는 두지 않는다. */
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
  /**
   * 연락처 · 계좌번호 같은 개인정보가 들어가므로 검색엔진에는 노출하지 않는다.
   * 링크를 받은 하객은 그대로 열람할 수 있다. (접속 차단이 아님)
   */
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfaf7",
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
      name: venueLine(),
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
    <html lang="ko" className={`${notoSansKr.variable} ${notoSerifKr.variable} ${cormorant.variable} ${script.variable}`}>
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
            {weekdayKo(wedding.wedding.date)} {wedding.wedding.timeLabel}, {venueLine()}
          </div>
        </noscript>
      </body>
    </html>
  );
}
