"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/components/Toast";
import { FONT_SIZE_KEY, FONT_SIZE_STEPS as STEPS, type FontSizeStep as Step } from "@/lib/fontSize";

/**
 * "글자 크기" 버튼 — 누를 때마다 100% → 110% → 120% → 100%.
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
    // 버튼에는 숫자를 쓰지 않고, 누를 때마다 지금 어느 단계인지 알림으로 알려준다.
    showToast(
      value === "110"
        ? "글자가 조금 커졌어요. 한 번 더 누르면 가장 크게 볼 수 있어요."
        : value === "120"
          ? "글자를 가장 크게 키웠어요. 다시 누르면 원래 크기로 돌아가요."
          : "글자 크기가 원래대로 돌아왔어요.",
    );
  };

  return (
    <button
      type="button"
      onClick={next}
      aria-label={`글자 크기 바꾸기, 지금 ${step}%`}
      className="pointer-events-auto flex h-11 items-center rounded-full border border-line bg-white/95 px-3.5 text-muted active:bg-paper-deep"
    >
      <span className="text-[12px] leading-none tracking-[-0.02em]">글자 크기</span>
    </button>
  );
}
