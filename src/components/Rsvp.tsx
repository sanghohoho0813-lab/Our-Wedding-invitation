"use client";

import { useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { rsvpMode, submitRsvp } from "@/lib/backend";

const FIELD =
  "mt-2 w-full rounded-[6px] border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent-soft";

/** 참석 여부 전달 — 폼 내용은 lib/backend.ts 를 통해 저장된다. */
export function Rsvp() {
  const { rsvp } = wedding;
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"groom" | "bride">("groom");
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [headcount, setHeadcount] = useState(1);
  const [mealYn, setMealYn] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (!rsvp.enabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("성함을 입력해 주세요.");
      return;
    }

    // 받는 사람 번호가 아직 등록되지 않았으면 보내는 시늉을 하지 않는다.
    if (rsvpMode(side) === "unavailable") {
      showToast(
        `${side === "groom" ? "신랑" : "신부"} 연락처가 아직 등록되지 않았습니다.`,
      );
      return;
    }

    setSending(true);
    const ok = await submitRsvp({
      side,
      name: name.trim(),
      attending,
      headcount,
      mealYn,
      message: message.trim() || undefined,
    });
    setSending(false);

    if (ok) {
      setOpen(false);
      setName("");
      setMessage("");
      showToast(
        rsvpMode(side) === "sms"
          ? "문자 앱이 열립니다. 전송을 눌러주세요."
          : "참석 여부가 전달되었습니다.",
      );
    } else {
      showToast("전달에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <section className="edge pb-24" aria-labelledby="rsvp-heading">
      <SectionHeading title={rsvp.heading} body={rsvp.body} />

      <Reveal delay={0.06} className="mt-9 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-solid w-full max-w-[320px] active:btn-solid-active"
        >
          {rsvp.buttonLabel}
        </button>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title={rsvp.heading}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset>
            <legend className="text-[13.5px] text-muted">구분</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["groom", "bride"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSide(v)}
                  aria-pressed={side === v}
                  className={`tap rounded-[6px] border text-[14.5px] transition-colors ${
                    side === v
                      ? "border-accent-soft bg-accent-pale text-ink"
                      : "border-line bg-white text-muted"
                  }`}
                >
                  {v === "groom" ? "신랑측" : "신부측"}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="rsvp-name" className="text-[13.5px] text-muted">
              성함
            </label>
            <input
              id="rsvp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={20}
              className={FIELD}
            />
          </div>

          <fieldset>
            <legend className="text-[13.5px] text-muted">참석 여부</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setAttending(v)}
                  aria-pressed={attending === v}
                  className={`tap rounded-[6px] border text-[14.5px] transition-colors ${
                    attending === v
                      ? "border-accent-soft bg-accent-pale text-ink"
                      : "border-line bg-white text-muted"
                  }`}
                >
                  {v ? "참석" : "미참석"}
                </button>
              ))}
            </div>
          </fieldset>

          {attending && (
            <>
              <div>
                <label htmlFor="rsvp-count" className="text-[13.5px] text-muted">
                  참석 인원 (본인 포함)
                </label>
                <input
                  id="rsvp-count"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={20}
                  value={headcount}
                  onChange={(e) => setHeadcount(Math.max(1, Number(e.target.value) || 1))}
                  className={FIELD}
                />
              </div>

              <fieldset>
                <legend className="text-[13.5px] text-muted">식사 여부</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setMealYn(v)}
                      aria-pressed={mealYn === v}
                      className={`tap rounded-[6px] border text-[14.5px] transition-colors ${
                        mealYn === v
                          ? "border-accent-soft bg-accent-pale text-ink"
                          : "border-line bg-white text-muted"
                      }`}
                    >
                      {v ? "식사함" : "식사 안 함"}
                    </button>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          <div>
            <label htmlFor="rsvp-message" className="text-[13.5px] text-muted">
              전하실 말씀 (선택)
            </label>
            <textarea
              id="rsvp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={200}
              className={`${FIELD} resize-none`}
            />
          </div>

          <div>
            <button type="submit" disabled={sending} className="btn-solid w-full disabled:opacity-60">
              {sending ? "전달 중…" : "전달하기"}
            </button>
            {rsvpMode(side) === "sms" && (
              <p className="mt-3 text-center text-[12.5px] leading-relaxed text-faint">
                {side === "groom" ? "신랑" : "신부"}에게 문자로 전달됩니다. 문자 앱이 열리면
                내용을 확인하고 전송해 주세요.
              </p>
            )}
            {rsvpMode(side) === "unavailable" && (
              <p className="mt-3 text-center text-[12.5px] leading-relaxed text-faint">
                {side === "groom" ? "신랑" : "신부"} 연락처 등록 후 이용하실 수 있습니다.
              </p>
            )}
          </div>
        </form>
      </Modal>
    </section>
  );
}
