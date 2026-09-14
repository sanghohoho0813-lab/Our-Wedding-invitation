"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useAudio } from "@/components/AudioProvider";
import { wedding } from "@/config/wedding";
import { formatDotted, weekdayKo } from "@/lib/date";
import { venueLine } from "@/lib/venue";

/**
 * 입장 화면.
 *
 * 브라우저는 "하객이 화면을 한 번 건드리기 전에는 소리를 내지 못한다"는 정책을 갖고 있고,
 * 이건 어떤 방법으로도 우회할 수 없다.
 * 그래서 청첩장을 여는 동작 자체를 그 한 번의 터치로 삼는다.
 * 하객 입장에서는 "열었더니 음악이 나온다" 가 된다.
 *
 * 자바스크립트가 없거나 꺼져 있으면 이 화면은 아예 그려지지 않고
 * 청첩장이 그대로 보인다. (마운트 후에만 렌더링)
 */
export function EntryGate() {
  const { entry, hero } = wedding;
  const { startMusic } = useAudio();
  const reduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => setMounted(true), []);

  // 입장 전에는 뒤쪽이 스크롤되지 않게 막는다.
  useEffect(() => {
    if (!mounted || !open || !entry.enabled) return;

    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    return () => {
      body.style.overflow = prev;
    };
  }, [mounted, open, entry.enabled]);

  if (!entry.enabled || !mounted) return null;

  const handleEnter = () => {
    // 이 클릭이 브라우저가 요구하는 "사용자 제스처" 다. 여기서 소리를 켠다.
    startMusic();
    setOpen(false);
  };

  const date = wedding.wedding.date;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="entry"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[100] bg-paper"
          role="dialog"
          aria-modal="true"
          aria-label="청첩장 입장"
        >
          {/* 청첩장 본문과 같은 폭(520px)으로 맞춰 PC 에서도 같은 화면처럼 보이게 한다 */}
          <div className="relative mx-auto h-full w-full max-w-[520px] overflow-hidden bg-paper-deep">
            <Image
              src={hero.image}
              alt=""
              fill
              priority
              sizes="(max-width: 520px) 100vw, 520px"
              className="object-cover"
              style={{ objectPosition: hero.imagePosition }}
              aria-hidden="true"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(24,22,19,0.30) 0%, rgba(24,22,19,0.18) 34%, rgba(24,22,19,0.62) 68%, rgba(24,22,19,0.80) 100%)",
              }}
            />

            {/* 두 사람의 얼굴을 가리지 않도록 글은 아래쪽에 둔다 */}
            <div className="relative flex h-full w-full flex-col items-center justify-end px-8 pb-[max(env(safe-area-inset-bottom),56px)] text-center">
              <p className="script text-[30px] leading-none text-white/85">
                our wedding day
              </p>

              <p className="serif mt-7 text-[19px] tracking-[0.04em] text-white">
                {wedding.groom.name}
                <span className="mx-3 text-[13px] text-white/60">×</span>
                {wedding.bride.name}
              </p>

              <div
                className="mx-auto mt-6 h-px w-8 bg-white/35"
                aria-hidden="true"
              />

              <p className="mt-6 text-[14.5px] leading-relaxed tracking-[0.01em] text-white/90">
                {formatDotted(date)} {weekdayKo(date)}{" "}
                {wedding.wedding.timeLabel}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed tracking-[-0.01em] text-white/75">
                {venueLine()}
              </p>

              <button
                type="button"
                onClick={handleEnter}
                className="mt-9 min-w-[190px] rounded-full border border-white/55 bg-white/12 px-8 py-3.5 text-[15px] tracking-[0.02em] text-white outline-none backdrop-blur-md transition-colors focus-visible:border-white active:bg-white/25"
              >
                {entry.buttonLabel}
              </button>

              {entry.note && (
                <p className="mt-5 text-[12px] tracking-[0.02em] text-white/60">
                  {entry.note}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
