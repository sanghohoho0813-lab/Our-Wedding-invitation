import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { blurFor } from "@/config/blur";

type Props = {
  src: string;
  alt: string;
  /** CSS aspect-ratio 값 — 예: "4 / 5" */
  ratio?: string;
  objectPosition?: string;
  sizes?: string;
  className?: string;
  rounded?: boolean;
  priority?: boolean;
};

/**
 * 사진 자리.
 *
 * config 의 경로가 비어 있으면(아직 사진을 준비하지 않았으면)
 * 깨진 화면 대신 조용한 안내 블록을 같은 크기로 보여준다.
 * 경로만 채우면 그대로 사진이 들어간다.
 */
export function PhotoSlot({
  src,
  alt,
  ratio = "4 / 5",
  objectPosition = "center",
  sizes = "(max-width: 520px) 100vw, 520px",
  className = "",
  rounded = true,
  priority = false,
}: Props) {
  const radius = rounded ? "rounded-[10px]" : "";
  // 사진이 다 내려오기 전에 회색 칸 대신 흐릿한 색감을 먼저 보여준다.
  const blur = blurFor(src);

  if (!src) {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center gap-2 border border-line bg-paper-deep ${radius} ${className}`}
        style={{ aspectRatio: ratio }}
        role="img"
        aria-label={`${alt} — 준비 중`}
      >
        <ImageIcon size={20} strokeWidth={1.2} className="text-faint/70" aria-hidden="true" />
        <p className="px-6 text-center text-[12.5px] leading-relaxed text-faint">사진 준비 중입니다</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-paper-deep ${radius} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        className="object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}
