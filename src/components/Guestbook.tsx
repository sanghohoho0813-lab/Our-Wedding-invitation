"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/components/Toast";
import { wedding } from "@/config/wedding";
import {
  addGuestbookEntry,
  deleteGuestbookEntry,
  fetchGuestbook,
  type GuestbookEntry,
} from "@/lib/backend";

const FIELD =
  "mt-2 w-full rounded-[6px] border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent-soft";

function formatDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function Guestbook() {
  const { guestbook } = wedding;
  const { showToast } = useToast();

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GuestbookEntry | null>(null);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [sending, setSending] = useState(false);

  const reload = useCallback(async () => {
    setEntries(await fetchGuestbook());
  }, []);

  useEffect(() => {
    if (guestbook.enabled) void reload();
  }, [guestbook.enabled, reload]);

  if (!guestbook.enabled) return null;

  const visible = showAll ? entries : entries.slice(0, guestbook.pageSize);

  const handleWrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast("이름과 내용을 입력해 주세요.");
      return;
    }
    if (password.length < 4) {
      showToast("비밀번호는 4자 이상 입력해 주세요.");
      return;
    }

    setSending(true);
    await addGuestbookEntry({ name: name.trim(), message: message.trim(), password });
    setSending(false);

    setName("");
    setMessage("");
    setPassword("");
    setWriteOpen(false);
    await reload();
    showToast("방명록이 등록되었습니다.");
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteTarget) return;

    const ok = await deleteGuestbookEntry(deleteTarget.id, deletePassword);
    if (!ok) {
      showToast("비밀번호가 일치하지 않습니다.");
      return;
    }

    setDeleteTarget(null);
    setDeletePassword("");
    await reload();
    showToast("삭제되었습니다.");
  };

  return (
    <section className="edge pb-24" aria-labelledby="guestbook-heading">
      <SectionHeading title={guestbook.heading} />

      <Reveal delay={0.06} className="mt-9">
        {entries.length === 0 ? (
          <p className="py-6 text-center text-[14px] text-faint">
            첫 번째 축하 메시지를 남겨주세요.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {visible.map((entry) => (
              <li key={entry.id} className="card relative px-5 py-4">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(entry)}
                  aria-label={`${entry.name}님의 방명록 삭제`}
                  className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center text-faint active:text-ink"
                >
                  <X size={14} strokeWidth={1.5} aria-hidden="true" />
                </button>

                <p className="pr-10 text-[14px] tracking-[-0.01em]">
                  <span className="text-accent">{entry.name}</span>
                  <span className="ml-2.5 text-[12px] text-faint">
                    {formatDate(entry.createdAt)}
                  </span>
                </p>
                <p className="mt-2 whitespace-pre-line text-[14.5px] leading-[1.8] text-[#4a473f]">
                  {entry.message}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          {entries.length > guestbook.pageSize ? (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="btn-outline px-4 text-[13px]"
            >
              {showAll ? "접기" : "전체보기"}
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={() => setWriteOpen(true)}
            className="btn-outline px-5 text-[13px]"
          >
            작성
          </button>
        </div>
      </Reveal>

      {/* 작성 */}
      <Modal open={writeOpen} onClose={() => setWriteOpen(false)} title="방명록 작성">
        <form onSubmit={handleWrite} className="space-y-6">
          <div>
            <label htmlFor="gb-name" className="text-[13.5px] text-muted">
              이름
            </label>
            <input
              id="gb-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className={FIELD}
            />
          </div>

          <div>
            <label htmlFor="gb-message" className="text-[13.5px] text-muted">
              축하 메시지
            </label>
            <textarea
              id="gb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={300}
              className={`${FIELD} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="gb-password" className="text-[13.5px] text-muted">
              비밀번호 (삭제할 때 필요합니다)
            </label>
            <input
              id="gb-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={20}
              className={FIELD}
            />
          </div>

          <button type="submit" disabled={sending} className="btn-solid w-full disabled:opacity-60">
            {sending ? "등록 중…" : "등록하기"}
          </button>
        </form>
      </Modal>

      {/* 삭제 */}
      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="방명록 삭제">
        <form onSubmit={handleDelete} className="space-y-6">
          <p className="text-[14.5px] leading-relaxed text-muted">
            작성할 때 입력한 비밀번호를 넣어주세요.
          </p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            maxLength={20}
            aria-label="비밀번호"
            className={FIELD}
          />
          <button type="submit" className="btn-solid w-full">
            삭제하기
          </button>
        </form>
      </Modal>
    </section>
  );
}
