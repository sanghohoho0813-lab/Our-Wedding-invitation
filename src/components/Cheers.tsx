"use client";

import { useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";

const FIELD =
  "mt-2 w-full rounded-[8px] border border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-faint/70 focus:border-accent-soft";

const MAX_MESSAGE = 500;

type Side = "groom" | "bride";

const SIDES: { value: Side; label: string; on: string }[] = [
  { value: "groom", label: "신랑측", on: "border-tint-groom-line bg-tint-groom text-tint-groom-ink" },
  { value: "bride", label: "신부측", on: "border-tint-bride-line bg-tint-bride text-tint-bride-ink" },
];

/**
 * 축하 메시지 — 신랑측 · 신부측, 이름, 메시지를 남긴다.
 * 문자 앱을 거치지 않고 청첩장 안에서 바로 저장된다. (api/messages)
 */
export function Cheers() {
  const { cheers } = wedding;
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [side, setSide] = useState<Side | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  /** 사람에게는 보이지 않는 칸 — 자동 전송 프로그램 거르기용 */
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);

  if (!cheers.enabled) return null;

  const openForm = () => {
    setDone(false);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!side) return showToast("신랑측 · 신부측을 골라 주세요.");
    if (!name.trim()) return showToast("성함을 입력해 주세요.");
    if (!message.trim()) return showToast("메시지를 입력해 주세요.");

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ side, name: name.trim(), message: message.trim(), website }),
      });

      if (res.ok) {
        setDone(true);
        setName("");
        setMessage("");
        setSide(null);
        return;
      }

      showToast(
        res.status === 503
          ? "아직 메시지를 받을 준비 중이에요. 잠시 후 다시 시도해 주세요."
          : res.status === 429
            ? "잠시 후 다시 보내 주세요."
            : "전송에 실패했어요. 잠시 후 다시 시도해 주세요.",
      );
    } catch {
      showToast("인터넷 연결을 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="edge pb-24" aria-labelledby="cheers-heading">
      <SectionHeading id="cheers-heading" icon="cheer" title={cheers.heading} body={cheers.body} />

      <Reveal delay={0.06} className="mt-9 text-center">
        <button
          type="button"
          onClick={openForm}
          className="btn-solid glow-hint w-full max-w-[320px] active:btn-solid-active"
        >
          {cheers.buttonLabel}
        </button>
        {cheers.note && <p className="mt-4 text-[12.5px] text-faint">{cheers.note}</p>}
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} title={cheers.heading}>
        {done ? (
          <div className="py-10 text-center">
            <p className="serif text-[18px] text-accent-deep">소중한 마음 고맙습니다</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
              남겨주신 메시지는 두 사람이
              <br />
              오래오래 간직할게요.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-outline mt-8 min-w-[160px] active:bg-paper-deep"
            >
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset>
              <legend className="text-[13.5px] text-muted">어느 쪽 하객이신가요?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SIDES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSide(s.value)}
                    aria-pressed={side === s.value}
                    className={`tap rounded-[8px] border text-[15px] transition-colors ${
                      side === s.value ? s.on : "border-line bg-white text-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="cheers-name" className="text-[13.5px] text-muted">
                성함
              </label>
              <input
                id="cheers-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={20}
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="cheers-message" className="text-[13.5px] text-muted">
                축하 메시지
              </label>
              <textarea
                id="cheers-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={MAX_MESSAGE}
                placeholder="두 사람에게 전하고 싶은 말을 적어 주세요."
                className={`${FIELD} resize-none leading-[1.7]`}
              />
              <p className="mt-1.5 text-right text-[11.5px] text-faint">
                {message.length} / {MAX_MESSAGE}
              </p>
            </div>

            {/* 자동 전송 프로그램 거르기용 — 사람에게는 보이지 않는다 */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                웹사이트
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

            <button type="submit" disabled={sending} className="btn-solid w-full disabled:opacity-60">
              {sending ? "보내는 중…" : "보내기"}
            </button>
          </form>
        )}
      </Modal>
    </section>
  );
}
