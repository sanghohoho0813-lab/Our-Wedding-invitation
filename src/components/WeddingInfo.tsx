import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import { formatDotted, weekdayKo } from "@/lib/date";

export function WeddingInfo() {
  const date = wedding.wedding.date;

  return (
    <section className="edge pt-28 text-center" aria-labelledby="weddinginfo-heading">
      <Reveal>
        <p id="weddinginfo-heading" className="eyebrow">
          The Wedding Day
        </p>

        <p className="serif mt-7 text-[38px] font-light leading-none tracking-[0.02em] text-ink">
          {formatDotted(date)}
        </p>
        <p className="mt-4 text-[14px] tracking-[0.06em] text-muted">
          {weekdayKo(date)} · {wedding.wedding.timeLabel}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="hairline mx-auto mt-10 w-full max-w-[220px]" />

        <p className="mt-9 text-[17px] leading-snug tracking-[-0.01em] text-ink">
          {wedding.wedding.venue}
        </p>
        <p className="mt-1.5 text-[14px] text-muted">{wedding.wedding.hall}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-faint">{wedding.wedding.address}</p>
      </Reveal>
    </section>
  );
}
