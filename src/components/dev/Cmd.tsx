"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { wedding } from "@/config/wedding";

/** user@host:path$ */
export function Prompt() {
  const { user, host, path } = wedding.devVersion;
  return (
    <span className="select-none">
      <span className="text-dev-green">
        {user}@{host}
      </span>
      <span className="text-dev-faint">:</span>
      <span className="text-dev-cyan">{path}</span>
      <span className="text-dev-faint">$ </span>
    </span>
  );
}

/**
 * 터미널 명령 한 줄 + 결과.
 * 화면에 들어오면 명령을 한 글자씩 쳐 내려가고, 다 치면 결과가 나타난다.
 */
export function Cmd({
  command,
  children,
  className = "",
}: {
  command: string;
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(false);
  const done = typed >= command.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(command.length);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [command.length]);

  useEffect(() => {
    if (!started || done) return;
    const t = window.setTimeout(() => setTyped((n) => n + 1), 38);
    return () => window.clearTimeout(t);
  }, [started, done, typed]);

  return (
    <div ref={ref} className={className}>
      <p className="break-all">
        <Prompt />
        <span className="text-dev-ink">{command.slice(0, typed)}</span>
        {/* 치는 동안에만 커서를 깜빡인다 — 화면 밖 명령들까지 깜빡이면 쓸데없이 일을 한다 */}
        {started && !done && <span className="dev-cursor" aria-hidden="true" />}
        {/* 화면 낭독기는 다 친 명령을 바로 읽는다 */}
        <span className="sr-only">{command}</span>
      </p>
      <div
        className={`mt-3 transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!done}
      >
        {children}
      </div>
    </div>
  );
}
