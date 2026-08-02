import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import { formatDotted, getYear } from "@/lib/date";

/**
 * 마지막은 사진 없이 짧은 문구로 끝낸다.
 * (웨딩 사진은 GALLERY 한 곳에 모여 있으므로 여기서 반복하지 않는다.)
 */
export function Ending() {
  const date = wedding.wedding.date;

  return (
    <section className="edge pt-4 text-center" aria-label="맺음말">
      <Reveal>
        <div className="mx-auto h-10 w-px bg-line" aria-hidden="true" />

        <p className="serif mt-9 text-[17px] font-light italic tracking-[0.06em] text-muted">
          {wedding.ending.signature}
        </p>

        <p className="body-ko mt-7 whitespace-pre-line text-[16.5px]">{wedding.ending.message}</p>

        <p className="serif mt-12 text-[16px] font-light tracking-[0.06em] text-ink">
          {wedding.groom.name}
          <span className="mx-2.5 text-[12px] text-faint">×</span>
          {wedding.bride.name}
        </p>
        <p className="serif mt-3 text-[11px] tracking-[0.28em] text-faint">{formatDotted(date)}</p>
      </Reveal>

      <footer className="pt-16 pb-[max(env(safe-area-inset-bottom),22px)]">
        <p className="text-[11px] tracking-[0.06em] text-faint">
          © {getYear(date)} {wedding.groom.name} &amp; {wedding.bride.name}
        </p>
      </footer>
    </section>
  );
}
