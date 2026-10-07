"use client";

import { MessagesSquare } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding, type InterviewAnswer } from "@/config/wedding";

/**
 * 답변이 이어지면 누가 한 말인지 놓치기 쉬워서,
 * 신랑 · 신부에게 아주 옅은 두 톤을 나눠 준다. (톤은 globals.css)
 */
const WHO = {
  groom: { label: "신랑", box: "bg-tint-groom", ink: "text-tint-groom-ink" },
  bride: { label: "신부", box: "bg-tint-bride", ink: "text-tint-bride-ink" },
  both: { label: "", box: "", ink: "" },
} satisfies Record<InterviewAnswer["who"], { label: string; box: string; ink: string }>;

/** 웨딩 인터뷰 — 버튼을 누르면 질문·답변이 모달로 열린다. */
export function Interview() {
  const { interview } = wedding;
  const [open, setOpen] = useState(false);

  if (!interview.enabled || interview.qa.length === 0) return null;

  return (
    <section className="edge pb-24" aria-labelledby="interview-heading">
      <SectionHeading id="interview-heading" icon={MessagesSquare} tone="interview" title={interview.heading} body={interview.intro} />

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
        <dl className="space-y-9">
          {interview.qa.map((item, i) => (
            <div key={i}>
              <dt className="text-[14.5px] leading-relaxed tracking-[-0.01em] text-accent">
                Q. {item.q}
              </dt>
              {item.answers
                .filter((answer) => answer.text)
                .map((answer, j) => {
                  const who = WHO[answer.who];

                  return (
                    <dd
                      key={j}
                      className={`mt-3 rounded-[10px] ${who.box} ${who.box ? "px-4 py-3.5" : ""}`}
                    >
                      {who.label && (
                        <span className={`block text-[12px] tracking-[0.02em] ${who.ink}`}>
                          {who.label}
                        </span>
                      )}
                      <span
                        className={`block text-[14.5px] leading-[1.9] tracking-[-0.01em] text-[#4a473f] ${
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
