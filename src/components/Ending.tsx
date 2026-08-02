import Image from "next/image";

import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import { formatDotted } from "@/lib/date";

export function Ending() {
  return (
    <section aria-label="맺음말">
      <Reveal>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep">
          <Image
            src={wedding.images.ending}
            alt={wedding.images.endingAlt}
            fill
            sizes="(max-width: 520px) 100vw, 520px"
            className="object-cover object-[50%_45%]"
          />
        </div>
      </Reveal>

      <div className="edge pt-20 pb-24 text-center">
        <Reveal>
          <p className="body-ko whitespace-pre-line text-[16.5px]">{wedding.ending.message}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="serif mt-14 text-[17px] font-light italic tracking-[0.06em] text-muted">
            {wedding.ending.signature}
          </p>

          <div className="mx-auto mt-12 h-10 w-px bg-line" aria-hidden="true" />

          <p className="serif mt-10 text-[16px] font-light tracking-[0.06em] text-ink">
            {wedding.groom.name}
            <span className="mx-2.5 text-[12px] text-faint">×</span>
            {wedding.bride.name}
          </p>
          <p className="serif mt-3 text-[11px] tracking-[0.28em] text-faint">
            {formatDotted(wedding.wedding.date)}
          </p>
        </Reveal>
      </div>

      <footer className="edge pb-[max(env(safe-area-inset-bottom),24px)] text-center">
        <p className="text-[11px] tracking-[0.06em] text-faint">
          © {formatDotted(wedding.wedding.date).slice(0, 4)} {wedding.groom.name} &{" "}
          {wedding.bride.name}
        </p>
      </footer>
    </section>
  );
}
