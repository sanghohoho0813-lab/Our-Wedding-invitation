import { DraftMark } from "@/components/DraftMark";
import { PhotoGridBody } from "@/components/PhotoGrid";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding, type GalleryImage, type TimelineItem } from "@/config/wedding";
import { parseWeddingDate } from "@/lib/date";

/**
 * 본문의 {days} 를 "연인이 된 날 → 예식일" 날수로 바꾼다.
 * 날짜를 고치면 숫자도 따라 바뀌므로 직접 세어 넣지 않아도 된다.
 */
function fillTokens(text: string | undefined) {
  if (!text || !text.includes("{days}")) return text;

  const from = wedding.togetherTime.startDate;
  if (!from) return text.replace(/\{days\}/g, "");

  const start = parseWeddingDate(from);
  const end = parseWeddingDate(wedding.wedding.date);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return text.replace(/\{days\}/g, days.toLocaleString("ko-KR"));
}

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

/**
 * 타임라인 한 묶음.
 * 가운데 세로선은 이 묶음 안에서만 이어지므로,
 * 사진이 중간에 들어가면 선도 자연스럽게 끊겼다 이어진다.
 */
function TimelineList({
  items,
  startIndex,
  className,
}: {
  items: readonly TimelineItem[];
  startIndex: number;
  className: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* 가운데 세로선 */}
      <div
        aria-hidden="true"
        className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-line"
      />

      <ol className="space-y-10">
        {items.map((item, i) => {
          // 앞 묶음에서 이어지는 번호라야 좌우 교차가 끊기지 않는다.
          const photoLeft = (startIndex + i) % 2 === 0;

          return (
            <li key={startIndex + i}>
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
                      <Body
                        text={fillTokens(item.body) ?? item.body}
                        highlight={fillTokens(item.highlight)}
                      />
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
  );
}

/**
 * 우리의 시간.
 *
 * 첫 만남 → 연인 → (그동안 찍은 일상 사진) → 결혼 순으로
 * 한 흐름 안에서 보여준다. 사진 위치는 config 의 timeline.photosAfter 로 정한다.
 */
export function Timeline() {
  const { timeline, dailyGallery } = wedding;
  // 항목에 draft 가 하나도 없어도 타입이 좁혀지지 않도록 명시한다.
  const items: readonly TimelineItem[] = timeline.items;
  const photos: readonly GalleryImage[] = dailyGallery.enabled ? dailyGallery.images : [];

  if (!timeline.enabled || items.length === 0) return null;

  const splitAt = photos.length > 0 ? timeline.photosAfter + 1 : items.length;
  const before = items.slice(0, splitAt);
  const after = items.slice(splitAt);
  const showPhotos = photos.length > 0 && splitAt < items.length + 1;

  return (
    <section className="edge pb-24" aria-labelledby="timeline-heading">
      <SectionHeading id="timeline-heading" title={timeline.heading} />

      <TimelineList items={before} startIndex={0} className="mt-12" />

      {showPhotos && (
        <div className="mt-14">
          {timeline.photosHeading && (
            <Reveal className="text-center">
              <p className="text-[13px] tracking-[0.04em] text-accent">{timeline.photosHeading}</p>
            </Reveal>
          )}
          <PhotoGridBody images={photos} className="mt-6" />
        </div>
      )}

      <TimelineList items={after} startIndex={before.length} className="mt-14" />
    </section>
  );
}
