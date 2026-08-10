"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { wedding } from "@/config/wedding";
import { getDday, type DdayState } from "@/lib/date";

function ddayText(state: DdayState) {
  if (state.status === "today") return "TODAY";
  if (state.status === "after") return "WE ARE MARRIED";
  return `D-${state.days}`;
}

/** 사진 위에 D-day 하나만 크게 얹는 배너. */
export function DdayBanner() {
  const { ddayBanner } = wedding;
  const date = wedding.wedding.date;
  const [year, month, day] = date.split("-").map(Number);

  // 방문자의 현재 시각 기준이므로 hydration 이후 계산한다.
  const [dday, setDday] = useState<DdayState | null>(null);
  useEffect(() => setDday(getDday(date)), [date]);

  if (!ddayBanner.enabled) return null;

  const hasPhoto = Boolean(ddayBanner.image);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={hasPhoto ? { aspectRatio: "4 / 3" } : undefined}
      aria-label="결혼식까지 남은 날"
    >
      {hasPhoto && (
        <>
          <Image
            src={ddayBanner.image}
            alt={ddayBanner.imageAlt}
            fill
            sizes="(max-width: 520px) 100vw, 520px"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(24,22,19,0.5) 0%, rgba(24,22,19,0.14) 55%, rgba(24,22,19,0) 100%)",
            }}
          />
        </>
      )}

      <div className={`edge text-center ${hasPhoto ? "absolute inset-x-0 bottom-0 pb-6" : "pb-24"}`}>
        <p
          className={`latin text-[38px] font-light leading-none tracking-[0.04em] ${
            hasPhoto ? "text-white" : "text-ink"
          }`}
          aria-live="polite"
          style={hasPhoto ? { textShadow: "0 1px 14px rgba(20,18,15,0.45)" } : undefined}
        >
          {dday ? ddayText(dday) : " "}
        </p>
        <p
          className={`mt-3 text-[14px] ${hasPhoto ? "text-white/85" : "text-muted"}`}
          style={hasPhoto ? { textShadow: "0 1px 12px rgba(20,18,15,0.45)" } : undefined}
        >
          {year}년 {month}월 {day}일
        </p>
      </div>
    </section>
  );
}
