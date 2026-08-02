import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";
import { formatDotted, getYear } from "@/lib/date";

export function Ending() {
  const date = wedding.wedding.date;
  const { ending } = wedding;

  return (
    <section aria-label="맺음말">
      {ending.images.length > 0 && (
        <Reveal>
          <div className="flex flex-col">
            {ending.images.map((image, i) => (
              <PhotoSlot
                key={i}
                src={image.src}
                alt={image.alt}
                ratio="4 / 3"
                rounded={false}
                objectPosition={image.objectPosition ?? "center"}
              />
            ))}
          </div>
        </Reveal>
      )}

      <div className="edge pt-20 text-center">
        <Reveal>
          <p className="latin text-[18px] font-light italic tracking-[0.06em] text-accent">
            {ending.signature}
          </p>
          <p className="body-ko mt-7 whitespace-pre-line">{ending.message}</p>

          <p className="serif mt-12 text-[16px] tracking-[0.02em] text-ink">
            {wedding.groom.name}
            <span className="mx-2.5 text-[12px] text-faint">×</span>
            {wedding.bride.name}
          </p>
          <p className="latin mt-3 text-[12px] tracking-[0.24em] text-faint">
            {formatDotted(date)}
          </p>
        </Reveal>
      </div>

      <footer className="edge pt-16 pb-[max(env(safe-area-inset-bottom),26px)] text-center">
        <p className="text-[11px] tracking-[0.06em] text-faint">
          © {getYear(date)} {wedding.groom.name} &amp; {wedding.bride.name}
        </p>
      </footer>
    </section>
  );
}
