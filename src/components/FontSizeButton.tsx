"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/components/Toast";
import { FONT_SIZE_KEY, FONT_SIZE_STEPS as STEPS, type FontSizeStep as Step } from "@/lib/fontSize";

/**
 * 글자 크기 버튼 — 누를 때마다 100% → 110% → 120% → 100%.
 * 연세가 있으신 분들도 편히 읽으시도록 청첩장 안의 모든 글자가 함께 커진다.
 * 실제 배율은 globals.css 의 --fs 가 맡는다.
 */
export function FontSizeButton() {
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>("100");

  useEffect(() => {
    const current = document.documentElement.dataset.fs;
    if (current === "110" || current === "120") setStep(current);
  }, []);

  const next = () => {
    const value = STEPS[(STEPS.indexOf(step) + 1) % STEPS.length];
    setStep(value);
    if (value === "100") delete document.documentElement.dataset.fs;
    else document.documentElement.dataset.fs = value;
    try {
      localStorage.setItem(FONT_SIZE_KEY, value);
    } catch {}
    showToast(value === "100" ? "글자 크기를 기본으로 돌렸어요." : `글자를 ${value}% 로 키웠어요.`);
  };

  return (
    <button
      type="button"
      onClick={next}
      aria-label={`글자 크기 바꾸기, 지금 ${step}%`}
      className="pointer-events-auto flex h-11 items-center gap-1 rounded-full border border-line bg-white/95 px-3.5 text-muted active:bg-paper-deep"
    >
      <span className="serif text-[15px] leading-none text-ink" aria-hidden="true">
        가
      </span>
      <span className="text-[11px] leading-none tracking-[-0.01em]" aria-hidden="true">
        {step}%
      </span>
    </button>
  );
}
