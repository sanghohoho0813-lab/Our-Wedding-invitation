"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastContextValue = { showToast: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string) => {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    // 긴 안내는 끝까지 읽을 수 있게 조금 더 오래 띄운다. (2 ~ 4.5초)
    const ms = Math.min(4500, 2000 + Math.max(0, text.length - 18) * 70);
    timer.current = setTimeout(() => setMessage(null), ms);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex justify-center px-6"
        // 오른쪽 아래 버튼들(맨 위로 · 글자 크기 · 공유)에 가리지 않도록 그 위에 띄운다.
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 128px)" }}
      >
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[420px] rounded-[20px] bg-ink/92 px-5 py-2.5 text-center text-[length:calc(13.5px*var(--fs))] leading-snug tracking-tight text-paper"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
