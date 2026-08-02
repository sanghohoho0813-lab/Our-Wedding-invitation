"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { MusicToggle } from "@/components/MusicToggle";
import { wedding } from "@/config/wedding";

type AudioContextValue = {
  isPlaying: boolean;
  isReady: boolean;
  toggle: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within <AudioProvider>");
  return ctx;
}

/**
 * 페이지 전체에서 하나의 <audio> 만 사용한다.
 * 스크롤·섹션 이동과 무관하게 재생이 끊기지 않도록 최상위에 마운트한다.
 *
 * 브라우저 정책상 소리가 있는 자동재생은 사용자 제스처 이전에는 불가능하므로,
 * 첫 터치/클릭/스크롤 시 한 번만 조용히 재생을 시도한다. (실패해도 무시)
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const triedAutoplay = useRef(false);
  const isReady = wedding.music.enabled && Boolean(wedding.music.src);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, []);

  // 첫 사용자 상호작용에서 1회만 재생 시도
  useEffect(() => {
    if (!wedding.music.playOnFirstInteraction || !isReady) return;

    const tryPlay = () => {
      if (triedAutoplay.current) return;
      triedAutoplay.current = true;
      void audioRef.current?.play().catch(() => undefined);
      remove();
    };

    const events: (keyof WindowEventMap)[] = ["pointerdown", "touchstart", "keydown"];
    const remove = () => events.forEach((e) => window.removeEventListener(e, tryPlay));
    events.forEach((e) => window.addEventListener(e, tryPlay, { once: true, passive: true }));

    return remove;
  }, [isReady]);

  const value = useMemo(() => ({ isPlaying, isReady, toggle }), [isPlaying, isReady, toggle]);

  return (
    <AudioCtx.Provider value={value}>
      {children}
      {isReady && (
        <audio
          ref={audioRef}
          src={wedding.music.src}
          loop
          preload="none"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          aria-hidden="true"
        />
      )}
      {isReady && <MusicToggle />}
    </AudioCtx.Provider>
  );
}
