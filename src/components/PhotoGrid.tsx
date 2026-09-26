"use client";

import Image from "next/image";
import { useState } from "react";

import { GalleryViewer } from "@/components/GalleryViewer";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { blurFor } from "@/config/blur";
import { type GalleryImage } from "@/config/wedding";

/** 처음에 보여줄 장수 (3열 × 3줄) */
const INITIAL = 9;

type BodyProps = {
  images: readonly GalleryImage[];
  className?: string;
};

/**
 * 3열 그리드 + 더보기 + 전체화면 뷰어.
 * 섹션 껍데기 없이 본체만 필요할 때(타임라인 중간 등) 이것만 쓴다.
 */
export function PhotoGridBody({ images, className = "mt-9" }: BodyProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (images.length === 0) return null;

  const visible = expanded ? images : images.slice(0, INITIAL);

  return (
    <>
      <Reveal className={className}>
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
                  placeholder={blurFor(image.src) ? "blur" : "empty"}
                  blurDataURL={blurFor(image.src)}
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
    </>
  );
}

type Props = {
  id: string;
  title: string;
  body?: readonly string[];
  images: readonly GalleryImage[];
};

/** 제목이 있는 사진 섹션. */
export function PhotoGrid({ id, title, body, images }: Props) {
  if (images.length === 0) return null;

  return (
    <section className="edge pb-24" aria-labelledby={`${id}-heading`}>
      <SectionHeading id={`${id}-heading`} title={title} body={body} />
      <PhotoGridBody images={images} />
    </section>
  );
}
