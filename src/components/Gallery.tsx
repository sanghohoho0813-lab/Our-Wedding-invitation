"use client";

import Image from "next/image";
import { useState } from "react";

import { GalleryViewer } from "@/components/GalleryViewer";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding, type GalleryImage } from "@/config/wedding";

/** 처음에 보여줄 장수 (3열 × 3줄) */
const INITIAL = 9;

/**
 * 3열 그리드 갤러리.
 * 사진을 누르면 전체화면 뷰어가 열리고, 거기서는 잘리지 않은 원본 프레임을 본다.
 */
export function Gallery() {
  const images: readonly GalleryImage[] = wedding.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (images.length === 0) return null;

  const visible = expanded ? images : images.slice(0, INITIAL);

  return (
    <section className="edge pb-24" aria-labelledby="gallery-heading">
      <SectionHeading title="갤러리" />

      <Reveal className="mt-9">
        <ul className="grid grid-cols-3 gap-1.5">
          {visible.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`${image.alt} 크게 보기`}
                className="relative block w-full overflow-hidden rounded-[3px] bg-paper-deep"
                style={{ aspectRatio: "1 / 1" }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 520px) 32vw, 166px"
                  className="object-cover"
                  style={{ objectPosition: image.objectPosition ?? "center" }}
                />
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      {images.length > INITIAL && (
        <Reveal delay={0.06} className="mt-7 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="btn-outline active:bg-paper-deep"
          >
            {expanded ? "접기" : `사진 더보기 (${images.length - INITIAL}장)`}
          </button>
        </Reveal>
      )}

      {openIndex !== null && (
        <GalleryViewer images={images} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}
