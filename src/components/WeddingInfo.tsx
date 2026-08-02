"use client";

import { useEffect, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import {
  buildMonthGrid,
  getDay,
  getDday,
  getYear,
  monthEn,
  weekdayEn,
  type DdayState,
} from "@/lib/date";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function ddayText(state: DdayState) {
  if (state.status === "today") return "TODAY";
  if (state.status === "after") return "WE ARE MARRIED";
  return `D-${state.days}`;
}

/**
 * 예식 정보 + 달력 + D-day 를 하나의 섹션으로 묶는다.
 * 날짜를 가장 크게 보여주고, 달력은 그 아래에서 보조적인 역할만 한다.
 */
export function WeddingInfo() {
  const date = wedding.wedding.date;
  const cells = buildMonthGrid(date);

  // D-day 는 방문자의 현재 시각 기준이므로 hydration 이후 계산한다.
  const [dday, setDday] = useState<DdayState | null>(null);
  useEffect(() => setDday(getDday(date)), [date]);

  return (
    <section className="edge pb-20 text-center" aria-labelledby="weddinginfo-heading">
      <Reveal>
        <p id="weddinginfo-heading" className="eyebrow">
          The Wedding Day
        </p>

        <p className="serif mt-7 text-[12px] uppercase tracking-[0.3em] text-muted">
          {getYear(date)} <span className="mx-1 text-line">·</span> {monthEn(date)}
        </p>

        <p className="serif mt-3 text-[52px] font-light leading-none tracking-[0.02em] text-ink">
          {getDay(date)}
        </p>

        <p className="mt-4 text-[13.5px] tracking-[0.04em] text-muted">
          <span className="serif uppercase tracking-[0.24em]">{weekdayEn(date)}</span>
          <span className="mx-2 text-line">·</span>
          {wedding.wedding.timeLabel}
        </p>

        <div className="hairline mx-auto mt-8 w-full max-w-[200px]" />

        <p className="mt-7 text-[16px] leading-snug tracking-[-0.01em] text-ink">
          {wedding.wedding.venue}
        </p>
        {wedding.wedding.hall && (
          <p className="mt-1.5 text-[13.5px] text-muted">{wedding.wedding.hall}</p>
        )}
      </Reveal>

      {/* 종이 달력처럼 작고 조용하게 */}
      <Reveal delay={0.08}>
        <div className="mx-auto mt-10 max-w-[292px]">
          <div className="grid grid-cols-7 text-center">
            {WEEKDAY_LABELS.map((label, i) => (
              <span
                key={i}
                className="serif pb-2 text-[9.5px] uppercase tracking-[0.14em] text-faint"
                aria-hidden="true"
              >
                {label}
              </span>
            ))}

            {cells.map((cell, i) =>
              cell.day === null ? (
                <span key={i} className="h-8" aria-hidden="true" />
              ) : (
                <span
                  key={i}
                  className={`flex h-8 items-center justify-center text-[12.5px] ${
                    cell.isWedding ? "text-paper" : "text-muted"
                  }`}
                >
                  {cell.isWedding ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper">
                      {cell.day}
                    </span>
                  ) : (
                    cell.day
                  )}
                </span>
              ),
            )}
          </div>

          <p
            className="serif mt-7 text-[15px] font-light tracking-[0.16em] text-ink"
            aria-live="polite"
          >
            {dday ? ddayText(dday) : " "}
          </p>
          {dday?.status === "before" && (
            <p className="mt-2 text-[12.5px] text-faint">
              {wedding.groom.firstName}, {wedding.bride.firstName}의 결혼식이 {dday.days}일
              남았습니다.
            </p>
          )}
          {dday?.status === "today" && (
            <p className="mt-2 text-[12.5px] text-faint">오늘은 저희가 결혼하는 날입니다.</p>
          )}
          {dday?.status === "after" && (
            <p className="mt-2 text-[12.5px] text-faint">함께해 주셔서 감사합니다.</p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
