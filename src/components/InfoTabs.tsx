"use client";

import { useState } from "react";

import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { wedding } from "@/config/wedding";

/** 주차안내 / 포토부스 / 답례품 — 탭으로 묶어 세로 길이를 줄인다. */
export function InfoTabs() {
  const { infoTabs } = wedding;
  const [active, setActive] = useState(0);

  if (!infoTabs.enabled || infoTabs.items.length === 0) return null;

  const current = infoTabs.items[active];

  return (
    <section className="pb-24" aria-label="예식 안내 사항">
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

      <Reveal delay={0.06} className="edge mt-7">
        <div role="tabpanel" id={`panel-${current.key}`} aria-labelledby={`tab-${current.key}`}>
          <PhotoSlot src={current.image} alt={current.imageAlt} ratio="4 / 3" />

          <div className="mt-7 text-center">
            {current.body.map((line, i) => (
              <p
                key={i}
                className="text-[14.5px] leading-[1.9] tracking-[-0.01em] text-[#4a473f]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
