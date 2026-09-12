"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { FloatingButtons } from "@/components/FloatingButtons";
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
 * 소리가 있는 자동재생은 브라우저 정책상 사용자 제스처 이전에는 불가능하다.
 * 게다가 카카오톡·인스타그램 같은 인앱 브라우저에서는 제스처가 있어도
 * 첫 시도가 거부되는 경우가 잦다.
 * 그래서 "한 번만 시도"가 아니라 **재생에 성공할 때까지** 매 제스처마다 다시 시도한다.
 * (사용자가 음악 버튼으로 직접 끈 뒤에는 다시 켜지 않는다.)
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  /** 사용자가 음악 버튼을 직접 눌렀는가 — 눌렀다면 그 의사를 존중한다. */
  const userDecided = useRef(false);
  /** 지금 "재생 중이어야 하는" 상태인가 — 앱 전환 후 이어재생 판단에 쓴다. */
  const shouldPlay = useRef(false);
  const isReady = wedding.music.enabled && Boolean(wedding.music.src);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    userDecided.current = true;

    if (audio.paused) {
      shouldPlay.current = true;
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      shouldPlay.current = false;
      audio.pause();
    }
  }, []);

  // 재생에 성공할 때까지 사용자 제스처마다 조용히 다시 시도한다.
  useEffect(() => {
    if (!wedding.music.playOnFirstInteraction || !isReady) return;

    let done = false;

    const tryPlay = (event: Event) => {
      if (done || userDecided.current) return;

      // 음악 버튼을 누른 경우는 버튼 자체 토글에 맡긴다.
      // (여기서 재생해 버리면 이어지는 click 이 곧바로 정지시켜 첫 탭이 먹지 않는다.)
      const target = event.target;
      if (target instanceof Element && target.closest("[data-music-toggle]")) return;

      const audio = audioRef.current;
      if (!audio || !audio.paused) return;

      void audio
        .play()
        .then(() => {
          // 성공했을 때만 리스너를 떼어낸다. 실패하면 다음 제스처에서 다시 시도한다.
          done = true;
          shouldPlay.current = true;
          remove();
        })
        .catch(() => undefined);
    };

    // 인앱 브라우저마다 실제로 오는 이벤트가 달라서 넉넉히 걸어둔다.
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "touchstart",
      "touchend",
      "click",
      "keydown",
      "scroll",
    ];
    const remove = () => events.forEach((e) => window.removeEventListener(e, tryPlay));
    events.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }));

    return remove;
  }, [isReady]);

  // 다른 앱에 갔다가 돌아왔을 때 끊긴 재생을 이어준다.
  useEffect(() => {
    if (!isReady) return;

    const resume = () => {
      const audio = audioRef.current;
      if (!audio || document.visibilityState !== "visible") return;
      // 사용자가 직접 끈 경우에는 다시 켜지 않는다.
      if (shouldPlay.current && audio.paused) {
        void audio.play().catch(() => undefined);
      }
    };

    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
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
          /* 첫 탭에서 곧바로 소리가 나도록 메타데이터는 미리 받아둔다. */
          preload="metadata"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          aria-hidden="true"
        />
      )}
      {isReady && <MusicToggle />}
      <FloatingButtons />
    </AudioCtx.Provider>
  );
}
