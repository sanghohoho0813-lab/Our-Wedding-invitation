import Image from "next/image";

import { wedding } from "@/config/wedding";
import { formatDotted, weekdayEn, weekdayKo } from "@/lib/date";

/**
 * 첫 화면.
 * QR로 처음 들어온 사람이 가장 먼저 보는 영역이므로
 * JS 없이(=서버 HTML + CSS 만으로) 완성된 화면이 나오도록 만든다.
 * 등장 애니메이션도 CSS keyframes 로 처리한다.
 */
export function Hero() {
  const { groom, bride } = wedding;
  const date = wedding.wedding.date;

  return (
    <section
      className="relative w-full overflow-hidden bg-paper-deep"
      style={{ height: "88svh", minHeight: "540px" }}
      aria-label="메인 화면"
    >
      <div className="hero-photo absolute inset-0">
        <Image
          src={wedding.images.hero}
          alt={wedding.images.heroAlt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 520px) 100vw, 520px"
          className="object-cover"
          style={{ objectPosition: wedding.images.heroPosition }}
        />
      </div>

      {/* 텍스트 가독성을 위한 최소한의 scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[58%]"
        style={{
          background:
            "linear-gradient(to top, rgba(24,22,19,0.66) 0%, rgba(24,22,19,0.42) 26%, rgba(24,22,19,0.12) 62%, rgba(24,22,19,0) 100%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 edge pb-[max(env(safe-area-inset-bottom),18px)]">
        <div className="hero-copy pb-14 text-center text-white">
          <p className="serif text-[10.5px] font-medium uppercase tracking-[0.42em] text-white/75">
            Our Wedding Day
          </p>

          <h1 className="mt-5 serif text-[30px] font-light leading-none tracking-[0.02em]">
            <span>{groom.name}</span>
            <span className="mx-3 inline-block translate-y-[-3px] text-[18px] text-white/60">·</span>
            <span>{bride.name}</span>
          </h1>

          <div className="mx-auto mt-6 h-px w-9 bg-white/40" />

          <p className="mt-6 text-[12.5px] font-light tracking-[0.16em] text-white/85">
            {formatDotted(date)} <span className="mx-1 text-white/50">|</span> {weekdayKo(date)}{" "}
            {wedding.wedding.timeLabel}
          </p>
          <p className="serif mt-1.5 text-[10.5px] uppercase tracking-[0.34em] text-white/55">
            {weekdayEn(date)}
          </p>
        </div>
      </div>

      {/* 아주 작은 스크롤 인디케이터 */}
      <div
        aria-hidden="true"
        className="hero-indicator absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),16px)] flex justify-center"
      >
        <span className="relative block h-8 w-px overflow-hidden bg-white/25">
          <span className="hero-indicator-bar absolute inset-x-0 top-0 block h-3 bg-white/80" />
        </span>
      </div>
    </section>
  );
}
