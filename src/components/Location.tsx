"use client";

import Image from "next/image";
import { Bus, Car, Hand, MapPin, TrainFront } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { copyText } from "@/lib/clipboard";
import { kakaoMapHref, naverMapHref } from "@/lib/venue";

type TransportGroup = { icon: string; label: string; lines: readonly string[] };

const ICONS = {
  subway: TrainFront,
  bus: Bus,
  car: Car,
} as const;

/** 오시는 길 — 위치 + 지도 앱 버튼 + 교통 안내. */
export function Location() {
  const { showToast } = useToast();
  const { venue, address } = wedding.wedding;
  const floor: string = wedding.wedding.ceremonyFloor;
  const hall: string = wedding.wedding.hall;
  const tel: string = wedding.wedding.tel;
  const mapImage: string = wedding.location.mapImage;
  const embedQuery: string = wedding.location.mapEmbedQuery;
  /**
   * 구글 지도는 처음부터 띄우지 않고, 지도를 눌렀을 때 불러온다.
   * 휴대폰에서는 지도 코드가 청첩장과 같은 실행 줄을 함께 써서,
   * 미리 띄워 두면 그 근처를 스크롤할 때마다 화면이 멈칫한다.
   */
  const [mapLive, setMapLive] = useState(false);
  const embedSrc = embedQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(embedQuery)}&hl=ko&z=${wedding.location.mapEmbedZoom}&output=embed`
    : "";

  const handleCopy = async () => {
    const ok = await copyText(address);
    showToast(ok ? "주소가 복사되었습니다." : "복사에 실패했습니다.");
  };

  return (
    <section className="band pb-24" aria-labelledby="location-heading">
      <div className="edge">
        <SectionHeading id="location-heading" icon="pin" title={wedding.location.heading} />

        <Reveal className="mt-8 text-center">
          <p className="text-[length:calc(17px*var(--fs))] leading-snug tracking-[-0.01em] text-ink">{venue}</p>
          {(floor || hall) && (
            <p className="mt-1.5 text-[length:calc(14.5px*var(--fs))] text-muted">{[floor, hall].filter(Boolean).join(" ")}</p>
          )}
          <p className="mt-2.5 text-[length:calc(14.5px*var(--fs))] leading-relaxed text-muted">{address}</p>
          {tel && (
            <a
              href={`tel:${tel.replace(/-/g, "")}`}
              className="tap text-[length:calc(14px*var(--fs))] text-muted underline decoration-line underline-offset-4"
            >
              {tel}
            </a>
          )}
        </Reveal>
      </div>

      {/* 지도 — 누르면 그 자리에서 끌고 확대할 수 있는 구글 지도로 바뀐다. */}
      <Reveal delay={0.06} className="edge mt-7">
        <div className="relative h-[260px] w-full overflow-hidden rounded-[10px] border border-line bg-paper-deep">
          {embedSrc && mapLive ? (
            <iframe
              src={embedSrc}
              title={`${venue} 위치 지도`}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : embedSrc && mapImage ? (
            <button
              type="button"
              onClick={() => setMapLive(true)}
              aria-label="지도 움직여 보기"
              className="absolute inset-0 h-full w-full"
            >
              <Image
                src={mapImage}
                alt={`${venue} 위치 지도`}
                fill
                sizes="(max-width: 520px) 100vw, 520px"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/95 px-3.5 py-2 text-[length:calc(12.5px*var(--fs))] tracking-[-0.01em] text-ink shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
                <Hand size={14} strokeWidth={1.6} aria-hidden="true" className="text-accent-deep" />
                누르면 지도를 움직이고 확대할 수 있어요
              </span>
            </button>
          ) : mapImage ? (
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
              <p className="text-[length:calc(13px*var(--fs))] leading-relaxed text-faint">
                아래 버튼으로 지도 앱에서 길찾기를 열 수 있습니다.
              </p>
            </div>
          )}
        </div>
        {/* 그림 지도는 OpenStreetMap 타일로 만들어 저작자 표기가 필요하다. */}
        {!mapLive && mapImage && (
          <p className="mt-2 text-right text-[length:calc(11px*var(--fs))] tracking-[0.01em] text-faint">
            지도 © OpenStreetMap contributors
          </p>
        )}
      </Reveal>

      {/* 지도 앱 */}
      <Reveal delay={0.08} className="edge mt-3">
        <div className="grid grid-cols-3 gap-2">
          <a
            href={naverMapHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline whitespace-nowrap px-2 active:bg-paper-deep"
          >
            네이버지도
          </a>
          <a
            href={kakaoMapHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline whitespace-nowrap px-2 active:bg-paper-deep"
          >
            카카오맵
          </a>
          <button type="button" onClick={handleCopy} className="btn-outline whitespace-nowrap px-2 active:bg-paper-deep">
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
                <dt className="flex items-center gap-2 text-[length:calc(14.5px*var(--fs))] tracking-[-0.01em] text-accent">
                  <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                  {group.label}
                </dt>
                <dd className="mt-2.5">
                  {group.lines.map((line, i) => (
                    <p
                      key={i}
                      className="text-[length:calc(14px*var(--fs))] leading-[1.85] tracking-[-0.01em] text-[#4a473f]"
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
