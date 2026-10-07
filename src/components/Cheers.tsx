"use client";

import { useCallback, useEffect, useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { insertRow, selectRows, supabaseReady } from "@/lib/supabase";

const FIELD =
  "mt-2 w-full rounded-[8px] border border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-faint/70 focus:border-accent-soft";

const MAX_MESSAGE = 500;

type Side = "groom" | "bride";
type Cheer = { id: number; side: Side; name: string; message: string; created_at: string };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
}

const SIDES: { value: Side; label: string; on: string }[] = [
  { value: "groom", label: "신랑측", on: "border-tint-groom-line bg-tint-groom text-tint-groom-ink" },
  { value: "bride", label: "신부측", on: "border-tint-bride-line bg-tint-bride text-tint-bride-ink" },
];

/**
 * 축하 메시지 — 신랑측 · 신부측, 이름, 메시지를 남기고 모두가 함께 본다.
 * Supabase 의 cheers 표에 저장된다. (lib/supabase.ts, supabase/setup.sql)
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
  const [list, setList] = useState<Cheer[]>([]);
  const [showAll, setShowAll] = useState(false);
  const ready = supabaseReady();

  const reload = useCallback(async () => {
    try {
      setList(
        await selectRows<Cheer>(
          "cheers",
          "select=id,side,name,message,created_at&order=created_at.desc&limit=500",
        ),
      );
    } catch {
      // 목록을 못 불러와도 남기기는 할 수 있게 둔다.
    }
  }, []);

  useEffect(() => {
    if (cheers.enabled && ready) void reload();
  }, [cheers.enabled, ready, reload]);

  if (!cheers.enabled) return null;

  const visible = showAll ? list : list.slice(0, cheers.pageSize);

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

    // 사람 눈에 보이지 않는 칸이 채워져 있으면 자동 전송 프로그램이다.
    if (website) {
      setDone(true);
      return;
    }
    if (!ready) return showToast("아직 준비 중이에요. 잠시 후 다시 시도해 주세요.");

    setSending(true);
    try {
      const saved = await insertRow<Cheer>("cheers", {
        side,
        name: name.trim(),
        message: message.trim(),
      });
      if (saved) setList((prev) => [saved, ...prev.filter((c) => c.id !== saved.id)]);
      setDone(true);
      setName("");
      setMessage("");
      setSide(null);
    } catch {
      showToast("전송에 실패했어요. 잠시 후 다시 시도해 주세요.");
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
      </Reveal>

      {list.length > 0 && (
        <Reveal delay={0.08} className="mt-10">
          <ul className="space-y-3">
            {visible.map((c) => (
              <li
                key={c.id}
                className={`rounded-[10px] border-l-[3px] px-4 py-4 ${
                  c.side === "groom"
                    ? "border-tint-groom-line bg-tint-groom"
                    : "border-tint-bride-line bg-tint-bride"
                }`}
              >
                <p className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 text-[14.5px] font-medium text-ink">
                    <span
                      className={`mr-2 text-[12px] ${
                        c.side === "groom" ? "text-tint-groom-ink" : "text-tint-bride-ink"
                      }`}
                    >
                      {c.side === "groom" ? "신랑측" : "신부측"}
                    </span>
                    {c.name}
                  </span>
                  <span className="shrink-0 text-[11.5px] text-faint">{formatDate(c.created_at)}</span>
                </p>
                <p className="mt-2 whitespace-pre-line break-words text-[14.5px] leading-[1.8] text-ink">
                  {c.message}
                </p>
              </li>
            ))}
          </ul>

          {list.length > cheers.pageSize && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                aria-expanded={showAll}
                className="btn-outline active:bg-paper-deep"
              >
                {showAll ? "접기" : `메시지 더보기 (${list.length - cheers.pageSize})`}
              </button>
            </div>
          )}
        </Reveal>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={cheers.heading}>
        {done ? (
          <div className="py-10 text-center">
            <p className="serif text-[18px] text-accent-deep">소중한 마음 고맙습니다</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
              남겨주신 메시지는
              <br />
              아래 목록에서 모두 함께 볼 수 있어요.
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
