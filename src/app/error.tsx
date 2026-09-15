"use client";

import { wedding } from "@/config/wedding";

/** 예기치 못한 오류 — 하객이 당황하지 않게 같은 톤으로 다시 열기를 안내한다. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="shell edge flex min-h-[100svh] flex-col items-center justify-center text-center">
      <p className="serif text-[19px] tracking-[0.02em] text-ink">
        {wedding.groom.name}
        <span className="mx-2.5 text-[12px] text-faint">×</span>
        {wedding.bride.name}
      </p>
      <p className="mt-5 text-[14.5px] leading-relaxed text-muted">
        화면을 불러오는 중 문제가 생겼습니다.
        <br />
        잠시 후 다시 열어주세요.
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn-outline mt-9 min-w-[180px] active:bg-paper-deep"
      >
        다시 열기
      </button>
    </main>
  );
}
