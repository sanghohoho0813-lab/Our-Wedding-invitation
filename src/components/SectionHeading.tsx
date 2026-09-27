import { type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/Reveal";

type Props = {
  /** 섹션의 aria-labelledby 가 가리키는 id */
  id?: string;
  /**
   * 제목 위에 놓을 작은 아이콘.
   * 화려한 이모지 대신 선 아이콘을 베이지로 얹어 색이 튀지 않게 한다.
   */
  icon?: LucideIcon;
  title: string;
  /** 제목 아래 안내 문구 — 빈 문자열은 빈 줄로 표시됩니다. */
  body?: readonly string[];
  className?: string;
};

/** 레퍼런스처럼 "국문 세리프 제목 + 가운데 정렬 본문" 구조를 공통으로 쓴다. */
export function SectionHeading({ id, icon: Icon, title, body, className = "" }: Props) {
  return (
    <Reveal className={`text-center ${className}`}>
      {Icon && (
        <Icon
          size={19}
          strokeWidth={1.4}
          aria-hidden="true"
          className="mx-auto mb-3 text-accent-soft"
        />
      )}
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
