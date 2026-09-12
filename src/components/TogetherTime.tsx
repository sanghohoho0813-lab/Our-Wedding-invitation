"use client";

import { useEffect, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import { formatDotted, parseWeddingDate } from "@/lib/date";

/** "14년 23일 8시간 3분 47초" 형태로 흐르는 시간을 만든다. */
function elapsed(from: Date, now: Date) {
  let years = now.getFullYear() - from.getFullYear();
  const anniversary = new Date(from);
  anniversary.setFullYear(from.getFullYear() + years);
  if (anniversary > now) {
    years -= 1;
    anniversary.setFullYear(from.getFullYear() + years);
  }

  let rest = Math.floor((now.getTime() - anniversary.getTime()) / 1000);
  const days = Math.floor(rest / 86_400);
  rest -= days * 86_400;
  const hours = Math.floor(rest / 3_600);
  rest -= hours * 3_600;
  const minutes = Math.floor(rest / 60);
  const seconds = rest - minutes * 60;

  return `${years}년 ${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
}

/** 함께한 시간 — 1초마다 갱신되는 카운터. */
export function TogetherTime() {
  const { togetherTime } = wedding;
  const [text, setText] = useState("");

  useEffect(() => {
    if (!togetherTime.enabled || !togetherTime.startDate) return;

    const from = parseWeddingDate(togetherTime.startDate);
    const tick = () => setText(elapsed(from, new Date()));

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [togetherTime.enabled, togetherTime.startDate]);

  if (!togetherTime.enabled || !togetherTime.startDate) return null;

  return (
    <section className="edge pb-24 text-center" aria-label={togetherTime.heading}>
      <Reveal>
        <p className="text-[15px] tracking-[-0.01em] text-muted">{togetherTime.heading}</p>
        <p
          className="serif mt-4 text-[19px] leading-relaxed tracking-[0.01em] text-ink"
          aria-live="off"
          suppressHydrationWarning
        >
          {text || " "}
        </p>
        <p className="mt-3 text-[12.5px] tracking-[0.02em] text-faint">
          {formatDotted(togetherTime.startDate)} 부터
        </p>
      </Reveal>
    </section>
  );
}
