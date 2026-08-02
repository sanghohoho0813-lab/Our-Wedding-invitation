import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";

const GROUPS = [
  { key: "subway", label: "지하철" },
  { key: "bus", label: "버스" },
  { key: "parking", label: "주차" },
  { key: "etc", label: "기타" },
] as const;

/**
 * 정보량이 적으므로 접기/펼치기 없이 그대로 보여준다.
 * (항목이 크게 늘어나면 그때 Accordion 으로 감싸는 편이 좋다.)
 */
export function Transportation() {
  const data = wedding.transportation;

  return (
    <section className="edge pb-28" aria-labelledby="transportation-heading">
      <Reveal>
        <p id="transportation-heading" className="eyebrow text-center">
          Transportation
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <dl className="mt-11 flex flex-col gap-8">
          {GROUPS.map(({ key, label }) => {
            const lines = data[key];
            if (!lines || lines.length === 0) return null;

            return (
              <div key={key} className="flex gap-5">
                <dt className="w-[52px] shrink-0 pt-[3px] text-[12.5px] tracking-[0.02em] text-faint">
                  {label}
                </dt>
                <dd className="min-w-0 flex-1">
                  {lines.map((line, i) => (
                    <p
                      key={i}
                      className="text-[14.5px] leading-[1.85] tracking-[-0.01em] text-[#3d3b37]"
                    >
                      {line}
                    </p>
                  ))}
                </dd>
              </div>
            );
          })}
        </dl>
      </Reveal>
    </section>
  );
}
