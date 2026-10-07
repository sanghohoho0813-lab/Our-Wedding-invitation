"use client";

import { useCallback, useEffect, useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import { rpc, selectRows, supabaseReady } from "@/lib/supabase";

const FIELD =
  "mt-2 w-full rounded-[8px] border border-line bg-white px-4 py-3 text-[length:calc(16px*var(--fs))] text-ink outline-none transition-colors placeholder:text-faint/70 focus:border-accent-soft";

const MAX_MESSAGE = 500;

type Side = "groom" | "bride";
type Cheer = { id: number; side: Side; name: string; message: string; created_at: string };

const SIDE_LABEL: Record<Side, string> = { groom: "신랑측", bride: "신부측" };

/** 10월 7일 오후 3:05 */
function formatTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${m}`;
}

/** 수정 · 삭제 — 남길 때 정한 비밀번호(또는 신랑 · 신부의 관리자 비밀번호)로만 된다. */
function ManageCheer({
  target,
  mode,
  onClose,
  onUpdated,
  onDeleted,
}: {
  target: Cheer | null;
  mode: "edit" | "delete";
  onClose: () => void;
  onUpdated: (c: Cheer) => void;
  onDeleted: (id: number) => void;
}) {
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPassword("");
    setMessage(target?.message ?? "");
  }, [target]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || busy) return;
    if (!password) return showToast("비밀번호를 입력해 주세요.");
    if (mode === "edit" && !message.trim()) return showToast("메시지를 입력해 주세요.");

    setBusy(true);
    try {
      if (mode === "edit") {
        const updated = await rpc<Cheer | null>("update_cheer", {
          p_id: target.id,
          p_message: message.trim(),
          p_password: password,
        });
        if (!updated) return showToast("비밀번호가 맞지 않아요.");
        onUpdated(updated);
        showToast("메시지를 고쳤어요.");
      } else {
        const ok = await rpc<boolean>("delete_cheer", { p_id: target.id, p_password: password });
        if (!ok) return showToast("비밀번호가 맞지 않아요.");
        onDeleted(target.id);
        showToast("메시지를 지웠어요.");
      }
      onClose();
    } catch {
      showToast("잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={target !== null}
      onClose={onClose}
      title={mode === "edit" ? "메시지 고치기" : "메시지 지우기"}
    >
      <form onSubmit={submit} className="space-y-6">
        {mode === "edit" ? (
          <div>
            <label htmlFor="manage-message" className="text-[length:calc(13.5px*var(--fs))] text-muted">
              축하 메시지
            </label>
            <textarea
              id="manage-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={MAX_MESSAGE}
              className={`${FIELD} resize-none leading-[1.7]`}
            />
          </div>
        ) : (
          <p className="text-[length:calc(14.5px*var(--fs))] leading-relaxed text-ink">
            <span className="text-muted">{target && SIDE_LABEL[target.side]}</span> {target?.name}님의
            메시지를 지울까요?
          </p>
        )}

        <div>
          <label htmlFor="manage-password" className="text-[length:calc(13.5px*var(--fs))] text-muted">
            남길 때 정한 비밀번호
          </label>
          <input
            id="manage-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            maxLength={30}
            className={FIELD}
          />
        </div>

        <button type="submit" disabled={busy} className="btn-solid w-full disabled:opacity-60">
          {busy ? "확인 중…" : mode === "edit" ? "고치기" : "지우기"}
        </button>
      </form>
    </Modal>
  );
}

/**
 * 축하 메시지 — 신랑측 · 신부측, 이름, 메시지를 남기고 모두가 함께 본다.
 * 남길 때 정한 비밀번호로 본인 글만 고치고 지울 수 있다. (supabase/02-passwords.sql)
 */
export function Cheers() {
  const { cheers } = wedding;
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [side, setSide] = useState<Side | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  /** 사람에게는 보이지 않는 칸 — 자동 전송 프로그램 거르기용 */
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [list, setList] = useState<Cheer[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [manage, setManage] = useState<{ target: Cheer; mode: "edit" | "delete" } | null>(null);
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

  const closeManage = useCallback(() => setManage(null), []);

  if (!cheers.enabled) return null;

  const visible = showAll ? list : list.slice(0, cheers.pageSize);

  const openForm = () => {
    setDone(false);
    setOpen(true);
  };

  /** 추천 문구 — 비어 있으면 채우고, 이미 쓴 글이 있으면 뒤에 붙인다. */
  const applyPreset = (text: string) => {
    setMessage((prev) => {
      const next = prev.trim() ? `${prev.trimEnd()}\n${text}` : text;
      return next.slice(0, MAX_MESSAGE);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!side) return showToast("신랑측 · 신부측을 골라 주세요.");
    if (!name.trim()) return showToast("성함을 입력해 주세요.");
    if (!message.trim()) return showToast("메시지를 입력해 주세요.");
    if (password.length < 4) return showToast("비밀번호를 4자 이상 정해 주세요.");

    // 사람 눈에 보이지 않는 칸이 채워져 있으면 자동 전송 프로그램이다.
    if (website) {
      setDone(true);
      return;
    }
    if (!ready) return showToast("아직 준비 중이에요. 잠시 후 다시 시도해 주세요.");

    setSending(true);
    try {
      const saved = await rpc<Cheer>("add_cheer", {
        p_side: side,
        p_name: name.trim(),
        p_message: message.trim(),
        p_password: password,
      });
      if (saved) setList((prev) => [saved, ...prev.filter((c) => c.id !== saved.id)]);
      setDone(true);
      setName("");
      setMessage("");
      setPassword("");
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
          <ul className="divide-y divide-line border-y border-line">
            {visible.map((c) => (
              <li key={c.id} className="py-5">
                <p className="flex items-baseline gap-2">
                  <span className="shrink-0 text-[length:calc(12.5px*var(--fs))] text-accent">{SIDE_LABEL[c.side]}</span>
                  <span className="min-w-0 truncate text-[length:calc(15px*var(--fs))] font-medium text-ink">{c.name}</span>
                </p>
                <p className="mt-2 whitespace-pre-line break-words text-[length:calc(14.5px*var(--fs))] leading-[1.8] text-ink">
                  {c.message}
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[length:calc(11.5px*var(--fs))] text-faint">{formatTime(c.created_at)}</span>
                  <span className="-mr-2 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => setManage({ target: c, mode: "edit" })}
                      className="tap px-2 text-[length:calc(12px*var(--fs))] text-faint"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => setManage({ target: c, mode: "delete" })}
                      className="tap px-2 text-[length:calc(12px*var(--fs))] text-faint"
                    >
                      삭제
                    </button>
                  </span>
                </div>
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
            <p className="serif text-[length:calc(18px*var(--fs))] text-accent-deep">소중한 마음 고맙습니다</p>
            <p className="mt-3 text-[length:calc(14.5px*var(--fs))] leading-relaxed text-muted">
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
              <legend className="text-[length:calc(13.5px*var(--fs))] text-muted">어느 쪽 하객이신가요?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["groom", "bride"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSide(v)}
                    aria-pressed={side === v}
                    className={`tap rounded-[8px] border text-[length:calc(15px*var(--fs))] transition-colors ${
                      side === v
                        ? "border-accent-soft bg-accent-pale text-ink"
                        : "border-line bg-white text-muted"
                    }`}
                  >
                    {SIDE_LABEL[v]}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="cheers-name" className="text-[length:calc(13.5px*var(--fs))] text-muted">
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
              <label htmlFor="cheers-message" className="text-[length:calc(13.5px*var(--fs))] text-muted">
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
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {cheers.presets.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => applyPreset(text)}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-[length:calc(12.5px*var(--fs))] text-muted active:bg-paper-deep"
                  >
                    {text}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-right text-[length:calc(11.5px*var(--fs))] text-faint">
                {message.length} / {MAX_MESSAGE}
              </p>
            </div>

            <div>
              <label htmlFor="cheers-password" className="text-[length:calc(13.5px*var(--fs))] text-muted">
                비밀번호 <span className="text-faint">(나중에 고치거나 지울 때 필요해요)</span>
              </label>
              <input
                id="cheers-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                maxLength={30}
                placeholder="4자 이상"
                className={FIELD}
              />
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

      <ManageCheer
        target={manage?.target ?? null}
        mode={manage?.mode ?? "delete"}
        onClose={closeManage}
        onUpdated={(c) => setList((prev) => prev.map((x) => (x.id === c.id ? c : x)))}
        onDeleted={(id) => setList((prev) => prev.filter((x) => x.id !== id))}
      />
    </section>
  );
}
