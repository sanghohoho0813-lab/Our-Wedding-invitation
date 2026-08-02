"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";

export function Location() {
  const { showToast } = useToast();
  const { venue, hall, address, mapQuery, mapImage, tel } = wedding.wedding;
  const query = encodeURIComponent(mapQuery || venue);

  const handleCopy = async () => {
    const ok = await copyText(address);
    showToast(ok ? "주소가 복사되었습니다." : "복사에 실패했습니다.");
  };

  return (
    <section className="pb-28" aria-labelledby="location-heading">
      <div className="edge text-center">
        <Reveal>
          <p id="location-heading" className="eyebrow">
            Location
          </p>
          <p className="mt-7 text-[19px] leading-snug tracking-[-0.01em] text-ink">{venue}</p>
          <p className="mt-1.5 text-[14px] text-muted">{hall}</p>
          <p className="mt-4 text-[13.5px] leading-relaxed text-faint">{address}</p>
          {tel && (
            <a
              href={`tel:${tel.replace(/-/g, "")}`}
              className="tap mt-1 text-[13.5px] tracking-[0.02em] text-muted underline decoration-line underline-offset-4"
            >
              {tel}
            </a>
          )}
        </Reveal>
      </div>

      {/* 지도 */}
      <Reveal delay={0.06} className="edge">
        <div className="relative mt-9 aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-line bg-paper-deep">
          {mapImage ? (
            <Image
              src={mapImage}
              alt={`${venue} 위치 지도`}
              fill
              sizes="(max-width: 520px) 100vw, 520px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
              <MapPin size={18} strokeWidth={1.3} className="text-faint" aria-hidden="true" />
              <p className="text-[13px] leading-relaxed text-faint">
                아래 버튼으로 지도 앱에서 길찾기를 열 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </Reveal>

      {/* 지도 앱 / 주소 복사 */}
      <Reveal delay={0.1} className="edge">
        <div className="mt-3 grid grid-cols-3 gap-[7px]">
          <a
            href={`https://map.naver.com/v5/search/${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tap w-full border border-line text-[13px] tracking-[-0.01em] text-muted transition-colors active:bg-paper-deep"
          >
            네이버지도
          </a>
          <a
            href={`https://map.kakao.com/?q=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tap w-full border border-line text-[13px] tracking-[-0.01em] text-muted transition-colors active:bg-paper-deep"
          >
            카카오맵
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="tap w-full border border-line text-[13px] tracking-[-0.01em] text-muted transition-colors active:bg-paper-deep"
          >
            주소 복사
          </button>
        </div>
      </Reveal>
    </section>
  );
}
