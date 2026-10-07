"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Side = "groom" | "bride";
type Message = { id: string; side: Side; name: string; message: string; createdAt: string };
type Filter = "all" | Side;

/** 한 번 맞게 넣은 비밀번호는 이 탭을 닫기 전까지 기억한다. */
const PW_KEY = "wedding:messages-pw";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "groom", label: "신랑측" },
  { value: "bride", label: "신부측" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * 신랑 · 신부만 보는 축하 메시지 모아보기.
 * 비밀번호는 Vercel 환경 변수 MESSAGES_PASSWORD 에 넣어 둔 값이다.
 */
export function MessagesInbox() {
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        headers: { "x-messages-password": pw },
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as { messages: Message[] };
        setMessages(data.messages);
        try {
          sessionStorage.setItem(PW_KEY, pw);
        } catch {
          // 저장 못 해도 이번에는 볼 수 있다.
        }
        return;
      }
      try {
        sessionStorage.removeItem(PW_KEY);
      } catch {}
      setMessages(null);
      setError(
        res.status === 401
          ? "비밀번호가 맞지 않아요."
          : res.status === 503
            ? "아직 저장소나 비밀번호가 연결되지 않았어요."
            : "불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    } catch {
      setError("인터넷 연결을 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(PW_KEY);
      if (saved) {
        setPassword(saved);
        void load(saved);
      }
    } catch {}
  }, [load]);

  const counts = useMemo(() => {
    const list = messages ?? [];
    return {
      all: list.length,
      groom: list.filter((m) => m.side === "groom").length,
      bride: list.filter((m) => m.side === "bride").length,
    };
  }, [messages]);

  const visible = (messages ?? []).filter((m) => filter === "all" || m.side === filter);

  return (
    <main className="edge min-h-[100svh] pb-20 pt-14">
      <h1 className="section-title text-center">축하 메시지</h1>

      {messages === null ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password) void load(password);
          }}
          className="mx-auto mt-10 max-w-[320px]"
        >
          <label htmlFor="inbox-pw" className="block text-center text-[13.5px] text-muted">
            신랑 · 신부만 볼 수 있어요. 비밀번호를 입력해 주세요.
          </label>
          <input
            id="inbox-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-4 w-full rounded-[8px] border border-line bg-white px-4 py-3 text-[16px] text-ink outline-none focus:border-accent-soft"
          />
          <button type="submit" disabled={loading} className="btn-solid mt-3 w-full disabled:opacity-60">
            {loading ? "여는 중…" : "열기"}
          </button>
          {error && <p className="mt-4 text-center text-[13px] text-tint-bride-ink">{error}</p>}
        </form>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-3 gap-2" role="tablist" aria-label="보기">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={`tap rounded-[8px] border text-[14px] ${
                  filter === f.value
                    ? "border-accent-soft bg-accent-pale text-ink"
                    : "border-line bg-white text-muted"
                }`}
              >
                {f.label} {counts[f.value]}
              </button>
            ))}
          </div>

          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={() => void load(password)}
              disabled={loading}
              className="tap px-2 text-[13px] text-muted underline decoration-line underline-offset-4"
            >
              {loading ? "불러오는 중…" : "새로고침"}
            </button>
          </div>

          {visible.length === 0 ? (
            <p className="mt-16 text-center text-[14px] text-faint">아직 남겨진 메시지가 없어요.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {visible.map((m) => (
                <li
                  key={m.id}
                  className={`rounded-[10px] border-l-[3px] px-4 py-4 ${
                    m.side === "groom"
                      ? "border-tint-groom-line bg-tint-groom"
                      : "border-tint-bride-line bg-tint-bride"
                  }`}
                >
                  <p className="flex items-baseline justify-between gap-3">
                    <span className="text-[15px] font-medium text-ink">
                      <span
                        className={`mr-2 text-[12.5px] ${
                          m.side === "groom" ? "text-tint-groom-ink" : "text-tint-bride-ink"
                        }`}
                      >
                        {m.side === "groom" ? "신랑측" : "신부측"}
                      </span>
                      {m.name}
                    </span>
                    <span className="shrink-0 text-[11.5px] text-faint">{formatDate(m.createdAt)}</span>
                  </p>
                  <p className="mt-2 whitespace-pre-line text-[14.5px] leading-[1.8] text-ink">
                    {m.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
