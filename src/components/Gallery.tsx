"use client";

import Image from "next/image";
import { useState } from "react";

import { GalleryViewer } from "@/components/GalleryViewer";
import { Reveal } from "@/components/Reveal";
import { wedding, type GalleryImage } from "@/config/wedding";

/**
 * 3×3 그리드 대신, 크기와 비율이 번갈아 나오는 editorial 배치.
 * 아래 패턴이 사진 개수에 맞춰 반복된다.
 */
type RowKind = "full" | "pair" | "offsetRight" | "wide" | "offsetLeft";

const PATTERN: RowKind[] = ["full", "pair", "offsetRight", "wide", "offsetLeft", "pair", "wide"];

const RATIO: Record<string, string> = {
  portrait: "3 / 4",
  landscape: "3 / 2",
  square: "1 / 1",
};

type Row = { kind: RowKind; items: { image: GalleryImage; index: number }[] };

function buildRows(images: readonly GalleryImage[]): Row[] {
  const rows: Row[] = [];
  let i = 0;
  let p = 0;

  while (i < images.length) {
    const kind = PATTERN[p % PATTERN.length];
    const size = kind === "pair" ? 2 : 1;
    const items = images.slice(i, i + size).map((image, k) => ({ image, index: i + k }));

    // 마지막에 pair 자리가 1장만 남으면 offset 컷으로 대체한다.
    rows.push({ kind: kind === "pair" && items.length === 1 ? "offsetRight" : kind, items });
    i += items.length;
    p += 1;
  }
  return rows;
}

function Photo({
  image,
  index,
  ratio,
  sizes,
  onOpen,
}: {
  image: GalleryImage;
  index: number;
  ratio: string;
  sizes: string;
  onOpen: (index: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`${image.alt} 크게 보기`}
      className="group relative block w-full overflow-hidden rounded-[2px] bg-paper-deep"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        loading="lazy"
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-active:scale-[1.02]"
      />
    </button>
  );
}

export function Gallery() {
  const images = wedding.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const rows = buildRows(images);

  if (images.length === 0) return null;

  return (
    <section className="pt-4 pb-28" aria-labelledby="gallery-heading">
      <div className="edge text-center">
        <Reveal>
          <p id="gallery-heading" className="eyebrow">
            Gallery
          </p>
        </Reveal>
      </div>

      <div className="mt-12 flex flex-col gap-5">
        {rows.map((row, rowIndex) => {
          const key = `${row.kind}-${rowIndex}`;

          if (row.kind === "pair") {
            return (
              <Reveal key={key} className="edge">
                <div className="grid grid-cols-2 gap-[7px]">
                  {row.items.map(({ image, index }) => (
                    <Photo
                      key={index}
                      image={image}
                      index={index}
                      ratio={RATIO[image.orientation] ?? "1 / 1"}
                      sizes="(max-width: 520px) 46vw, 240px"
                      onOpen={setOpenIndex}
                    />
                  ))}
                </div>
              </Reveal>
            );
          }

          const { image, index } = row.items[0];

          if (row.kind === "offsetRight" || row.kind === "offsetLeft") {
            const isRight = row.kind === "offsetRight";
            return (
              <Reveal key={key} className="edge">
                <div className={`mt-3 flex ${isRight ? "justify-end" : "justify-start"}`}>
                  <div className="w-[72%]">
                    <Photo
                      image={image}
                      index={index}
                      ratio="2 / 3"
                      sizes="(max-width: 520px) 66vw, 340px"
                      onOpen={setOpenIndex}
                    />
                    <p
                      className={`serif mt-3 text-[10px] uppercase tracking-[0.28em] text-faint ${
                        isRight ? "text-right" : "text-left"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          }

          // full / wide — 화면 가장자리까지 꽉 채운다.
          return (
            <Reveal key={key} className={row.kind === "wide" ? "my-3" : ""}>
              <Photo
                image={image}
                index={index}
                ratio={row.kind === "wide" ? "3 / 2" : "4 / 5"}
                sizes="(max-width: 520px) 100vw, 520px"
                onOpen={setOpenIndex}
              />
            </Reveal>
          );
        })}
      </div>

      {openIndex !== null && (
        <GalleryViewer
          images={images}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}
