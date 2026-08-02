"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { GalleryViewer } from "@/components/GalleryViewer";
import { Reveal } from "@/components/Reveal";
import { wedding, type GalleryImage } from "@/config/wedding";

/**
 * 가로 스와이프 갤러리.
 *
 * - 사진 한 장이 화면 폭의 약 80%를 차지하고, 다음 사진이 오른쪽에 살짝 보여서
 *   스와이프할 수 있다는 걸 자연스럽게 알린다.
 * - scroll-snap 으로 손가락 관성 스크롤이 그대로 살아 있다.
 * - 카드 비율(3:4)을 통일해 사진마다 높이가 들쭉날쭉해지지 않는다.
 *   사진별 crop 위치는 config 의 objectPosition 으로 조정한다.
 */
export function Gallery() {
  const images: readonly GalleryImage[] = wedding.gallery;
  const frameRef = useRef(0);
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 화면 중앙에 가장 가까운 카드를 현재 사진으로 본다.
  const updateActive = useCallback((track: HTMLUListElement) => {
    // offsetLeft 는 스크롤 컨테이너 기준이 아니므로 실제 화면 좌표로 비교한다.
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let nearest = 0;
    let min = Infinity;

    Array.from(track.children).forEach((child, i) => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      if (rect.width === 0) return; // 끝에 둔 여백용 li
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < min) {
        min = distance;
        nearest = i;
      }
    });

    setActive(nearest);
  }, []);

  // React 의 onScroll 을 쓰면 트랙이 다시 마운트돼도 핸들러가 항상 붙어 있다.
  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const track = event.currentTarget;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => updateActive(track));
  };

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  if (images.length === 0) return null;

  return (
    <section className="pt-4 pb-20" aria-labelledby="gallery-heading">
      <div className="edge text-center">
        <Reveal>
          <p id="gallery-heading" className="eyebrow">
            Gallery
          </p>
        </Reveal>
      </div>

      <Reveal>
        <ul
          onScroll={handleScroll}
          className="no-scrollbar mt-9 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain scroll-px-[26px] px-[26px] pb-1"
        >
          {/* 카드 폭은 화면 폭 기준 80% — 컨테이너 padding 의 영향을 받지 않도록 vw 로 잡는다 */}
          {images.map((image, index) => (
            <li key={image.src} className="w-[min(80vw,400px)] shrink-0 snap-start">
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`${image.alt} 크게 보기`}
                className="relative block w-full overflow-hidden rounded-[2px] bg-paper-deep"
                style={{ aspectRatio: "3 / 4" }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading={index < 2 ? "eager" : "lazy"}
                  sizes="(max-width: 520px) 80vw, 420px"
                  className="object-cover"
                  style={{ objectPosition: image.objectPosition ?? "center" }}
                />
              </button>
            </li>
          ))}
          {/* 마지막 카드까지 오른쪽 여백이 유지되도록 */}
          <li aria-hidden="true" className="w-px shrink-0" />
        </ul>
      </Reveal>

      {/* 아주 조용한 진행 표시 */}
      <div className="edge mt-6 text-center" aria-live="polite">
        <p className="serif text-[11px] tracking-[0.3em] text-faint">
          {String(active + 1).padStart(2, "0")}
          <span className="mx-2 text-line">—</span>
          {String(images.length).padStart(2, "0")}
        </p>
      </div>

      {openIndex !== null && (
        <GalleryViewer images={images} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}
