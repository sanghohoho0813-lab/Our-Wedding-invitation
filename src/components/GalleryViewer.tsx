"use client";

import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { GalleryImage } from "@/config/wedding";

type Props = {
  images: readonly GalleryImage[];
  startIndex: number;
  onClose: () => void;
};

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 380;

export function GalleryViewer({ images, startIndex, onClose }: Props) {
  const [[index, direction], setState] = useState<[number, number]>([startIndex, 0]);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const draggedAt = useRef(0);
  const reduceMotion = useReducedMotion();

  const paginate = useCallback(
    (delta: number) => {
      setState(([current]) => {
        const next = current + delta;
        if (next < 0 || next > images.length - 1) return [current, 0];
        return [next, delta];
      });
    },
    [images.length],
  );

  useEffect(() => setMounted(true), []);

  // body scroll lock (iOS Safari 포함)
  useEffect(() => {
    const scrollY = window.scrollY;
    const { body } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, []);

  // 키보드 조작
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "Tab") {
        // 뷰어 내부에만 포커스를 유지한다.
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, paginate]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) paginate(1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) paginate(-1);

    // 스와이프 직후 따라오는 click 으로 뷰어가 닫히지 않게 잠깐 막는다.
    draggedAt.current = performance.now();
  };

  /** 사진 바깥(여백)을 누르면 닫는다. 사진 자체를 누르거나 스와이프한 직후에는 닫지 않는다. */
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (performance.now() - draggedAt.current < 400) return;
    onClose();
  };

  if (!mounted) return null;

  const image = images[index];

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="사진 크게 보기"
      className="fixed inset-0 z-[100] flex flex-col bg-[#121110]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 상단 — 닫기 */}
      <div
        className="relative z-10 flex items-center justify-end px-2"
        style={{ paddingTop: "max(env(safe-area-inset-top), 8px)" }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="tap w-12 text-white/70 transition-colors active:text-white"
        >
          <X size={20} strokeWidth={1.3} aria-hidden="true" />
        </button>
      </div>

      {/* 사진 */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            className="absolute inset-0 flex items-center justify-center px-3 py-1"
            onClick={onBackdropClick}
            drag="x"
            dragElastic={0.16}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 44 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -44 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            {/*
              width/height 는 비율 힌트이고, 실제 표시 크기는 로드된 이미지의
              고유 비율을 따른다. 덕분에 <img> 박스가 사진에 딱 맞아
              그 바깥 여백을 누르면 닫히도록 만들 수 있다.
            */}
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={1600}
              sizes="100vw"
              priority
              draggable={false}
              className="h-auto max-h-full w-auto max-w-full select-none object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 — 이전 / 번호 / 다음 */}
      <div
        className="relative z-10 flex items-center justify-center gap-6 px-4"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 14px)" }}
      >
        <button
          type="button"
          onClick={() => paginate(-1)}
          disabled={index === 0}
          aria-label="이전 사진"
          className="tap w-11 text-white/60 transition-opacity disabled:opacity-20"
        >
          <ChevronLeft size={20} strokeWidth={1.3} aria-hidden="true" />
        </button>

        <p className="serif min-w-[64px] text-center text-[12px] tracking-[0.24em] text-white/70">
          {String(index + 1).padStart(2, "0")}
          <span className="mx-1 text-white/30">/</span>
          {String(images.length).padStart(2, "0")}
        </p>

        <button
          type="button"
          onClick={() => paginate(1)}
          disabled={index === images.length - 1}
          aria-label="다음 사진"
          className="tap w-11 text-white/60 transition-opacity disabled:opacity-20"
        >
          <ChevronRight size={20} strokeWidth={1.3} aria-hidden="true" />
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}
