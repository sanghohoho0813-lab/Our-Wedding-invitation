"use client";

import { useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding, type InterviewAnswer } from "@/config/wedding";

const WHO_LABEL: Record<InterviewAnswer["who"], string> = {
  groom: "신랑",
  bride: "신부",
  both: "",
};

/** 웨딩 인터뷰 — 버튼을 누르면 질문·답변이 모달로 열린다. */
export function Interview() {
  const { interview } = wedding;
  const [open, setOpen] = useState(false);

  if (!interview.enabled || interview.qa.length === 0) return null;

  return (
    <section className="edge pb-24" aria-labelledby="interview-heading">
      <SectionHeading title={interview.heading} body={interview.intro} />

      <Reveal delay={0.06} className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-solid active:btn-solid-active"
        >
          {interview.buttonLabel}
        </button>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title={interview.heading}>
        <dl className="space-y-9">
          {interview.qa.map((item, i) => (
            <div key={i}>
              <dt className="text-[14.5px] leading-relaxed tracking-[-0.01em] text-accent">
                Q. {item.q}
              </dt>
              {item.answers
                .filter((answer) => answer.text)
                .map((answer, j) => (
                  <dd key={j} className="mt-3">
                    {WHO_LABEL[answer.who] && (
                      <span className="block text-[12px] tracking-[0.02em] text-faint">
                        {WHO_LABEL[answer.who]}
                      </span>
                    )}
                    <span className="mt-1 block text-[14.5px] leading-[1.9] tracking-[-0.01em] text-[#4a473f]">
                      {answer.text}
                    </span>
                  </dd>
                ))}
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
