"use client";

import Image from "next/image";
import { useState } from "react";

import { GalleryViewer } from "@/components/GalleryViewer";
import { Reveal } from "@/components/Reveal";
import { blurBackground } from "@/config/blur";
import { type GalleryImage } from "@/config/wedding";

/**
 * 포토부스 사진 — 옆으로 넘겨 보는 한 줄.
 *
 * 테두리 · 글자까지 한 장의 작품이라 정사각형으로 자르지 않고 2:3 그대로 보여주고,
 * original 이 켜진 사진은 사이트가 다시 압축하지 않은 원본 파일을 그대로 쓴다.
 * 누르면 전체 화면으로 크게 본다.
 */
export function BoothStrip({
  heading,
  images,
  className = "",
}: {
  heading?: string;
  images: readonly GalleryImage[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  if (images.length === 0) return null;

  return (
    <div className={className}>
      {heading && (
        <Reveal className="text-center">
          <p className="text-[length:calc(13px*var(--fs))] tracking-[0.04em] text-accent">{heading}</p>
        </Reveal>
      )}

      <Reveal className="mt-5">
        {/* 화면 양끝까지 닿게 펼치고, 첫 장은 본문 여백에 맞춰 시작한다 */}
        <ul className="-mx-[26px] flex snap-x snap-mandatory scroll-px-[26px] gap-3 overflow-x-auto px-[26px] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, i) => (
            <li key={image.src} className="w-[44%] shrink-0 snap-start">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`${image.alt} 크게 보기`}
                className="relative block w-full overflow-hidden rounded-[6px] bg-paper-deep shadow-[0_2px_10px_rgba(43,41,37,0.10)] ring-1 ring-line"
                style={{ aspectRatio: "2 / 3", ...blurBackground(image.src) }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  unoptimized={image.original}
                  sizes="(max-width: 520px) 44vw, 230px"
                  className="object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-center text-[length:calc(11.5px*var(--fs))] text-faint">
          옆으로 넘겨 보세요 · 누르면 크게 볼 수 있어요
        </p>
      </Reveal>

      {open !== null && <GalleryViewer images={images} startIndex={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
