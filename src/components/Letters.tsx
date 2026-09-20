import { DraftMark } from "@/components/DraftMark";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding, type Letter } from "@/config/wedding";

/** 서로에게 — 신랑·신부가 서로에게 남기는 짧은 편지. */
export function Letters() {
  const { letters } = wedding;
  const items: readonly Letter[] = letters.items;
  if (!letters.enabled || items.length === 0) return null;

  return (
    <section className="edge pb-24" aria-labelledby="letters-heading">
      <SectionHeading title={letters.heading} />

      <div className="mt-9 space-y-4">
        {items.map((letter, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div className="card px-7 py-9 text-center">
              <p className="text-[12.5px] tracking-[0.04em] text-accent">{letter.label}</p>

              <div className="mt-6">
                {letter.body.map((line, j) =>
                  line === "" ? (
                    <div key={j} className="h-4" aria-hidden="true" />
                  ) : (
                    <p
                      key={j}
                      className="text-[14.5px] leading-[1.95] tracking-[-0.01em] text-[#4a473f]"
                    >
                      {line}
                    </p>
                  ),
                )}
              </div>

              <p className="mt-7 text-[12.5px] tracking-[0.02em] text-faint">
                {letter.from === "groom" ? wedding.groom.name : wedding.bride.name}
              </p>

              {letter.draft && <DraftMark status={letter.draft} className="mt-4" />}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
