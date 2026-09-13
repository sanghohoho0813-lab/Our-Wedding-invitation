"use client";

import { useState } from "react";

import { DraftMark } from "@/components/DraftMark";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { wedding, type InfoTab } from "@/config/wedding";

/**
 * 예식 안내 사항.
 * 항목이 둘 이상이면 탭으로 묶고, 하나뿐이면 탭 없이 제목만 보여준다.
 */
export function InfoTabs() {
  const { infoTabs } = wedding;
  const [active, setActive] = useState(0);

  if (!infoTabs.enabled || infoTabs.items.length === 0) return null;

  const current: InfoTab = infoTabs.items[active];
  const single = infoTabs.items.length === 1;

  return (
    <section className="pb-24" aria-label="예식 안내 사항">
      {single ? (
        <Reveal className="edge text-center">
          <h2 className="section-title">{current.label}</h2>
        </Reveal>
      ) : (
        <Reveal className="edge">
          <div role="tablist" aria-label="안내 항목" className="flex border-b border-line">
          {infoTabs.items.map((tab, i) => (
            <button
              key={tab.key}
              role="tab"
              type="button"
              id={`tab-${tab.key}`}
              aria-selected={i === active}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActive(i)}
              className={`tap relative flex-1 text-[14.5px] tracking-[-0.01em] transition-colors ${
                i === active ? "text-accent" : "text-faint"
              }`}
            >
              {tab.label}
              {i === active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-[1.5px] bg-accent"
                />
              )}
            </button>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal delay={0.06} className="edge mt-7">
        <div
          {...(single
            ? {}
            : { role: "tabpanel", id: `panel-${current.key}`, "aria-labelledby": `tab-${current.key}` })}
        >
          {current.image && (
            <PhotoSlot src={current.image} alt={current.imageAlt} ratio="4 / 3" />
          )}

          <div className={`text-center ${current.image ? "mt-7" : ""}`}>
            {current.body.map((line, i) =>
              line === "" ? (
                <div key={i} className="h-4" aria-hidden="true" />
              ) : (
                <p
                  key={i}
                  className="text-[14.5px] leading-[1.9] tracking-[-0.01em] text-[#4a473f]"
                >
                  {line}
                </p>
              ),
            )}

            {/* 시간표 — 시간이 채워진 항목만 보여준다. */}
            {(current.schedule ?? []).map((group) =>
              group.times.length === 0 ? null : (
                <div key={group.label} className="mt-7">
                  <p className="text-[13px] tracking-[0.02em] text-accent">{group.label}</p>
                  <p className="mt-2 text-[14px] leading-[1.9] tracking-[-0.01em] text-[#4a473f]">
                    {group.times.join("  ·  ")}
                  </p>
                </div>
              ),
            )}

            {current.note && (
              <p className="mt-6 text-[12.5px] leading-relaxed text-faint">{current.note}</p>
            )}

            {current.draft && <DraftMark status={current.draft} className="mt-3" />}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
