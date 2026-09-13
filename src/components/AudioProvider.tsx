"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { FloatingButtons } from "@/components/FloatingButtons";
import { MusicToggle } from "@/components/MusicToggle";
import { wedding } from "@/config/wedding";

type AudioContextValue = {
  /** 소리가 실제로 나고 있는가 */
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
 *
 * ── 자동재생에 대하여 ───────────────────────────────────────
 * 브라우저는 **소리가 나는 자동재생을 정책으로 금지**한다.
 * (Chrome · Safari · 삼성인터넷 · 카카오톡 인앱 브라우저 모두)
 * 화면에 들어오자마자 소리를 내는 방법은 존재하지 않는다.
 *
 * 대신 할 수 있는 최선을 한다.
 *   1) 들어오자마자 **음소거 상태로** 재생을 시작한다. (음소거 재생은 허용된다)
 *      → 곡이 이미 흐르고 있으므로 버퍼링이 끝나 있다.
 *   2) 하객이 화면을 처음 건드리는 순간 **음소거만 푼다.**
 *      → 그때서야 파일을 받기 시작하는 것이 아니라 곧바로 소리가 난다.
 *   3) 소리 켜기가 거부되면 다시 음소거로 돌려 두고, 다음 제스처에서 또 시도한다.
 *   4) 하객이 음악 버튼으로 직접 껐다면 다시 켜지 않는다.
 * ───────────────────────────────────────────────────────────
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  /** 서버 HTML 에는 넣지 않고 마운트된 뒤에 만든다. */
  const [mounted, setMounted] = useState(false);
  /** 하객이 음악 버튼으로 직접 껐는가 — 껐다면 그 의사를 존중한다. */
  const userPaused = useRef(false);
  const isReady = wedding.music.enabled && Boolean(wedding.music.src);

  /** 화면 표시용 상태 — "재생 중이면서 음소거가 아닐 때"만 켜진 것으로 본다. */
  const sync = useCallback(() => {
    const audio = audioRef.current;
    setIsPlaying(Boolean(audio && !audio.paused && !audio.muted));
  }, []);

  /**
   * 소리를 켜고 재생한다. 실제로 소리가 나면 true
   * fromStart 를 주면 곡을 처음부터 다시 들려준다.
   * (음소거로 먼저 흐르고 있었으므로, 하객이 처음 듣는 순간은 앞부분이어야 한다)
   */
  const startAudible = useCallback(async ({ fromStart = false } = {}) => {
    const audio = audioRef.current;
    if (!audio) return false;

    if (fromStart) {
      try {
        audio.currentTime = 0;
      } catch {
        // 아직 탐색할 수 없는 상태면 그냥 이어서 재생한다.
      }
    }
    audio.muted = false;
    try {
      if (audio.paused) await audio.play();
      sync();
      return !audio.paused && !audio.muted;
    } catch {
      // 소리 있는 재생이 거부되면 음소거 재생으로 되돌려 두고 다음 기회를 노린다.
      audio.muted = true;
      void audio.play().catch(() => undefined);
      sync();
      return false;
    }
  }, [sync]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused && !audio.muted) {
      userPaused.current = true;
      audio.pause();
      sync();
      return;
    }

    userPaused.current = false;
    void startAudible();
  }, [sync, startAudible]);

  useEffect(() => setMounted(true), []);

  // 1) 들어오자마자 음소거로 재생을 걸어 둔다. (음소거 재생은 브라우저가 허용한다)
  //    단, 페이지가 막 뜬 순간에는 거부되는 경우가 있어 잠깐씩 다시 시도한다.
  useEffect(() => {
    if (!isReady || !mounted) return;
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;
    const timers: number[] = [];

    const primeMuted = () => {
      if (cancelled) return;
      // 소리가 이미 켜져 있으면 건드리지 않는다.
      if (!audio.paused || !audio.muted) return;
      audio.muted = true;
      void audio.play().catch(() => undefined);
    };

    primeMuted();
    [200, 600, 1200, 2500].forEach((ms) => timers.push(window.setTimeout(primeMuted, ms)));
    audio.addEventListener("canplay", primeMuted);
    audio.addEventListener("loadeddata", primeMuted);

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      audio.removeEventListener("canplay", primeMuted);
      audio.removeEventListener("loadeddata", primeMuted);
    };
  }, [isReady, mounted]);

  // 2) 첫 제스처에서 음소거를 푼다. 실패하면 다음 제스처에서 다시 시도한다.
  useEffect(() => {
    if (!wedding.music.playOnFirstInteraction || !isReady) return;

    let done = false;

    const onGesture = (event: Event) => {
      if (done || userPaused.current) return;

      // 음악 버튼을 누른 경우는 버튼 자체 토글에 맡긴다.
      // (여기서 켜 버리면 이어지는 click 이 곧바로 꺼서 첫 탭이 먹지 않는다.)
      const target = event.target;
      if (target instanceof Element && target.closest("[data-music-toggle]")) return;

      void startAudible({ fromStart: true }).then((ok) => {
        if (!ok) return;
        done = true;
        remove();
      });
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
    const remove = () => events.forEach((e) => window.removeEventListener(e, onGesture));
    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));

    return remove;
  }, [isReady, startAudible]);

  // 3) 다른 앱에 갔다가 돌아왔을 때 끊긴 재생을 이어준다.
  useEffect(() => {
    if (!isReady) return;

    const resume = () => {
      const audio = audioRef.current;
      if (!audio || document.visibilityState !== "visible") return;
      if (userPaused.current) return;
      if (audio.paused) void audio.play().catch(() => undefined);
      sync();
    };

    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [isReady, sync]);

  const value = useMemo(() => ({ isPlaying, isReady, toggle }), [isPlaying, isReady, toggle]);

  return (
    <AudioCtx.Provider value={value}>
      {children}
      {isReady && mounted && (
        /*
         * 소리는 mp3 지만 요소는 <video> 를 쓴다.
         * 브라우저가 음소거 자동재생을 허용하는 것은 <video> 뿐이고
         * <audio> 는 음소거여도 자동재생이 막힌다. (직접 확인함)
         * 화면에는 보이지 않고 터치도 받지 않는다.
         */
        <video
          ref={audioRef}
          muted
          autoPlay
          playsInline
          loop
          preload="auto"
          src={wedding.music.src}
          onPlay={sync}
          onPause={sync}
          tabIndex={-1}
          aria-hidden="true"
          disablePictureInPicture
          className="pointer-events-none fixed bottom-0 left-0 h-px w-px opacity-0"
        />
      )}
      {isReady && <MusicToggle />}
      <FloatingButtons />
    </AudioCtx.Provider>
  );
}
