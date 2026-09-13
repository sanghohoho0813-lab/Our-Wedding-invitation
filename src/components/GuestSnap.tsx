"use client";

import { DraftMark } from "@/components/DraftMark";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";

/**
 * 하객 참여형 게스트스냅.
 *
 * 업로드 저장소(Supabase Storage 등)는 아직 연결되어 있지 않다.
 * 이미 되는 것처럼 보이면 안 되므로, 연결 전에는 버튼을 누를 수 없게 하고
 * 언제 열리는지만 알려준다. (config 의 guestSnap.uploadReady 로 전환)
 */
export function GuestSnap() {
  const { guestSnap } = wedding;
  const { showToast } = useToast();
  // as const 로 좁혀지지 않도록 boolean 으로 받는다.
  const ready: boolean = guestSnap.uploadReady;

  if (!guestSnap.enabled) return null;

  return (
    <section className="edge pb-24" aria-labelledby="guestsnap-heading">
      <Reveal className="text-center">
        <h2 id="guestsnap-heading" className="section-title">
          {guestSnap.heading}
        </h2>
        <p className="mt-4 text-[14.5px] leading-relaxed tracking-[-0.01em] text-muted">
          {guestSnap.subheading}
        </p>
      </Reveal>

      <Reveal delay={0.06} className="mt-8">
        <PhotoSlot src={guestSnap.image} alt={guestSnap.imageAlt} ratio="4 / 3" />
      </Reveal>

      <Reveal delay={0.08}>
        <div className="card mt-6 px-6 py-8 text-center">
          {guestSnap.notes.map((line, i) =>
            line === "" ? (
              <div key={i} className="h-4" aria-hidden="true" />
            ) : (
              <p key={i} className="text-[14px] leading-[1.85] tracking-[-0.01em] text-[#4a473f]">
                {line}
              </p>
            ),
          )}

          {guestSnap.reward.enabled && guestSnap.reward.text && (
            <div className="mt-7 border-t border-line pt-7">
              <p className="text-[14px] leading-[1.85] tracking-[-0.01em] text-accent">
                {guestSnap.reward.text}
              </p>
              {guestSnap.reward.draft && (
                <DraftMark status={guestSnap.reward.draft} className="mt-2.5" />
              )}
            </div>
          )}

          {ready ? (
            <button
              type="button"
              onClick={() => showToast("업로드 화면을 준비 중입니다.")}
              className="btn-solid mt-7 w-full active:btn-solid-active"
            >
              {guestSnap.buttonLabel}
            </button>
          ) : (
            <>
              {/* 아직 열리지 않은 기능이므로 눌리는 버튼처럼 보이게 하지 않는다. */}
              <p
                aria-disabled="true"
                className="mt-7 w-full rounded-[8px] border border-dashed border-line py-4 text-[14.5px] tracking-[-0.01em] text-faint"
              >
                {guestSnap.buttonLabel}
              </p>
              <p className="mt-3 text-[12.5px] tracking-[-0.01em] text-accent">
                {guestSnap.pendingLabel}
              </p>
            </>
          )}

          {guestSnap.archiveNote && (
            <p className="mt-6 text-[11.5px] leading-relaxed text-faint">{guestSnap.archiveNote}</p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
