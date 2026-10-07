import { type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/Reveal";

/**
 * 섹션 아이콘 색.
 * 아이보리 위에서 튀지 않도록 채도를 낮춘 색만 쓰고,
 * 같은 계열의 아주 옅은 원을 뒤에 깔아 색이 은은하게 보이게 한다.
 */
export const ICON_TONES = {
  mail: { color: "#ffffff", bg: "#c4a27c" },
  interview: { color: "#5f7d9c", bg: "#e6edf4" },
  info: { color: "#b0675e", bg: "#f7e6e2" },
  gallery: { color: "#5f8466", bg: "#e6efe6" },
  heart: { color: "#c2564f", bg: "#f9e3e0", fill: "#f2b9b2" },
  pen: { color: "#9c7034", bg: "#f4e9d6" },
  camera: { color: "#4f8590", bg: "#e1eef0" },
  pin: { color: "#c4513f", bg: "#f8e2dc" },
  rsvp: { color: "#4f8a62", bg: "#e2efe5" },
  gift: { color: "#946487", bg: "#f2e5ee" },
} as const;

export type IconTone = keyof typeof ICON_TONES;

/** 색이 들어간 원형 아이콘 — 섹션 제목 위에 놓인다. */
export function SectionIcon({ icon: Icon, tone }: { icon: LucideIcon; tone: IconTone }) {
  const t: { color: string; bg: string; fill?: string } = ICON_TONES[tone];
  return (
    <span
      aria-hidden="true"
      className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full"
      style={{ backgroundColor: t.bg, color: t.color }}
    >
      <Icon size={20} strokeWidth={1.5} fill={t.fill ?? "none"} />
    </span>
  );
}

type Props = {
  /** 섹션의 aria-labelledby 가 가리키는 id */
  id?: string;
  /**
   * 제목 위에 놓을 작은 아이콘.
   * 화려한 이모지 대신 선 아이콘에 차분한 색을 얹는다.
   */
  icon?: LucideIcon;
  /** 아이콘 색 — ICON_TONES 중 하나 */
  tone?: IconTone;
  title: string;
  /** 제목 아래 안내 문구 — 빈 문자열은 빈 줄로 표시됩니다. */
  body?: readonly string[];
  className?: string;
};

/** 레퍼런스처럼 "국문 세리프 제목 + 가운데 정렬 본문" 구조를 공통으로 쓴다. */
export function SectionHeading({ id, icon, tone = "mail", title, body, className = "" }: Props) {
  return (
    <Reveal className={`text-center ${className}`}>
      {icon && <SectionIcon icon={icon} tone={tone} />}
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {body && body.length > 0 && (
        <div className="body-ko mt-8">
          {body.map((line, i) =>
            line === "" ? <div key={i} className="h-5" aria-hidden="true" /> : <p key={i}>{line}</p>,
          )}
        </div>
      )}
    </Reveal>
  );
}
