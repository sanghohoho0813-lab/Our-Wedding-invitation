/**
 * ─────────────────────────────────────────────────────────────
 *  참석 여부(RSVP) · 방명록 데이터 레이어
 * ─────────────────────────────────────────────────────────────
 *  서버가 연결되어 있지 않은 동안에는
 *
 *    - 참석 여부 : 하객의 문자 앱을 열어 신랑에게 바로 보냅니다.
 *                 (서버 없이도 답이 실제로 신랑에게 도착합니다)
 *    - 방명록   : 서로의 글을 볼 수 없으므로 아예 표시하지 않습니다.
 *
 *  Supabase 를 붙이면 hasRemoteBackend() 가 true 가 되면서
 *  두 기능 모두 원래의 저장 방식으로 돌아갑니다. (README 6-2 참고)
 * ─────────────────────────────────────────────────────────────
 */
import { wedding } from "@/config/wedding";
import { isPlaceholderPhone } from "@/lib/placeholder";

export type RsvpInput = {
  /** "groom" | "bride" */
  side: "groom" | "bride";
  name: string;
  attending: boolean;
  /** 본인 포함 참석 인원 */
  headcount: number;
  mealYn: boolean;
  message?: string;
};

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  /** ISO 문자열 */
  createdAt: string;
};

const RSVP_KEY = "wedding:rsvp";
const GUESTBOOK_KEY = "wedding:guestbook";

/** 백엔드가 연결되어 있는지 (지금은 항상 false) */
export function hasRemoteBackend() {
  return false;
}

/**
 * 참석 여부를 받을 사람의 번호.
 * 신랑측 하객은 신랑에게, 신부측 하객은 신부에게 보낸다.
 * 해당 번호가 아직 예시값이면 "" 를 돌려준다.
 */
export function rsvpRecipient(side: RsvpInput["side"]) {
  const phone = side === "bride" ? wedding.bride.phone : wedding.groom.phone;
  return isPlaceholderPhone(phone) ? "" : phone;
}

/**
 * 참석 여부를 어떻게 전달할지.
 *  - "remote"      : 서버에 저장
 *  - "sms"         : 하객의 문자 앱으로 신랑·신부에게 전송
 *  - "unavailable" : 받을 번호가 아직 등록되지 않음 (전송을 시도하지 않는다)
 */
export function rsvpMode(side?: RsvpInput["side"]): "remote" | "sms" | "unavailable" {
  if (hasRemoteBackend()) return "remote";
  if (!side) {
    // 어느 쪽이든 보낼 수 있는 번호가 하나라도 있으면 문자 모드로 본다.
    return rsvpRecipient("groom") || rsvpRecipient("bride") ? "sms" : "unavailable";
  }
  return rsvpRecipient(side) ? "sms" : "unavailable";
}

/** 문자로 보낼 참석 여부 내용 */
export function buildRsvpMessage(input: RsvpInput) {
  const lines = [
    `[${wedding.groom.name} ♥ ${wedding.bride.name} 결혼식]`,
    `${input.side === "groom" ? "신랑측" : "신부측"} ${input.name}`,
    input.attending ? `참석 (${input.headcount}명)` : "미참석",
  ];
  if (input.attending) lines.push(input.mealYn ? "식사 O" : "식사 X");
  if (input.message) lines.push(`\n${input.message}`);
  return lines.join("\n");
}

/**
 * 문자 앱을 여는 링크.
 * iOS 와 안드로이드의 형식이 달라서 양쪽 모두에서 동작하는 "?&" 형태를 쓴다.
 */
export function rsvpSmsHref(input: RsvpInput) {
  const to = rsvpRecipient(input.side).replace(/[^0-9+]/g, "");
  if (!to) return "";
  return `sms:${to}?&body=${encodeURIComponent(buildRsvpMessage(input))}`;
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

/* ── 참석 여부 ────────────────────────────────────────────── */

export async function submitRsvp(input: RsvpInput): Promise<boolean> {
  const mode = rsvpMode(input.side);

  // 받을 번호가 아직 없으면 문자 앱을 열지 않는다. (010-0000-0000 로 발송 방지)
  if (mode === "unavailable") return false;

  if (mode === "sms") {
    if (typeof window === "undefined") return false;
    const href = rsvpSmsHref(input);
    if (!href) return false;
    // 보낸 내용을 브라우저에도 남겨 두어 "이미 전달했는지" 확인할 수 있게 한다.
    writeLocal(RSVP_KEY, [...readLocal<RsvpInput[]>(RSVP_KEY, []), input]);
    window.location.href = href;
    return true;
  }

  // TODO(Supabase): await supabase.from("rsvp").insert(input)
  const list = readLocal<RsvpInput[]>(RSVP_KEY, []);
  writeLocal(RSVP_KEY, [...list, input]);
  return true;
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
