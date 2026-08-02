"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";
import { canWebShare, isKakaoReady, kakaoShare, webShare } from "@/lib/share";

/** 우하단 플로팅 — 맨 위로 / 공유. */
export function FloatingButtons() {
  const { showToast } = useToast();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/85 text-muted backdrop-blur-md active:bg-paper-deep"
          >
            <ArrowUp size={17} strokeWidth={1.5} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={handleShare}
        aria-label="청첩장 공유하기"
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/85 text-muted backdrop-blur-md active:bg-paper-deep"
      >
        <Share2 size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
