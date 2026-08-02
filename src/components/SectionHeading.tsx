import { Reveal } from "@/components/Reveal";

type Props = {
  title: string;
  /** 제목 아래 안내 문구 — 빈 문자열은 빈 줄로 표시됩니다. */
  body?: readonly string[];
  className?: string;
};

/** 레퍼런스처럼 "국문 세리프 제목 + 가운데 정렬 본문" 구조를 공통으로 쓴다. */
export function SectionHeading({ title, body, className = "" }: Props) {
  return (
    <Reveal className={`text-center ${className}`}>
      <h2 className="section-title">{title}</h2>
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
