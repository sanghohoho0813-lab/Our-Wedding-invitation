import { DraftMark } from "@/components/DraftMark";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding, type TimelineItem } from "@/config/wedding";

/** 본문 안의 강조 문구만 형광펜 처리한다. */
function Body({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) {
    return <>{text}</>;
  }
  const [before, ...rest] = text.split(highlight);
  return (
    <>
      {before}
      <span className="marker">{highlight}</span>
      {rest.join(highlight)}
    </>
  );
}

/** 우리의 시간 — 좌우로 번갈아 놓이는 타임라인. */
export function Timeline() {
  const { timeline } = wedding;
  // 항목에 draft 가 하나도 없어도 타입이 좁혀지지 않도록 명시한다.
  const items: readonly TimelineItem[] = timeline.items;
  if (!timeline.enabled || items.length === 0) return null;

  return (
    <section className="edge pb-24" aria-labelledby="timeline-heading">
      <SectionHeading title={timeline.heading} />

      <div className="relative mt-12">
        {/* 가운데 세로선 */}
        <div
          aria-hidden="true"
          className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-line"
        />

        <ol className="space-y-10">
          {items.map((item, i) => {
            const photoLeft = i % 2 === 0;

            return (
              <li key={i}>
                <Reveal>
                  <div className="relative grid grid-cols-2 items-center gap-5">
                    {/* 가운데 점 */}
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft"
                    />

                    {/* 사진이 아직 없는 항목은 빈 자리 대신 날짜만 크게 둔다 */}
                    <div className={photoLeft ? "order-1" : "order-2"}>
                      {item.image ? (
                        <>
                          <PhotoSlot
                            src={item.image}
                            alt={`${item.title} 사진`}
                            ratio="1 / 1"
                            sizes="(max-width: 520px) 42vw, 220px"
                          />
                          <p className="mt-2.5 text-center text-[11.5px] tracking-[0.02em] text-faint">
                            {item.date}
                          </p>
                        </>
                      ) : (
                        <p className="latin text-center text-[16px] tracking-[0.06em] text-accent">
                          {item.date}
                        </p>
                      )}
                    </div>

                    <div className={`${photoLeft ? "order-2" : "order-1"} text-center`}>
                      <p className="text-[14.5px] tracking-[-0.01em] text-ink">{item.title}</p>
                      <p className="mt-2.5 text-[13.5px] leading-[1.75] text-muted">
                        <Body text={item.body} highlight={item.highlight} />
                      </p>
                      {item.draft && <DraftMark status={item.draft} className="mt-2.5" />}
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
