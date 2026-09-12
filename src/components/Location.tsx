"use client";

import Image from "next/image";
import { Bus, Car, MapPin, TrainFront } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";

type TransportGroup = { icon: string; label: string; lines: readonly string[] };

const ICONS = {
  subway: TrainFront,
  bus: Bus,
  car: Car,
} as const;

/** 오시는 길 — 위치 + 지도 앱 버튼 + 교통 안내. */
export function Location() {
  const { showToast } = useToast();
  const { venue, address, mapQuery } = wedding.wedding;
  const hall: string = wedding.wedding.hall;
  const tel: string = wedding.wedding.tel;
  const mapImage: string = wedding.location.mapImage;
  const query = encodeURIComponent(mapQuery || venue);

  const handleCopy = async () => {
    const ok = await copyText(address);
    showToast(ok ? "주소가 복사되었습니다." : "복사에 실패했습니다.");
  };

  return (
    <section className="pb-24" aria-labelledby="location-heading">
      <div className="edge">
        <SectionHeading title={wedding.location.heading} />

        <Reveal className="mt-8 text-center">
          <p className="text-[17px] leading-snug tracking-[-0.01em] text-ink">{venue}</p>
          {hall && <p className="mt-1.5 text-[14.5px] text-muted">{hall}</p>}
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{address}</p>
          {tel && (
            <a
              href={`tel:${tel.replace(/-/g, "")}`}
              className="tap text-[14px] text-muted underline decoration-line underline-offset-4"
            >
              {tel}
            </a>
          )}
        </Reveal>
      </div>

      {/* 지도 */}
      <Reveal delay={0.06} className="edge mt-7">
        <div className="relative h-[230px] w-full overflow-hidden rounded-[10px] border border-line bg-paper-deep">
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
        {/* OpenStreetMap 타일로 만든 지도라 저작자 표기가 필요하다. */}
        {mapImage && (
          <p className="mt-2 text-right text-[11px] tracking-[0.01em] text-faint">
            지도 © OpenStreetMap contributors
          </p>
        )}
      </Reveal>

      {/* 지도 앱 */}
      <Reveal delay={0.08} className="edge mt-3">
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`https://map.naver.com/v5/search/${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline active:bg-paper-deep"
          >
            네이버지도
          </a>
          <a
            href={`https://map.kakao.com/?q=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline active:bg-paper-deep"
          >
            카카오맵
          </a>
          <button type="button" onClick={handleCopy} className="btn-outline active:bg-paper-deep">
            주소 복사
          </button>
        </div>
      </Reveal>

      {/* 교통 */}
      <Reveal delay={0.1} className="edge mt-10">
        <dl className="space-y-7">
          {(wedding.location.transport as readonly TransportGroup[]).map((group) => {
            if (group.lines.length === 0) return null;
            const Icon = ICONS[group.icon as keyof typeof ICONS] ?? MapPin;

            return (
              <div key={group.label}>
                <dt className="flex items-center gap-2 text-[14.5px] tracking-[-0.01em] text-accent">
                  <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                  {group.label}
                </dt>
                <dd className="mt-2.5">
                  {group.lines.map((line, i) => (
                    <p
                      key={i}
                      className="text-[14px] leading-[1.85] tracking-[-0.01em] text-[#4a473f]"
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
