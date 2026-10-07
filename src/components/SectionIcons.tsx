/**
 * 섹션 제목 위에 놓이는 작은 그림 아이콘.
 *
 * 선 하나로만 그리면 아이보리 위에서 밋밋해서,
 * 아이콘 안쪽을 두세 가지 차분한 색으로 채웠다. (뒤에 원 배경은 깔지 않는다)
 * 모두 24×24 격자 기준이다.
 */
import type { ReactNode } from "react";

const S = { strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** 작은 하트 — 가운데 아래 꼭짓점이 (x, y+size) 근처에 온다. */
function smallHeart(x: number, y: number, r: number) {
  return `M${x} ${y + r * 2}c-.2 0-${r * 2} -${r * 1.2}-${r * 2}-${r * 2.4}a${r} ${r} 0 0 1 ${r * 2}-.3a${r} ${r} 0 0 1 ${r * 2} .3c0 ${r * 1.2}-${r * 1.8} ${r * 2.4}-${r * 2} ${r * 2.4}z`;
}

const ICONS = {
  /** 청첩장 — 하얀 봉투에 하트 실링 */
  mail: (
    <>
      <rect x="2.75" y="5.25" width="18.5" height="13.5" rx="2" fill="#ffffff" stroke="#b08d68" {...S} />
      <path d="M3.6 6.6 12 12.4l8.4-5.8" fill="none" stroke="#b08d68" {...S} />
      <path d={smallHeart(12, 11.4, 1.25)} fill="#e07a70" />
    </>
  ),

  /** 인터뷰 — 파란 말풍선(신랑) + 분홍 말풍선(신부) */
  interview: (
    <>
      <path
        d="M5 3.75h9.5a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2H8.5l-3 2.5v-2.5H5a2 2 0 0 1-2-2v-5.5a2 2 0 0 1 2-2z"
        fill="#dbe6f2"
        stroke="#5f7d9c"
        {...S}
      />
      <path
        d="M10.5 9.25H19a2 2 0 0 1 2 2v4.75a2 2 0 0 1-2 2h-.5v2.5l-3-2.5h-5a2 2 0 0 1-2-2v-4.75a2 2 0 0 1 2-2z"
        fill="#f8dcd7"
        stroke="#b0675e"
        {...S}
      />
      <circle cx="12.4" cy="13.6" r=".75" fill="#b0675e" />
      <circle cx="14.75" cy="13.6" r=".75" fill="#b0675e" />
      <circle cx="17.1" cy="13.6" r=".75" fill="#b0675e" />
    </>
  ),

  /** 예식 안내 — 분홍 머리띠 달력에 하트 */
  info: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="#ffffff" />
      <path d="M3.5 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v2.75h-17z" fill="#f4bab2" />
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="none" stroke="#b0675e" {...S} />
      <path d="M8 3.25v3.5M16 3.25v3.5" stroke="#b0675e" {...S} strokeWidth={1.6} />
      <path d={smallHeart(12, 12.4, 1.55)} fill="#e07a70" />
    </>
  ),

  /** 웨딩 갤러리 — 겹친 사진 두 장, 초록 언덕과 노란 해 */
  gallery: (
    <>
      <rect x="6.25" y="3.5" width="14.25" height="11.5" rx="1.8" fill="#e3eee3" stroke="#5f8466" {...S} />
      <rect x="3.5" y="7.25" width="14.25" height="13" rx="1.8" fill="#ffffff" />
      <path d="M3.9 18.3 8.4 13.5l3.1 3.1 2-2 4 3.9v.5a1.3 1.3 0 0 1-1.3 1.3H5.2a1.3 1.3 0 0 1-1.3-1.3z" fill="#9cc2a1" />
      <circle cx="13.6" cy="10.9" r="1.45" fill="#ecc15c" />
      <rect x="3.5" y="7.25" width="14.25" height="13" rx="1.8" fill="none" stroke="#5f8466" {...S} />
    </>
  ),

  /** 우리의 시간 — 분홍 하트 */
  heart: (
    <>
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"
        fill="#f4aaa2"
        stroke="#c2564f"
        {...S}
      />
      <path d="M6.6 6.2a2.6 2.6 0 0 0-1.9 2.3" fill="none" stroke="#ffffff" {...S} strokeWidth={1.5} />
    </>
  ),

  /** 서로에게 — 노란 연필 */
  pen: (
    <g transform="rotate(-45 12 12)">
      <path d="M1.75 12 6 9.5v5z" fill="#f1d9b5" stroke="#9c7034" {...S} />
      <path d="M1.75 12 3.6 10.9v2.2z" fill="#5a4632" />
      <rect x="6" y="9.5" width="11.5" height="5" fill="#f2c94c" stroke="#9c7034" {...S} />
      <path d="M6.6 12h10.3" stroke="#d9a93a" strokeWidth={0.8} />
      <rect x="17.5" y="9.5" width="1.7" height="5" fill="#d8d0c3" stroke="#9c7034" {...S} />
      <path d="M19.2 9.5h1.8a1.2 1.2 0 0 1 1.2 1.2v2.6a1.2 1.2 0 0 1-1.2 1.2h-1.8z" fill="#ec9a93" stroke="#9c7034" {...S} />
    </g>
  ),

  /** 사진작가 — 하늘색 카메라 */
  camera: (
    <>
      <path d="M8.5 7.25 9.8 4.9h4.4l1.3 2.35" fill="#e1eef0" stroke="#4f8590" {...S} />
      <rect x="2.5" y="7.25" width="19" height="12.75" rx="2.5" fill="#e1eef0" stroke="#4f8590" {...S} />
      <circle cx="12" cy="13.6" r="4.1" fill="#ffffff" stroke="#4f8590" {...S} />
      <circle cx="12" cy="13.6" r="2.1" fill="#7fb0ba" />
      <circle cx="11.2" cy="12.8" r=".6" fill="#ffffff" />
      <circle cx="18.4" cy="9.9" r=".95" fill="#ecc15c" />
    </>
  ),

  /** 오시는 길 — 빨간 지도 핀 */
  pin: (
    <>
      <path
        d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"
        fill="#ee8173"
        stroke="#c4513f"
        {...S}
      />
      <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#c4513f" {...S} />
    </>
  ),

  /** 참석 여부 — 클립보드에 초록 체크 */
  rsvp: (
    <>
      <rect x="4.5" y="4" width="15" height="18" rx="2" fill="#f3e3c8" stroke="#9c7034" {...S} />
      <rect x="6.6" y="6.6" width="10.8" height="13.3" rx="1" fill="#ffffff" />
      <rect x="8.5" y="2.5" width="7" height="3.5" rx="1" fill="#c4a27c" stroke="#9c7034" {...S} />
      <path d="m9 13.4 2.2 2.2 4.3-4.6" fill="none" stroke="#3f8a5a" {...S} strokeWidth={1.8} />
    </>
  ),

  /** 마음 전하실 곳 — 분홍 선물 상자 */
  gift: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="1.2" fill="#f2dbe9" stroke="#946487" {...S} />
      <rect x="3" y="7.5" width="18" height="3.5" rx="1" fill="#e8c2da" stroke="#946487" {...S} />
      <rect x="10.8" y="7.5" width="2.4" height="13.5" fill="#e07a70" />
      <path d="M12 7.5C10 4 6.5 4.4 7.3 6.4c.4 1 2.7 1.1 4.7 1.1zM12 7.5c2-3.5 5.5-3.1 4.7-1.1-.4 1-2.7 1.1-4.7 1.1z" fill="#ef9a90" stroke="#c2564f" {...S} strokeWidth={1.2} />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type SectionIconName = keyof typeof ICONS;

export function SectionIcon({ name, size = 30 }: { name: SectionIconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className="mx-auto mb-3 block"
    >
      {ICONS[name]}
    </svg>
  );
}
