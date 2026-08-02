"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/** 화면 아래에서 올라오는 시트형 모달. ESC / 배경 탭으로 닫힌다. */
export function Modal({ open, onClose, title, children }: Props) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { body } = document;
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div
            className="absolute inset-0 bg-ink/45"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="shell relative max-h-[86svh] w-full overflow-y-auto rounded-t-[16px] bg-paper"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 30 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-5 py-3">
              <p className="serif text-[15px] text-accent">{title}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="tap -mr-2 w-11 text-muted active:text-ink"
              >
                <X size={18} strokeWidth={1.4} aria-hidden="true" />
              </button>
            </div>

            <div
              className="px-6 pt-6"
              style={{ paddingBottom: "max(env(safe-area-inset-bottom), 28px)" }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
