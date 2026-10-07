"use client";

import { useEffect, useRef } from "react";

/** 떨어지는 글자 — 두 사람 이름 글자와 코드 기호를 섞는다. */
const CODE_CHARS = "01상호지윤♥{}<>/;=+*#$LOVEgitmerge".split("");
const HEART_CHARS = ["♥", "♡", "❤", "💕"];

type Props = {
  /** true 면 잠깐 하트가 쏟아진다 */
  burst?: number;
  className?: string;
};

/**
 * 영화 매트릭스처럼 글자가 비처럼 떨어지는 배경.
 *
 * 휴대폰 부담을 줄이려고
 *  - 1초에 24번만 그리고 (화면 갱신의 절반 이하)
 *  - 화면 밖으로 나가거나 다른 앱으로 가면 완전히 멈추고
 *  - 움직임 줄이기 설정을 켠 분께는 한 장면만 보여준다.
 */
export function MatrixRain({ burst = 0, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstUntil = useRef(0);

  useEffect(() => {
    if (burst > 0) burstUntil.current = performance.now() + 2600;
  }, [burst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const FONT = 15;
    let cols: number[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 처음부터 화면 곳곳에 글자가 떨어지고 있도록 시작 높이를 흩어 둔다.
      cols = Array.from({ length: Math.ceil(w / FONT) }, () => Math.random() * (h / FONT) - 10);
      ctx.fillStyle = "#0b0f14";
      ctx.fillRect(0, 0, w, h);
    };
    resize();

    const draw = (now: number) => {
      const hearts = now < burstUntil.current;
      // 이전 글자를 살짝만 덮어 꼬리가 남게 한다.
      ctx.fillStyle = "rgba(11, 15, 20, 0.09)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${FONT}px var(--font-mono), monospace`;
      for (let i = 0; i < cols.length; i++) {
        const y = cols[i] * FONT;
        const heart = hearts && Math.random() < 0.6;
        const ch = heart
          ? HEART_CHARS[(Math.random() * HEART_CHARS.length) | 0]
          : CODE_CHARS[(Math.random() * CODE_CHARS.length) | 0];
        ctx.fillStyle = heart ? "#ff7eb6" : Math.random() < 0.06 ? "#e6fff4" : "#3fb950";
        ctx.fillText(ch, i * FONT, y);
        if (y > h && Math.random() > 0.975) cols[i] = Math.random() * -10;
        cols[i] += hearts ? 1.4 : 1;
      }
    };

    if (reduce) {
      for (let k = 0; k < 60; k++) draw(0);
      return;
    }

    // 보일 때만 그리기 반복을 돌린다. 화면 밖이거나 다른 앱에 가 있으면 반복 자체를 멈춘다.
    let raf = 0;
    let last = 0;
    let visible = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / 24) return;
      last = now;
      draw(now);
    };
    const sync = () => {
      const run = visible && !document.hidden;
      if (run && !raf) raf = requestAnimationFrame(loop);
      if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
