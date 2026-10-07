"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  /** mp4 를 재생하지 못하는 브라우저를 위한 예비 파일 */
  webm?: string;
  poster?: string;
  alt: string;
  ratio?: string;
  className?: string;
};

/**
 * 소리 없는 짧은 영상 — 재생 버튼 없이 저절로, 끝없이 반복된다.
 *
 * muted 라서 배경음악을 끊지 않는다. (오디오 포커스를 가져가지 않음)
 * 화면 밖으로 나가면 잠시 멈춰 배터리와 데이터를 아끼고,
 * 다시 보이면 이어서 재생한다.
 */
export function LoopVideo({ src, webm, poster, alt, ratio = "16 / 9", className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // 일부 브라우저는 속성만으로는 음소거를 인정하지 않아 한 번 더 지정한다.
    video.muted = true;
    video.defaultMuted = true;

    const play = () => {
      video.play().catch(() => {
        /* 저전력 모드 등으로 막히면 포스터가 대신 보인다. */
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      play();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[10px] bg-paper-deep ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <video
        ref={ref}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        aria-label={alt}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
        {webm && <source src={webm} type="video/webm" />}
      </video>
    </div>
  );
}
