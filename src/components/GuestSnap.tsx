"use client";

import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";

/**
 * 게스트스냅.
 * 업로드 저장소(Supabase Storage 등)를 연결하기 전까지는
 * 버튼을 눌러도 준비 중 안내만 보여준다.
 */
export function GuestSnap() {
  const { guestSnap } = wedding;
  const { showToast } = useToast();

  if (!guestSnap.enabled) return null;

  return (
    <section className="edge pb-24" aria-labelledby="guestsnap-heading">
      <Reveal className="text-center">
        <h2 id="guestsnap-heading" className="section-title">
          {guestSnap.heading}
        </h2>
        <p className="mt-4 text-[14.5px] tracking-[-0.01em] text-muted">{guestSnap.subheading}</p>
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

          <button
            type="button"
            onClick={() => showToast("업로드는 준비 중입니다.")}
            className="btn-solid mt-7 w-full active:btn-solid-active"
          >
            {guestSnap.buttonLabel}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
