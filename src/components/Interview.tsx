"use client";

import { useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding, type InterviewAnswer } from "@/config/wedding";

/**
 * 답변이 이어지면 누가 한 말인지 놓치기 쉬워서,
 * 신랑은 옅은 파랑, 신부는 옅은 분홍으로 확실히 나눈다. (톤은 globals.css)
 * 왼쪽 굵은 선이 있어 색을 잘 구분하지 못해도 칸이 나뉘어 보인다.
 */
const WHO = {
  groom: {
    label: "신랑",
    box: "border-l-[3px] border-tint-groom-line bg-tint-groom",
    ink: "text-tint-groom-ink",
  },
  bride: {
    label: "신부",
    box: "border-l-[3px] border-tint-bride-line bg-tint-bride",
    ink: "text-tint-bride-ink",
  },
  both: { label: "", box: "border border-line bg-white", ink: "" },
} satisfies Record<InterviewAnswer["who"], { label: string; box: string; ink: string }>;

/** 웨딩 인터뷰 — 버튼을 누르면 질문·답변이 모달로 열린다. */
export function Interview() {
  const { interview } = wedding;
  const [open, setOpen] = useState(false);

  if (!interview.enabled || interview.qa.length === 0) return null;

  return (
    <section className="edge pb-24" aria-labelledby="interview-heading">
      <SectionHeading id="interview-heading" icon="interview" title={interview.heading} body={interview.intro} />

      <Reveal delay={0.06} className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-solid glow-hint active:btn-solid-active"
        >
          {interview.buttonLabel}
        </button>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title={interview.heading}>
        <dl>
          {interview.qa.map((item, i) => (
            <div key={i} className={i === 0 ? "" : "mt-8 border-t border-line pt-8"}>
              <dt className="flex gap-2 text-[15.5px] font-medium leading-[1.6] tracking-[-0.015em] text-ink">
                <span className="latin shrink-0 text-accent-deep" aria-hidden="true">
                  Q.
                </span>
                <span>{item.q}</span>
              </dt>
              {item.answers
                .filter((answer) => answer.text)
                .map((answer, j) => {
                  const who = WHO[answer.who];

                  return (
                    <dd key={j} className={`mt-3 rounded-[10px] px-4 py-3.5 ${who.box}`}>
                      {who.label && (
                        <span
                          className={`block text-[12.5px] font-medium tracking-[0.02em] ${who.ink}`}
                        >
                          {who.label}
                        </span>
                      )}
                      <span
                        className={`block text-[15px] leading-[1.85] tracking-[-0.015em] text-ink ${
                          who.label ? "mt-1" : ""
                        }`}
                      >
                        {answer.text}
                      </span>
                    </dd>
                  );
                })}
            </div>
          ))}
        </dl>

        {/* 신랑 답변이 모두 채워지면 config 의 pendingNote 를 비우세요. */}
        {interview.pendingNote && (
          <p className="mt-9 border-t border-line pt-6 text-center text-[12px] leading-relaxed text-faint">
            {interview.pendingNote}
          </p>
        )}
      </Modal>
    </section>
  );
}
