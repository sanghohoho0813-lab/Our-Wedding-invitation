import Image from "next/image";

import { wedding } from "@/config/wedding";
import { formatDotted, weekdayKo } from "@/lib/date";
import { venueLine } from "@/lib/venue";

/**
 * 첫 화면.
 * QR로 처음 들어온 사람이 가장 먼저 보는 영역이므로
 * JS 없이(=서버 HTML + CSS 만으로) 완성된 화면이 나오도록 만든다.
 */
export function Hero() {
  const { hero } = wedding;
  const date = wedding.wedding.date;

  return (
    <section
      className="relative w-full overflow-hidden bg-paper-deep"
      style={{ height: "92svh", minHeight: "560px" }}
      aria-label="메인 화면"
    >
      <div className="hero-photo absolute inset-0">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 520px) 100vw, 520px"
          className="object-cover"
          style={{ objectPosition: hero.imagePosition }}
        />
      </div>

      {/* 위아래 최소한의 scrim — 위는 제목, 아래는 날짜/문구 가독성용 */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[42%]"
        style={{
          background: "linear-gradient(to bottom, rgba(24,22,19,0.32) 0%, rgba(24,22,19,0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[46%]"
        style={{
          background:
            "linear-gradient(to top, rgba(24,22,19,0.62) 0%, rgba(24,22,19,0.32) 34%, rgba(24,22,19,0) 100%)",
        }}
      />

      {/* 필기체 제목 */}
      <div className="absolute inset-x-0 top-0 edge pt-[max(env(safe-area-inset-top),58px)]">
        <h1 className="hero-title script text-center text-white">
          {hero.title.map((line, i) => (
            <span
              key={i}
              className="block text-[46px] leading-[1.06]"
              style={{ marginLeft: i === 1 ? "0.6em" : i === 2 ? "1.6em" : 0 }}
            >
              {line}
            </span>
          ))}
        </h1>
      </div>

      {/* 날짜 + 문구 */}
      <div className="absolute inset-x-0 bottom-0 edge pb-[max(env(safe-area-inset-bottom),18px)]">
        <div className="hero-copy pb-12 text-center text-white">
          {/* 예식 일시·장소 — 첫 화면에서 바로 확인할 수 있게 */}
          <p className="text-[16.5px] leading-snug tracking-[0.01em] text-white">
            {formatDotted(date)}
            <span className="mx-2 text-white/60">·</span>
            {weekdayKo(date)} {wedding.wedding.timeLabel}
          </p>
          <p className="mt-2 text-[14.5px] leading-snug tracking-[-0.01em] text-white/90">
            {venueLine()}
          </p>

          {hero.caption.length > 0 && (
            <>
              <div className="mx-auto mt-6 h-px w-8 bg-white/35" aria-hidden="true" />
              <div className="latin mt-6 text-[14px] leading-[1.65] tracking-[0.01em] text-white/80">
                {hero.caption.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 아주 작은 스크롤 인디케이터 */}
      <div
        aria-hidden="true"
        className="hero-indicator absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),14px)] flex justify-center"
      >
        <span className="relative block h-7 w-px overflow-hidden bg-white/25">
          <span className="hero-indicator-bar absolute inset-x-0 top-0 block h-3 bg-white/80" />
        </span>
      </div>
    </section>
  );
}
