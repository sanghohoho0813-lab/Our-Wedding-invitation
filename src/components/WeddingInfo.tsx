import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/config/wedding";
import { buildMonthGrid, getMonth, weekdayKo } from "@/lib/date";

const WEEKDAY_KO_SHORT = ["일", "월", "화", "수", "목", "금", "토"];

/** 예식 안내 — 일시·장소 + 사진 + 종이 달력. */
export function WeddingInfo() {
  const date = wedding.wedding.date;
  const [year, month, day] = date.split("-").map(Number);
  const cells = buildMonthGrid(date);

  return (
    <section className="edge pb-24" aria-labelledby="weddinginfo-heading">
      <SectionHeading title="예식 안내" />

      <Reveal className="mt-8 text-center">
        <p className="text-[16px] leading-relaxed tracking-[-0.01em] text-[#4a473f]">
          {year}년 {month}월 {day}일 {weekdayKo(date)} {wedding.wedding.timeLabel}
        </p>
        <p className="mt-1.5 text-[16px] leading-relaxed tracking-[-0.01em] text-[#4a473f]">
          {wedding.wedding.venue}
          {wedding.wedding.hall && ` ${wedding.wedding.hall}`}
        </p>
      </Reveal>

      <Reveal delay={0.06} className="mt-9">
        <PhotoSlot src={wedding.wedding.image} alt={wedding.wedding.imageAlt} ratio="4 / 5" />
      </Reveal>

      {/* 달력 */}
      <Reveal delay={0.08}>
        <p className="serif mt-12 text-center text-[17px] text-accent">{getMonth(date)}월</p>

        <div className="mx-auto mt-6 grid max-w-[320px] grid-cols-7 text-center">
          {WEEKDAY_KO_SHORT.map((label, i) => (
            <span
              key={i}
              className={`pb-3 text-[13px] ${i === 0 ? "text-accent-soft" : "text-faint"}`}
              aria-hidden="true"
            >
              {label}
            </span>
          ))}

          {cells.map((cell, i) =>
            cell.day === null ? (
              <span key={i} className="h-10" aria-hidden="true" />
            ) : (
              <span
                key={i}
                className={`flex h-10 items-center justify-center text-[14px] ${
                  cell.isWedding ? "text-white" : "text-muted"
                }`}
              >
                {cell.isWedding ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-white">
                    {cell.day}
                  </span>
                ) : (
                  cell.day
                )}
              </span>
            ),
          )}
        </div>
      </Reveal>
    </section>
  );
}
