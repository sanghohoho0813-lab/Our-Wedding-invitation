"use client";

import { useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/config/wedding";

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
        {/* 답변이 모두 두 분의 것으로 바뀌면 config 의 interview.draft 를 지우세요. */}
        {interview.draft && (
          <p className="-mt-1 mb-7 rounded-[6px] border border-line bg-paper-deep px-4 py-3 text-center text-[12px] leading-relaxed text-faint">
            [{interview.noticeText}]
          </p>
        )}

        <dl className="space-y-8">
          {interview.qa.map((item, i) => (
            <div key={i}>
              <dt className="text-[14.5px] leading-relaxed tracking-[-0.01em] text-accent">
                Q. {item.q}
              </dt>
              <dd className="mt-2.5 text-[14.5px] leading-[1.9] tracking-[-0.01em] text-[#4a473f]">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </Modal>
    </section>
  );
}
