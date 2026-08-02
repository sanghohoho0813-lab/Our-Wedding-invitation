"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";

const TRANSPORT_GROUPS = [
  { key: "subway", label: "지하철" },
  { key: "bus", label: "버스" },
  { key: "parking", label: "주차" },
  { key: "etc", label: "기타" },
] as const;

/** 오시는 길 — 위치 안내와 교통 정보를 한 섹션에서 끝낸다. */
export function Location() {
  const { showToast } = useToast();
  const { venue, address, mapQuery, mapImage } = wedding.wedding;
  // 빈 문자열을 허용하는 선택 항목
  const hall: string = wedding.wedding.hall;
  const tel: string = wedding.wedding.tel;
  const query = encodeURIComponent(mapQuery || venue);
  const transportation = wedding.transportation;

  const handleCopy = async () => {
    const ok = await copyText(address);
    showToast(ok ? "주소가 복사되었습니다." : "복사에 실패했습니다.");
  };

  return (
    <section className="pb-20" aria-labelledby="location-heading">
      <div className="edge text-center">
        <Reveal>
          <p id="location-heading" className="eyebrow">
            Location
          </p>
          <p className="mt-7 text-[17px] leading-snug tracking-[-0.01em] text-ink">{venue}</p>
          {hall && <p className="mt-1.5 text-[13.5px] text-muted">{hall}</p>}
          <p className="mt-3 text-[13.5px] leading-relaxed text-faint">{address}</p>
          {tel && (
            <a
              href={`tel:${tel.replace(/-/g, "")}`}
              className="tap text-[13.5px] tracking-[0.02em] text-muted underline decoration-line underline-offset-4"
            >
              {tel}
            </a>
          )}
        </Reveal>
      </div>

      {/* 지도 — 모바일에서 과한 세로 공간을 쓰지 않도록 높이를 고정한다. */}
      <Reveal delay={0.06} className="edge">
        <div className="relative mt-8 h-[230px] w-full overflow-hidden rounded-[2px] border border-line bg-paper-deep">
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

      {/* 교통 — 3~5초 안에 찾을 수 있도록 라벨 + 짧은 문장만 */}
      <Reveal delay={0.12} className="edge">
        <dl className="mt-10 flex flex-col gap-5">
          {TRANSPORT_GROUPS.map(({ key, label }) => {
            const lines = transportation[key];
            if (!lines || lines.length === 0) return null;

            return (
              <div key={key} className="flex gap-5">
                <dt className="w-[42px] shrink-0 pt-[2px] text-[12px] tracking-[0.02em] text-faint">
                  {label}
                </dt>
                <dd className="min-w-0 flex-1">
                  {lines.map((line, i) => (
                    <p
                      key={i}
                      className="text-[14px] leading-[1.75] tracking-[-0.01em] text-[#3d3b37]"
                    >
                      {line}
                    </p>
                  ))}
                </dd>
              </div>
            );
          })}
        </dl>
      </Reveal>
    </section>
  );
}
