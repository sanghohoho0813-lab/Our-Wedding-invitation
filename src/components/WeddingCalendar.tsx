"use client";

import { useEffect, useState } from "react";

import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import { buildMonthGrid, getDday, getMonth, getYear, type DdayState } from "@/lib/date";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function ddayText(state: DdayState) {
  if (state.status === "today") return "TODAY";
  if (state.status === "after") return "WE ARE MARRIED";
  return `D-${state.days}`;
}

export function WeddingCalendar() {
  const date = wedding.wedding.date;
  const cells = buildMonthGrid(date);

  // D-day 는 사용자의 현재 시각 기준이므로 hydration 이후 계산한다.
  const [dday, setDday] = useState<DdayState | null>(null);
  useEffect(() => setDday(getDday(date)), [date]);

  return (
    <section className="edge pt-16 pb-28" aria-label="예식 날짜 달력">
      <Reveal>
        <div className="mx-auto max-w-[320px]">
          <p className="serif text-center text-[13px] uppercase tracking-[0.3em] text-muted">
            {getYear(date)} . {String(getMonth(date)).padStart(2, "0")}
          </p>

          <div className="mt-7 grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAY_LABELS.map((label, i) => (
              <span
                key={i}
                className="serif pb-3 text-[10px] uppercase tracking-[0.16em] text-faint"
                aria-hidden="true"
              >
                {label}
              </span>
            ))}

            {cells.map((cell, i) =>
              cell.day === null ? (
                <span key={i} className="h-9" aria-hidden="true" />
              ) : (
                <span
                  key={i}
                  className={`flex h-9 items-center justify-center text-[13.5px] ${
                    cell.isWedding ? "text-paper" : cell.weekday === 0 ? "text-faint" : "text-muted"
                  }`}
                >
                  {cell.isWedding ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
                      {cell.day}
                    </span>
                  ) : (
                    cell.day
                  )}
                </span>
              ),
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-14 text-center">
          <p className="eyebrow">Our Day</p>
          <p
            className="serif mt-4 text-[26px] font-light leading-none tracking-[0.08em] text-ink"
            aria-live="polite"
          >
            {dday ? ddayText(dday) : " "}
          </p>
          {dday?.status === "before" && (
            <p className="mt-4 text-[13.5px] text-muted">
              {wedding.groom.firstName}, {wedding.bride.firstName}의 결혼식이{" "}
              <span className="text-ink">{dday.days}일</span> 남았습니다.
            </p>
          )}
          {dday?.status === "today" && (
            <p className="mt-4 text-[13.5px] text-muted">오늘은 저희가 결혼하는 날입니다.</p>
          )}
          {dday?.status === "after" && (
            <p className="mt-4 text-[13.5px] text-muted">함께해 주셔서 감사합니다.</p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
