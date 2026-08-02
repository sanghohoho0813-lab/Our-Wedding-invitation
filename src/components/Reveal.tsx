"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** 초 단위 지연 */
  delay?: number;
  /** 위로 올라오는 거리 (12~20px 권장) */
  y?: number;
  className?: string;
};

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 스크롤 시 opacity 0 → 1 + 아주 짧은 상승.
 *
 * 중요: 서버에서는 "그냥 보이는 상태"로 렌더링한다.
 * (JS가 늦게 로드되거나 실패해도 청첩장 내용은 항상 읽을 수 있어야 한다.)
 * 마운트 시점에 화면 아래에 있는 요소만 애니메이션 대상으로 전환하므로
 * 첫 화면에서 깜빡임도 생기지 않는다.
 */
export function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    // 마운트 시 이미 보이는 요소는 건드리지 않는다.
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) setAnimate(true);
  }, [reduceMotion]);

  if (!animate) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
