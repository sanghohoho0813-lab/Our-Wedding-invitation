"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { useAudio } from "@/components/AudioProvider";
import { wedding } from "@/config/wedding";

const BARS = [
  { rest: 4, peak: 10, delay: 0 },
  { rest: 7, peak: 14, delay: 0.18 },
  { rest: 5, peak: 9, delay: 0.36 },
];

/**
 * 화면 우측 상단의 아주 작은 음악 컨트롤.
 * 회전하는 음표 대신, 얇은 waveform 만 미세하게 움직인다.
 */
export function MusicToggle() {
  const { isPlaying, toggle } = useAudio();
  const reduceMotion = useReducedMotion();
  const hintText: string = wedding.music.hint;
  // 소리가 켜지지 않은 채 잠깐 지나면, 여기를 누르면 된다고 한 번만 알려준다.
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!hintText || isPlaying) return;

    const show = window.setTimeout(() => setShowHint(true), 2200);
    const hide = window.setTimeout(() => setShowHint(false), 8000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [hintText, isPlaying]);

  useEffect(() => {
    if (isPlaying) setShowHint(false);
  }, [isPlaying]);

  return (
    <button
      type="button"
      data-music-toggle
      onClick={toggle}
      aria-label={isPlaying ? "음악 정지" : "음악 재생"}
      aria-pressed={isPlaying}
      // 사진 위에서도, 아이보리 배경 위에서도 보이도록 밝은 반투명 원 + 어두운 막대.
      className="fixed z-[80] flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300"
      style={{
        top: "calc(env(safe-area-inset-top) + 14px)",
        right: "max(14px, calc(50vw - 260px + 14px))",
      }}
    >
      <AnimatePresence>
        {showHint && (
          <motion.span
            key="hint"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute right-11 whitespace-nowrap rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[11px] tracking-[-0.01em] text-ink/80"
            aria-hidden="true"
          >
            {hintText}
          </motion.span>
        )}
      </AnimatePresence>

      <span
        className="flex h-8 w-8 items-center justify-center gap-[2.5px] rounded-full border border-white/50 bg-white/75"
        aria-hidden="true"
      >
        {/*
          막대 높이를 매 프레임 스크립트로 바꾸면 음악이 나오는 내내 화면 전체를
          다시 계산해서 스크롤이 버벅인다. 높이는 고정하고 CSS 로 세로 배율만
          움직여 GPU 가 합성만 하게 한다. (eq-bar 는 globals.css)
        */}
        {BARS.map((bar, i) => (
          <span
            key={i}
            className={`eq-bar w-[1.5px] rounded-full bg-ink/75 ${
              isPlaying && !reduceMotion ? "eq-bar-on" : ""
            }`}
            style={
              {
                height: bar.peak,
                "--eq-rest": bar.rest / bar.peak,
                "--eq-off": 3 / bar.peak,
                animationDelay: `${bar.delay}s`,
                opacity: isPlaying ? 0.9 : 0.5,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
    </button>
  );
}
