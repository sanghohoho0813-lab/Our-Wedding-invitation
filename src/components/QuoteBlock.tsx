import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";

/** 사진 한 장 + 짧은 인용구. */
export function QuoteBlock() {
  const { quote } = wedding;
  if (!quote.enabled) return null;

  return (
    <section className="pb-24" aria-label="인용구">
      <Reveal>
        <PhotoSlot src={quote.image} alt={quote.imageAlt} ratio="4 / 5" rounded={false} />
      </Reveal>

      <Reveal className="edge mt-16 text-center">
        {quote.en.length > 0 && (
          <div className="latin text-[15px] leading-[1.8] tracking-[0.01em] text-muted">
            {quote.en.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        <div className={`body-ko ${quote.en.length > 0 ? "mt-7" : ""}`}>
          {quote.ko.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {quote.source && <p className="mt-7 text-[13px] text-faint">{quote.source}</p>}
      </Reveal>
    </section>
  );
}
