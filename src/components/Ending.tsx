import { DraftMark } from "@/components/DraftMark";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { wedding, type GalleryImage } from "@/config/wedding";
import { formatDotted, getYear } from "@/lib/date";

export function Ending() {
  const date = wedding.wedding.date;
  const { ending } = wedding;
  const endingImages: readonly GalleryImage[] = ending.images;
  const credit: readonly string[] = ending.credit;
  const farewell: readonly string[] = ending.farewell;
  const creditLead: string = ending.creditLead;

  return (
    <section aria-label="맺음말">
      {endingImages.length > 0 && (
        <Reveal>
          <div className="flex flex-col">
            {endingImages.map((image, i) => (
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

          {/* 하객분들께 드리는 인사 */}
          {farewell.length > 0 && (
            <div className="mt-12">
              <div className="mx-auto mb-9 h-px w-8 bg-line" aria-hidden="true" />
              {farewell.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-4" aria-hidden="true" />
                ) : (
                  <p
                    key={i}
                    className="text-[14.5px] leading-[1.95] tracking-[-0.01em] text-[#4a473f]"
                  >
                    {line}
                  </p>
                ),
              )}
              {ending.farewellSign && (
                <p className="mt-6 text-[13.5px] tracking-[0.02em] text-muted">
                  {ending.farewellSign}
                </p>
              )}
              {ending.farewellDraft && (
                <DraftMark status={ending.farewellDraft} className="mt-5" />
              )}
            </div>
          )}

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
        {(creditLead || credit.length > 0) && (
          <>
            <div className="mx-auto mb-6 h-6 w-px bg-line" aria-hidden="true" />

            {creditLead && (
              <p className="serif text-[13px] leading-[1.7] tracking-[0.01em] text-accent-deep">
                {creditLead}
              </p>
            )}

            {credit.length > 0 && (
              <p className="mt-2.5 text-[11.5px] leading-[1.8] tracking-[0.01em] text-faint">
                {credit.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
          </>
        )}

        <p className="mt-6 text-[11px] tracking-[0.06em] text-faint">
          © {getYear(date)} {wedding.groom.name} &amp; {wedding.bride.name}
        </p>
      </footer>
    </section>
  );
}
