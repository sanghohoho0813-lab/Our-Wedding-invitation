/**
 * ─────────────────────────────────────────────────────────────
 *  방명록 데이터 레이어
 * ─────────────────────────────────────────────────────────────
 *  서버가 연결되어 있지 않은 동안에는 서로의 글을 볼 수 없으므로
 *  방명록을 아예 표시하지 않습니다.
 *  (축하 메시지는 별도 저장소를 씁니다 — lib/messageStore.ts)
 * ─────────────────────────────────────────────────────────────
 */

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  /** ISO 문자열 */
  createdAt: string;
};

const GUESTBOOK_KEY = "wedding:guestbook";

/** 백엔드가 연결되어 있는지 (지금은 항상 false) */
export function hasRemoteBackend() {
  return false;
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 실패는 조용히 넘어간다 (사파리 프라이빗 모드 등)
  }
}

/* ── 방명록 ───────────────────────────────────────────────── */

export async function fetchGuestbook(): Promise<GuestbookEntry[]> {
  // TODO(Supabase): select().order("created_at", { ascending: false })
  return readLocal<GuestbookEntry[]>(GUESTBOOK_KEY, []);
}

export async function addGuestbookEntry(input: {
  name: string;
  message: string;
  password: string;
}): Promise<GuestbookEntry> {
  // TODO(Supabase): insert 후 생성된 row 를 반환
  const entry: GuestbookEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    message: input.message,
    createdAt: new Date().toISOString(),
  };

  const list = readLocal<GuestbookEntry[]>(GUESTBOOK_KEY, []);
  writeLocal(GUESTBOOK_KEY, [entry, ...list]);

  // 삭제 확인용 비밀번호는 로컬에만 보관한다. (Supabase 연결 시 서버로 옮길 것)
  const pw = readLocal<Record<string, string>>(`${GUESTBOOK_KEY}:pw`, {});
  writeLocal(`${GUESTBOOK_KEY}:pw`, { ...pw, [entry.id]: input.password });

  return entry;
}

export async function deleteGuestbookEntry(id: string, password: string): Promise<boolean> {
  // TODO(Supabase): 서버에서 비밀번호를 검증하고 삭제
  const pw = readLocal<Record<string, string>>(`${GUESTBOOK_KEY}:pw`, {});
  if (pw[id] !== password) return false;

  const list = readLocal<GuestbookEntry[]>(GUESTBOOK_KEY, []);
  writeLocal(
    GUESTBOOK_KEY,
    list.filter((e) => e.id !== id),
  );
  return true;
}
