"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";
import { canWebShare, isKakaoReady, kakaoShare, webShare } from "@/lib/share";

/** 우하단 플로팅 — 맨 위로 / 공유. */
export function FloatingButtons() {
  const { showToast } = useToast();
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /*
   * 스크롤할 때마다 scrollY 를 읽으면 그때마다 휴대폰이 화면 배치를 강제로
   * 다시 계산해서 스크롤이 멈칫한다. 페이지 맨 위 600px 짜리 투명 표식이
   * 화면에서 사라졌는지만 지켜보면 스크롤 중에는 아무 일도 하지 않는다.
   */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const handleShare = async () => {
    const url = window.location.href.split("#")[0];

    if (isKakaoReady() && kakaoShare(url)) return;

    if (canWebShare()) {
      const result = await webShare(url);
      if (result !== "unsupported") return;
    }

    const ok = await copyText(url || wedding.share.url);
    showToast(ok ? "링크가 복사되었습니다." : "복사에 실패했습니다.");
  };

  return (
    <>
      {/* 페이지 맨 위 600px — 이 표식이 화면 밖으로 나가면 "맨 위로" 버튼을 보여준다 */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[600px] w-px"
      />
      <div
        className="pointer-events-none fixed z-[70] flex flex-col gap-2.5"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 18px)",
          right: "max(16px, calc(50vw - 260px + 16px))",
        }}
      >
        <AnimatePresence>
          {visible && (
            <motion.button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="맨 위로"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/95 text-muted active:bg-paper-deep"
            >
              <ArrowUp size={17} strokeWidth={1.5} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleShare}
          aria-label="청첩장 공유하기"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/95 text-muted active:bg-paper-deep"
        >
          <Share2 size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
