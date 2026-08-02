"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useAudio } from "@/components/AudioProvider";

const BARS = [
  { rest: 5, peak: 13, delay: 0 },
  { rest: 9, peak: 17, delay: 0.18 },
  { rest: 6, peak: 11, delay: 0.36 },
];

/**
 * 화면 우측 상단의 아주 작은 음악 컨트롤.
 * 회전하는 음표 대신, 얇은 waveform 만 미세하게 움직인다.
 */
export function MusicToggle() {
  const { isPlaying, toggle } = useAudio();
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? "음악 정지" : "음악 재생"}
      aria-pressed={isPlaying}
      className="fixed z-[80] flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/35 backdrop-blur-md transition-colors duration-300 active:bg-white/55"
      style={{
        top: "calc(env(safe-area-inset-top) + 14px)",
        right: "max(14px, calc(50vw - 260px + 14px))",
      }}
    >
      <span className="flex h-[18px] items-center gap-[3px]" aria-hidden="true">
        {BARS.map((bar, i) => (
          <motion.span
            key={i}
            className="w-[1.5px] rounded-full bg-ink/70"
            initial={false}
            animate={
              isPlaying && !reduceMotion
                ? { height: [bar.rest, bar.peak, bar.rest], opacity: 0.85 }
                : { height: 3, opacity: 0.45 }
            }
            transition={
              isPlaying && !reduceMotion
                ? { duration: 1.15, repeat: Infinity, ease: "easeInOut", delay: bar.delay }
                : { duration: 0.35, ease: "easeOut" }
            }
          />
        ))}
      </span>
    </button>
  );
}
